import {
  CopyObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  NoSuchKey,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { Logger } from '@us-epa-camd/easey-common/logger';
import {
  currentDateTime,
  settlePromises,
  withTransaction,
} from '@us-epa-camd/easey-common/utilities/functions';
import { XMLBuilder } from 'fast-xml-parser';
import { EntityManager } from 'typeorm';

import { MatsDataSubmissionFileNamesDTO } from '../dto/mats-data-submission-create-payload.dto';
import {
  MatsDataSubmissionBaseDTO,
  MatsDataSubmissionDTO,
} from '../dto/mats-data-submission.dto';
import { MatsDataSubmissionPayloadFile } from '../entities/mats-data-submission-payload-file.entity';
import { MatsDataSubmissionPollutant } from '../entities/mats-data-submission-pollutant.entity';
import { MatsDataSubmissionTestMethod } from '../entities/mats-data-submission-test-method.entity';
import { MatsDataSubmissionMap } from '../maps/mats-data-submission.map';
import { MatsDataSubmissionRepository } from './mats-data-submission.repository';

export const METADATA_XML_FILE_NAME = 'Metadata.xml';

@Injectable()
export class MatsDataSubmissionService {
  private s3Client: S3Client;

  constructor(
    private readonly configService: ConfigService,
    private readonly entityManager: EntityManager,
    private readonly logger: Logger,
    private readonly map: MatsDataSubmissionMap,
    private readonly repository: MatsDataSubmissionRepository,
  ) {
    this.logger.setContext(MatsDataSubmissionService.name);
  }

  private async copyFile(sourcePath: string, destinationPath: string) {
    await this.getS3Client().send(
      new CopyObjectCommand({
        Bucket: this.getS3Bucket(),
        CopySource: `${this.getS3Bucket()}/${sourcePath}`,
        Key: destinationPath,
      }),
    );
  }

  private async copyFilesAndCreateRecords(
    fileNames: MatsDataSubmissionFileNamesDTO,
    submissionId: string,
    locationId: string,
    trx?: EntityManager,
  ) {
    await settlePromises(
      Object.entries(fileNames)
        // Map the array of entries to a single array of tuples.
        .reduce((acc, [key, fileName]: [string, string | string[]]) => {
          if (Array.isArray(fileName)) {
            acc.push(...fileName.map((f) => [key, f]));
          } else {
            acc.push([key, fileName]);
          }
          return acc;
        }, [])
        .map(async ([key, fileName]: [string, string]) => {
          if (!fileName) return;

          // Copy the file from the staging directory to the `submissionId` directory in S3.
          await this.copyFile(
            this.createStagingFilePath(locationId, fileName),
            this.createSubmissionFilePath(submissionId, fileName),
          );
          // Add the MATS payload file record.
          await this.createMatsDataSubmissionPayloadFile(
            fileName,
            submissionId,
            trx,
            key === 'ertFile',
          );
        }),
    );
  }

  createStagingFilePath(locationId: string, fileName: string) {
    return `tmp/${locationId}/${fileName}`;
  }

  private createSubmissionFilePath(directory: string, fileName: string) {
    return `${directory}/${fileName}`;
  }

  private async createMatsDataSubmission(
    payload: MatsDataSubmissionBaseDTO,
    userId: string,
    userEmail: string,
    trx?: EntityManager,
  ): Promise<string> {
    const repository = withTransaction(this.repository, trx);

    const record = repository.create({
      addTime: currentDateTime(),
      averagingGroupCode: payload.averagingGroupCode,
      facilityId: payload.facilityId,
      locationId: payload.locationId,
      monitorPlanId: payload.monitorPlanId,
      originalSubmissionId: payload.originalSubmissionId,
      reportTypeCode: payload.reportTypeCode,
      testComment: payload.testComment,
      testDate: payload.testDate,
      testNumber: payload.testNumber,
      quarter: payload.quarter,
      year: payload.year,
      updateTime: currentDateTime(),
      userEmail: userEmail,
      userId,
    });
    await repository.save(record);

    this.logger.debug(
      'Created MATS Data Submission record',
      JSON.stringify(record),
    );

    return record.id;
  }

  private async createMatsDataSubmissionPayloadFile(
    fileName: string,
    submissionId: string,
    trx?: EntityManager,
    isErtFile = false,
  ) {
    const repository = (trx ?? this.entityManager).getRepository(
      MatsDataSubmissionPayloadFile,
    );

    const filePath = this.createSubmissionFilePath(submissionId, fileName);
    const mimetype = await this.getRemoteFileMimeType(filePath);
    const fileTypeCode = (() => {
      if (isErtFile) return 'ERT';

      switch (mimetype) {
        case 'application/xml':
        case 'text/xml':
          return 'XML';
        case 'application/pdf':
          return 'PDF';
        case 'application/json':
        case 'text/json':
          return 'JSON';
        default:
          throw new EaseyException(
            new Error(`Unsupported file type: ${mimetype}`),
            HttpStatus.BAD_REQUEST,
          );
      }
    })();

    const record = repository.create({
      fileName,
      fileTypeCode,
      submissionId,
      tempS3BucketFilePath: filePath,
      tempS3BucketFileTime: currentDateTime(),
    });
    await repository.save(record);

    return record.id;
  }

  private async createMatsDataSubmissionPollutants(
    pollutantCodes: string[],
    submissionId: string,
    trx?: EntityManager,
  ): Promise<string[]> {
    const repository = (trx ?? this.entityManager).getRepository(
      MatsDataSubmissionPollutant,
    );

    const records = pollutantCodes.map((code) => {
      return repository.create({
        pollutantCode: code,
        submissionId,
      });
    });
    await repository.save(records);

    return records.map((record) => record.id);
  }

  private async createMatsDataSubmissionTestMethods(
    testMethodCodes: string[],
    submissionId: string,
    trx?: EntityManager,
  ): Promise<string[]> {
    const repository = (trx ?? this.entityManager).getRepository(
      MatsDataSubmissionTestMethod,
    );

    const records = testMethodCodes.map((code) => {
      return repository.create({
        testMethodCode: code,
        submissionId,
      });
    });
    await repository.save(records);

    return records.map((record) => record.id);
  }

  async deleteFile(filePath: string) {
    await this.getS3Client().send(
      new DeleteObjectCommand({
        Bucket: this.getS3Bucket(),
        Key: filePath,
      }),
    );
  }

  async deleteTempFile(fileName: string, locationId: string) {
    try {
      const filePath = this.createStagingFilePath(locationId, fileName);
      await this.deleteFile(filePath);
    } catch (err) {
      this.logger.error(`Error deleting file: ${err.message}`);
      throw new EaseyException(
        new Error('An error occurred while deleting the file'),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteMatsDataSubmission(submissionId: string) {
    try {
      await this.repository.delete(submissionId);
      await this.deleteSubmissionFiles(submissionId);
    } catch (e) {
      throw new EaseyException(
        new Error(
          `Error deleting MATS Data Submission record [${submissionId}]`,
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
        e,
      );
    }
  }

  private async deleteSubmissionFiles(submissionId: string) {
    let isTruncated = true;
    let continuationToken: string;

    while (isTruncated) {
      const listCommand = new ListObjectsV2Command({
        Bucket: this.getS3Bucket(),
        Prefix: `${submissionId}/`,
        ContinuationToken: continuationToken,
      });

      const listResponse = await this.getS3Client().send(listCommand);
      const objects = listResponse.Contents ?? [];

      if (objects.length > 0) {
        const deleteCommand = new DeleteObjectsCommand({
          Bucket: this.getS3Bucket(),
          Delete: {
            Objects: objects.map((obj) => ({ Key: obj.Key })),
          },
        });
        const deleteResponse = await this.getS3Client().send(deleteCommand);
        this.logger.debug(
          `Deleted: ${deleteResponse.Deleted?.map((obj) => obj.Key)}`,
        );
      }

      isTruncated = listResponse.IsTruncated ?? false;
      continuationToken = listResponse.NextContinuationToken;
    }
  }

  private async generateMetadataXml(
    submissionId: string,
    trx?: EntityManager,
  ): Promise<string> {
    const record = await withTransaction(this.repository, trx).findOne({
      where: {
        id: submissionId,
      },
      relations: {
        facility: true,
        location: {
          stackPipe: true,
          unit: true,
        },
        pollutants: true,
        testMethods: true,
      },
    });
    if (!record) {
      throw new EaseyException(
        new Error(`Submission with ID ${submissionId} not found`),
        HttpStatus.NOT_FOUND,
      );
    }

    const xmlData = {
      MatsTransitionMetadata: {
        SubmissionInfo: {
          SubmissionId: record.id,
          SubmissionDate: record.addTime.toISOString(),
          IsResubmission: record.originalSubmissionId ? 'true' : 'false',
          OriginalSubmissionId: record.originalSubmissionId,
        },
        CdxUser: record.userId,
        ReportTypeCode: record.reportTypeCode,
        OrisCode: record.facility.orisCode,
        FrsId: record.facility.frsId ?? '',
        LocationName:
          record.location.stackPipe?.name ?? record.location.unit?.name ?? null,
        AveragingGroupCode: record.averagingGroupCode,
        PollutantList: {
          PollutantCode: record.pollutants.map((p) => p.metadataPollutantCode),
        },
        TestMethodList: {
          TestMethodCode: record.testMethods.map((tm) => tm.code),
        },
        TestNumber: record.testNumber,
        TestDate: record.testDate?.toISOString().substring(0, 10) ?? null,
        TestComment: record.testComment,
      },
    };

    const xmlString = this.generateXmlString(xmlData);
    this.logger.debug('Generated Metadata XML', xmlString);

    return xmlString;
  }

  private generateXmlString(data: Record<string, unknown>) {
    const builder = new XMLBuilder({
      format: true,
      ignoreAttributes: false,
      suppressEmptyNode: false,
    });

    return builder.build(data);
  }

  async getMatsDataSubmission(id: string): Promise<MatsDataSubmissionDTO> {
    const result = await this.repository.getMatsDataSubmission(id);

    return this.map.one(result);
  }

  async getMatsDataSubmissions(
    monPlanIds: string[],
  ): Promise<MatsDataSubmissionDTO[]> {
    if (!monPlanIds || monPlanIds.length === 0) {
      throw new EaseyException(
        new Error('At least one Monitor Plan ID must be provided'),
        HttpStatus.BAD_REQUEST,
      );
    }
    const result = await this.repository.getMatsDataSubmissions(monPlanIds);

    return this.map.many(result);
  }

  async getRemoteFileMimeType(filePath: string): Promise<string> {
    const command = new HeadObjectCommand({
      Bucket: this.getS3Bucket(),
      Key: filePath,
    });

    try {
      const res = await this.getS3Client().send(command);
      return res.ContentType ?? null;
    } catch (err) {
      this.logger.error('Error getting MIME type', err);
      return null;
    }
  }

  private getS3Bucket(): string {
    const bucket = this.configService.get('app.matsImportBucket');

    if (!bucket) {
      throw new EaseyException(
        new Error('Missing S3 bucket name'),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return bucket;
  }

  private getS3Client() {
    if (this.s3Client) return this.s3Client;

    const accessKeyId = this.configService.get('app.matsImportBucketAccessKey');
    const secretAccessKey = this.configService.get(
      'app.matsImportBucketSecretAccessKey',
    );
    const region = this.configService.get('app.awsRegion');

    if (!accessKeyId || !secretAccessKey || !region) {
      throw new EaseyException(
        new Error('Missing S3 credentials or region'),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    this.s3Client = new S3Client({
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      region,
    });

    return this.s3Client;
  }

  async initializeMatsDataSubmission(
    metadata: MatsDataSubmissionBaseDTO,
    fileNames: MatsDataSubmissionFileNamesDTO,
    userId: string,
    locationId: string,
    userEmail:string
  ): Promise<string> {
    let submissionId: string | null = null;

    try {
      await this.entityManager.transaction(async (trx: EntityManager) => {
        // Create the MATS Data Submission record.
        submissionId = await this.createMatsDataSubmission(
          metadata,
          userId,
          userEmail,
          trx,
        );

        // Create child MATS_DATA_SUBMISSION_POLLUTANT & MATS_DATA_SUBMISSION_TEST_METHOD records.
        await this.createMatsDataSubmissionPollutants(
          metadata.pollutantCodes ?? [],
          submissionId,
          trx,
        );
        await this.createMatsDataSubmissionTestMethods(
          metadata.testMethodCodes ?? [],
          submissionId,
          trx,
        );

        // Generate the Metadata XML file.
        await this.uploadMetadataXmlAndCreateRecord(submissionId, trx);

        // Copy the submission files from the staging directory to the `submissionId` directory in S3 & create MATS_DATA_SUBMISSION_PAYLOAD_FILE records.
        await this.copyFilesAndCreateRecords(
          fileNames,
          submissionId,
          locationId,
          trx,
        );
      });
    } catch (err) {
      if (submissionId)
        await this.deleteSubmissionFiles(submissionId).catch((err) => {
          this.logger.error(
            `Error deleting files for submission ID ${submissionId}: ${err.message}`,
          );
        });
      throw new EaseyException(new Error(err.message), HttpStatus.BAD_REQUEST);
    }

    return submissionId;
  }

  async readTempFile(
    fileName: string,
    locationId: string,
  ): Promise<string> {
    try {
      const filePath = this.createStagingFilePath(
        locationId,
        fileName,
      );
      const data = await this.getS3Client().send(
        new GetObjectCommand({
          Bucket: this.getS3Bucket(),
          Key: filePath,
        }),
      );
      return await data.Body?.transformToString() ?? '';
    } catch (err) {
      this.logger.error(`Error reading file from S3: ${err.message}`);
      if (err instanceof NoSuchKey) {
        throw new EaseyException(
          new Error('File not found'),
          HttpStatus.NOT_FOUND,
        );
      } else {
        throw new EaseyException(
          new Error('An error occurred while reading the file'),
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  private async uploadFile(
    path: string,
    contents: Buffer,
    contentType: string,
  ) {
    return this.getS3Client().send(
      new PutObjectCommand({
        Body: contents,
        Bucket: this.getS3Bucket(),
        ContentLength: contents.length,
        ContentType: contentType,
        Key: path,
      }),
    );
  }

  private async uploadMetadataXmlAndCreateRecord(
    submissionId: string,
    trx: EntityManager,
  ) {
    const metadataXml = await this.generateMetadataXml(submissionId, trx);
    await this.uploadFile(
      this.createSubmissionFilePath(submissionId, METADATA_XML_FILE_NAME),
      Buffer.from(metadataXml),
      'application/xml',
    );
    await this.createMatsDataSubmissionPayloadFile(
      METADATA_XML_FILE_NAME,
      submissionId,
      trx,
    );
  }

  async uploadTempFile(
    file: Express.Multer.File,
    locationId: string,
  ): Promise<string> {
    try {
      const filePath = this.createStagingFilePath(
        locationId,
        file.originalname,
      );
      await this.uploadFile(filePath, file.buffer, file.mimetype);
      return filePath;
    } catch (err) {
      this.logger.error(`Error uploading file to S3: ${err.message}`);
      throw new EaseyException(
        new Error('An error occurred while uploading the file'),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
