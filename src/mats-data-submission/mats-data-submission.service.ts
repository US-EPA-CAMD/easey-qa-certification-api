import {
  DeleteObjectsCommand,
  ListObjectsV2Command,
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

import { MatsDataSubmissionBaseDTO } from '../dto/mats-data-submission.dto';
import { MatsDataSubmission } from '../entities/mats-data-submission.entity';
import { MatsDataSubmissionPayloadFile } from '../entities/mats-data-submission-payload-file.entity';
import { MatsDataSubmissionPollutant } from '../entities/mats-data-submission-pollutant.entity';
import { MatsDataSubmissionTestMethod } from '../entities/mats-data-submission-test-method.entity';
import { MatsDataSubmissionFiles } from '../interfaces/mats-data-submission-files';
import { MatsDataSubmissionRepository } from './mats-data-submission.repository';

@Injectable()
export class MatsDataSubmissionService {
  constructor(
    private readonly configService: ConfigService,
    private readonly entityManager: EntityManager,
    private readonly logger: Logger,
    private readonly repository: MatsDataSubmissionRepository,
  ) {
    this.logger.setContext(MatsDataSubmissionService.name);
  }

  private createFilePath(fileName: string, submissionId: number) {
    return `${submissionId}/${fileName}`;
  }

  private async createMatsDataSubmission(
    payload: MatsDataSubmissionBaseDTO,
    userId: string,
    trx?: EntityManager,
  ): Promise<number> {
    const repository = withTransaction(this.repository, trx);

    const record = repository.create({
      addTime: currentDateTime(),
      averagingGroupCode: payload.averagingGroupCode,
      facilityId: payload.facilityId,
      locationId: payload.locationId,
      monitorPlanId: payload.monitorPlanId,
      originalSubmissionId: payload.originalSubmissionId,
      reportTypeCode: payload.reportTypeCode,
      statusCode: payload.statusCode,
      testComment: payload.testComment,
      testDate: payload.testDate,
      testNumber: payload.testNumber,
      quarter: payload.quarter,
      year: payload.year,
      updateTime: currentDateTime(),
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
    file: Express.Multer.File | MetadataXmlFile,
    submissionId: number,
    trx?: EntityManager,
    isErtFile: boolean = false,
  ) {
    const repository = (trx ?? this.entityManager).getRepository(
      MatsDataSubmissionPayloadFile,
    );

    const fileTypeCode = (() => {
      if (isErtFile) return 'ERT';

      switch (file.mimetype) {
        case 'text/xml':
          return 'XML';
        case 'application/pdf':
          return 'PDF';
        case 'application/json':
          return 'JSON';
        default:
          throw new EaseyException(
            new Error(`Unsupported file type: ${file.mimetype}`),
            HttpStatus.BAD_REQUEST,
          );
      }
    })();

    const record = repository.create({
      fileName: file.originalname,
      fileTypeCode,
      submissionId,
      tempS3BucketFilePath: this.createFilePath(
        file.originalname,
        submissionId,
      ),
      tempS3BucketFileTime: currentDateTime(),
    });
    await repository.save(record);

    return record.id;
  }

  private async createMatsDataSubmissionPollutants(
    pollutantCodes: string[] = [],
    submissionId: number,
    trx?: EntityManager,
  ): Promise<number[]> {
    const repository = (trx ?? this.entityManager).getRepository(
      MatsDataSubmissionPollutant,
    );

    const records = pollutantCodes.map(code => {
      return repository.create({
        pollutantCode: code,
        submissionId,
      });
    });
    await repository.save(records);

    return records.map(record => record.id);
  }

  private async createMatsDataSubmissionTestMethods(
    testMethodCodes: string[] = [],
    submissionId: number,
    trx?: EntityManager,
  ): Promise<number[]> {
    const repository = (trx ?? this.entityManager).getRepository(
      MatsDataSubmissionTestMethod,
    );

    const records = testMethodCodes.map(code => {
      return repository.create({
        testMethodCode: code,
        submissionId,
      });
    });
    await repository.save(records);

    return records.map(record => record.id);
  }

  async deleteMatsDataSubmission(submissionId: number) {
    try {
      await this.entityManager.transaction(async (trx: EntityManager) => {
        await trx
          .getRepository(MatsDataSubmissionPayloadFile)
          .delete({ submissionId });
        await trx
          .getRepository(MatsDataSubmissionTestMethod)
          .delete({ submissionId });
        await trx
          .getRepository(MatsDataSubmissionPollutant)
          .delete({ submissionId });
        await trx
          .getRepository(MatsDataSubmission)
          .delete({ id: submissionId });
        await this.deleteSubmissionFiles(submissionId);
      });
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

  private async deleteSubmissionFiles(submissionId: number) {
    const client = this.getS3Client();
    const bucket = this.getS3Bucket();

    let isTruncated = true;
    let continuationToken: string;

    while (isTruncated) {
      const listCommand = new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: `${submissionId}/`,
        ContinuationToken: continuationToken,
      });

      const listResponse = await client.send(listCommand);
      const objects = listResponse.Contents ?? [];

      if (objects.length > 0) {
        const deleteCommand = new DeleteObjectsCommand({
          Bucket: bucket,
          Delete: {
            Objects: objects.map(obj => ({ Key: obj.Key })),
          },
        });
        const deleteResponse = await client.send(deleteCommand);
        this.logger.debug(
          `Deleted: ${deleteResponse.Deleted?.map(obj => obj.Key)}`,
        );
      }

      isTruncated = listResponse.IsTruncated ?? false;
      continuationToken = listResponse.NextContinuationToken;
    }
  }

  async generateMetadataXml(
    submissionId: number,
    trx?: EntityManager,
  ): Promise<MetadataXmlFile> {
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
          SubmissionId: record.id.toString(),
          SubmissionDate: record.addTime.toISOString(),
          IsResubmission: record.originalSubmissionId ? 'true' : 'false',
          OriginalSubmissionId: record.originalSubmissionId?.toString(),
        },
        CdxUser: record.userId,
        ReportTypeCode: record.reportTypeCode,
        OrisCode: record.facility.orisCode,
        FrsId: record.facility.frsId ?? '',
        LocationName:
          record.location.stackPipe?.name ?? record.location.unit?.name,
        AveragingGroupCode: record.averagingGroupCode,
        PollutantList: {
          PollutantCode: record.pollutants.map(p => p.metadataPollutantCode),
        },
        TestMethodList: {
          TestMethodCode: record.testMethods.map(tm => tm.code),
        },
        TestNumber: record.testNumber,
        TestDate: record.testDate.toISOString().substring(0, 10),
        TestComment: record.testComment,
      },
    };

    const xmlString = this.generateXmlString(xmlData);
    this.logger.debug('Generated Metadata XML', xmlString);

    return {
      buffer: Buffer.from(xmlString),
      mimetype: 'text/xml',
      originalname: 'Metadata.xml',
    };
  }

  private generateXmlString(data: Record<string, unknown>) {
    const builder = new XMLBuilder({
      format: true,
      ignoreAttributes: false,
      suppressEmptyNode: false,
    });

    return builder.build(data);
  }

  private getS3Bucket() {
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

    return new S3Client({
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      region,
    });
  }

  async initializeMatsDataSubmission(
    metadata: MatsDataSubmissionBaseDTO,
    files: MatsDataSubmissionFiles,
    userId: string,
  ): Promise<number> {
    let submissionId: number | null = null;

    try {
      await this.entityManager.transaction(async (trx: EntityManager) => {
        // Create the MATS Data Submission record.
        submissionId = await this.createMatsDataSubmission(
          metadata,
          userId,
          trx,
        );

        // Create child MATS_DATA_SUBMISSION_POLLUTANT & MATS_DATA_SUBMISSION_TEST_METHOD records.
        await this.createMatsDataSubmissionPollutants(
          metadata.pollutantCodes,
          submissionId,
          trx,
        );
        await this.createMatsDataSubmissionTestMethods(
          metadata.testMethodCodes,
          submissionId,
          trx,
        );

        // Generate the Metadata XML file.
        const metadataXml = await this.generateMetadataXml(submissionId, trx);

        // Upload the files to S3 & create MATS_DATA_SUBMISSION_PAYLOAD_FILE records.
        await this.uploadFilesAndCreateRecords(
          { ...files, metadataXml },
          submissionId,
          trx,
        );
      });
    } catch (err) {
      if (submissionId) await this.deleteSubmissionFiles(submissionId);
      throw new EaseyException(new Error(err.message), HttpStatus.BAD_REQUEST);
    }

    return submissionId;
  }

  private async uploadFile(
    path: string,
    contents: Buffer,
    client: S3Client,
    bucket: string,
  ) {
    return client.send(
      new PutObjectCommand({
        Body: contents,
        Bucket: bucket,
        ContentLength: contents.length,
        Key: path,
      }),
    );
  }

  private async uploadFilesAndCreateRecords(
    files: { metadataXml: MetadataXmlFile } & MatsDataSubmissionFiles,
    submissionId: number,
    trx?: EntityManager,
  ) {
    const client = this.getS3Client();
    const bucket = this.getS3Bucket();

    if (!bucket) {
      throw new EaseyException(
        new Error('Missing S3 bucket name'),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    await settlePromises(
      Object.entries(files)
        // Map the array of entries to a single array of tuples.
        .reduce(
          (
            acc,
            [key, file]: [
              string,
              Express.Multer.File | Express.Multer.File[] | MetadataXmlFile,
            ],
          ) => {
            if (Array.isArray(file)) {
              acc.push(...file.map(f => [key, f]));
            } else {
              acc.push([key, file]);
            }
            return acc;
          },
          [],
        )
        .map(
          async ([key, file]: [
            string,
            Express.Multer.File | MetadataXmlFile,
          ]) => {
            if (!file) return;

            // Upload the file to the S3 bucket.
            await this.uploadFile(
              this.createFilePath(file.originalname, submissionId),
              file.buffer,
              client,
              bucket,
            );
            // Add the MATS payload file record.
            await this.createMatsDataSubmissionPayloadFile(
              file,
              submissionId,
              trx,
              key === 'ertFile',
            );
          },
        ),
    );
  }
}

type MetadataXmlFile = {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
};
