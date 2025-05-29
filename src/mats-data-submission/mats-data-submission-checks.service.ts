import { Injectable } from '@nestjs/common';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { validate } from 'class-validator';
import { EntityManager, In } from 'typeorm';

import { MatsDataSubmissionFileNamesDTO } from '../dto/mats-data-submission-create-payload.dto';
import { MatsDataSubmissionBaseDTO } from '../dto/mats-data-submission.dto';
import { MatsFileTypeCode } from '../entities/mats-file-type-code.entity';
import { MatsPollutantCode } from '../entities/mats-pollutant-code.entity';
import { MatsReportTypeCode } from '../entities/mats-report-type-code.entity';
import { MatsTestMethodCode } from '../entities/mats-test-method-code.entity';
import { throwIfErrors } from '../utilities/functions';
import {
  MatsDataSubmissionService,
  METADATA_XML_FILE_NAME,
} from './mats-data-submission.service';

@Injectable()
export class MatsDataSubmissionChecksService {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly logger: Logger,
    private readonly matsDataSubmissionService: MatsDataSubmissionService,
  ) {
    this.logger.setContext(MatsDataSubmissionChecksService.name);
  }

  private async getMimeType(fileName: string, locationId: string) {
    const filePath = this.matsDataSubmissionService.createStagingFilePath(
      locationId,
      fileName,
    );
    return this.matsDataSubmissionService.getRemoteFileMimeType(filePath);
  }

  private async pollutantToTestMethodCrosscheck(
    selectedPollutants: MatsPollutantCode[] = [],
    selectedTestMethods: MatsTestMethodCode[] = [],
  ): Promise<string[]> {
    if (!selectedTestMethods.length || !selectedPollutants.length) {
      return [];
    }

    // Verify each selected pollutant code is matched to a valid test method code.
    const invalidPollutantCodes = (
      await this.entityManager.query(
        `
        SELECT mats_pollutant_cd AS code
        FROM camdecmpsmd.mats_test_method_to_pollutant_crosscheck
        WHERE mats_pollutant_cd = ANY($1)
        GROUP BY mats_pollutant_cd
        HAVING BOOL_OR(mats_test_meth_cd = ANY($2)) = false;
    `,
        [
          selectedPollutants.map((p) => p.code),
          selectedTestMethods.map((tm) => tm.code),
        ],
      )
    ).map(({ code }) => code);

    return invalidPollutantCodes.map((code: string) => {
      const pollutant = selectedPollutants.find((p) => p.code === code);
      return `Pollutant [${pollutant.description}] requires ${
        pollutant.testMethods.length > 1 ? 'at least one' : 'a'
      } [${pollutant.testMethods
        .map((tm) => tm.description)
        .join(' OR ')}] Test Method.`;
    });
  }

  private async reportTypeToPollutantCrosscheck(
    reportType: MatsReportTypeCode,
    selectedPollutants: MatsPollutantCode[] = [],
    acceptedPollutants: MatsPollutantCode[] = [],
  ): Promise<string[]> {
    const acceptsAll = (
      await this.entityManager.query(
        `
      SELECT 1
      FROM camdecmpsmd.mats_report_type_to_pollutant_crosscheck
      WHERE mats_rpt_type_cd = $1
      AND mats_pollutant_cd IS NULL
    `,
        [reportType.code],
      )
    ).pop();
    if (acceptsAll) return [];

    // Verify each selected pollutant code is valid for the selected report type.
    return selectedPollutants.reduce((acc, sp) => {
      if (!acceptedPollutants.some((ap) => ap.code === sp.code)) {
        return [
          ...acc,
          `Pollutant [${sp.description}] is not appropriate for Report Type [${reportType.description}].`,
        ];
      }
      return acc;
    }, []);
  }

  async runChecks(
    metadata: MatsDataSubmissionBaseDTO,
    fileNames: MatsDataSubmissionFileNamesDTO,
    locationId: string,
  ): Promise<Array<string>> {
    const errors: string[] = [];

    // Validate the DTO.
    const dtoErrors = await validate(metadata, {
      groups: [metadata.reportTypeCode],
    });
    if (dtoErrors.length) {
      errors.push(...dtoErrors.map((e) => Object.values(e.constraints)).flat());
    }

    // Throw immediately if initial validation fails.
    throwIfErrors(errors, { asArray: true });

    // Conditional validation of `testNumber`.
    if (
      metadata.reportTypeCode === 'NOTIFY' &&
      fileNames.ertFile &&
      !metadata.testNumber
    ) {
      errors.push(
        'Test Number is required when ERT file is provided and Report Type Code is NOTIFY.',
      );
    }

    // Get the report type and selected pollutant/test method records.
    const [reportType, selectedPollutants, selectedTestMethods] =
      await Promise.all([
        this.entityManager.findOne(MatsReportTypeCode, {
          where: {
            code: metadata.reportTypeCode,
          },
          relations: {
            pollutants: true,
          },
        }),
        metadata.pollutantCodes?.length
          ? this.entityManager.find(MatsPollutantCode, {
              where: {
                code: In(metadata.pollutantCodes),
              },
              relations: {
                testMethods: true,
              },
            })
          : ([] as MatsPollutantCode[]),
        metadata.testMethodCodes?.length
          ? this.entityManager.find(MatsTestMethodCode, {
              where: {
                code: In(metadata.testMethodCodes),
              },
              relations: {
                pollutants: true,
              },
            })
          : [],
      ]);

    // Verify at least one pollutant is selected if the report type requires it.
    if (reportType.requiresPollutant && !selectedPollutants.length) {
      errors.push('Pollutant requires a selection.');
    }
    // Verify at least one test method is selected if the report type requires it.
    if (reportType.requiresTestMethod && !selectedTestMethods.length) {
      errors.push('Test Method requires a selection.');
    }

    throwIfErrors(errors, { asArray: true });

    // Validate the provided files.
    const warnings = await this.validateFiles(
      reportType,
      fileNames,
      locationId,
    );

    /* CROSSCHECK VALIDATION */

    // Return the following crosscheck results as warnings.
    return warnings.concat([
      ...(await this.reportTypeToPollutantCrosscheck(
        reportType,
        selectedPollutants,
        reportType.pollutants,
      )),
      ...(await this.testMethodToPollutantCrosscheck(
        selectedTestMethods,
        selectedPollutants,
      )),
      ...(await this.pollutantToTestMethodCrosscheck(
        selectedPollutants,
        selectedTestMethods,
      )),
    ]);
  }

  private async testMethodToPollutantCrosscheck(
    selectedTestMethods: MatsTestMethodCode[] = [],
    selectedPollutants: MatsPollutantCode[] = [],
  ): Promise<string[]> {
    if (!selectedTestMethods.length || !selectedPollutants.length) {
      return [];
    }

    const warnings = [];

    // Verify each selected test method code is matched to a valid pollutant code.
    await Promise.all(
      selectedTestMethods.map(async (tm) => {
        const validMatch = (
          await this.entityManager.query(
            `
            SELECT 1
            FROM camdecmpsmd.mats_test_method_to_pollutant_crosscheck
            WHERE mats_test_meth_cd = $1
              AND (mats_pollutant_cd IS NULL OR mats_pollutant_cd = ANY($2))
            LIMIT 1
          `,
            [tm.code, selectedPollutants.map((p) => p.code)],
          )
        ).pop();
        if (!validMatch) {
          warnings.push(
            `Test Method [${tm.description}] is not appropriate for any of the selected pollutants.`,
          );
        }
      }),
    );

    return warnings;
  }

  private async validateFiles(
    reportType: MatsReportTypeCode,
    fileNames: MatsDataSubmissionFileNamesDTO,
    locationId: string,
  ): Promise<string[]> {
    const errors: string[] = [];
    const warnings: string[] = [];

    const fileNameErrors = this.validateFileNames(fileNames);
    if (fileNameErrors.length) {
      errors.push(...fileNameErrors);
    }

    const mimetypeErrors = await this.validateFileMimetypes(
      fileNames,
      locationId,
    );
    if (mimetypeErrors.length) errors.push(...mimetypeErrors);

    const attachmentErrors = await this.validateFileAttachments(
      fileNames,
      reportType,
      locationId,
    );
    if (attachmentErrors.length) {
      if (reportType.enforceAttachmentRules) {
        errors.push(...attachmentErrors);
      } else {
        warnings.push(...attachmentErrors);
      }
    }

    throwIfErrors(errors, { asArray: true });

    return warnings;
  }

  private async validateFileAttachments(
    fileNames: MatsDataSubmissionFileNamesDTO,
    reportType: MatsReportTypeCode,
    locationId: string,
  ) {
    const errors: string[] = [];

    const { ertFile, payloadFile, supportingFiles } = fileNames;

    const fileTypes = await this.entityManager.find(MatsFileTypeCode);
    const ertFileCheck = () => {
      if (!ertFile) {
        errors.push(
          `Report Type [${reportType.description}] requires one [${
            fileTypes.find((ft) => ft.code === 'ERT')?.description ?? 'ERT'
          }] file.`,
        );
      }
    };
    const supportingFilesCheck = () => {
      if (!supportingFiles?.length) {
        errors.push(
          `Report Type [${reportType.description}] requires one or more [${
            fileTypes.find((ft) => ft.code === 'PDF')?.description ?? 'PDF'
          }] file(s).`,
        );
      }
    };
    if (
      ['CR', 'LEED', 'LEEQ', 'PS11', 'PST', 'RATA', 'RRA', 'RCA'].includes(
        reportType.code,
      )
    ) {
      // An ERT file & at least one supporting file are required.
      ertFileCheck();
      supportingFilesCheck();
    }
    if (reportType.code === 'NOTIFY') {
      // A payload PDF file OR (ERT file & at least one supporting file) are required.
      let hasRequiredFiles = false;

      if (payloadFile) {
        const mimetype = await this.getMimeType(payloadFile, locationId);

        // Must be PDF and must be the *only* file type provided.
        if (
          mimetype === 'application/pdf' &&
          !ertFile &&
          !supportingFiles?.length
        ) {
          hasRequiredFiles = true;
        }
      } else if (ertFile && supportingFiles?.length) {
        // No payloadFile allowed if ERT + supporting files are present.
        hasRequiredFiles = true;
      }

      if (!hasRequiredFiles) {
        errors.push(
          `Report Type [${reportType.description}] requires one [${
            fileTypes.find((ft) => ft.code === 'PDF')?.description ?? 'PDF'
          }] file or an ERT file and at least one supporting file.`,
        );
      }
    }
    if (['ACA', 'EMPM', 'SVA'].includes(reportType.code)) {
      // A payload file is required.
      if (!payloadFile) {
        errors.push(
          `Report Type [${reportType.description}] requires one [${fileTypes
            .filter((ft) => ['PDF', 'XML', 'JSON'].includes(ft.code))
            .map((ft) => ft.description)
            .join(' OR ')}] file.`,
        );
      }
    }

    return errors;
  }

  private async validateFileMimetypes(
    fileNames: MatsDataSubmissionFileNamesDTO,
    locationId: string,
  ) {
    const errors: string[] = [];

    const { ertFile, payloadFile, supportingFiles } = fileNames;

    // ERT file must be XML.
    if (ertFile) {
      const mimetype = await this.getMimeType(ertFile, locationId);
      if (!mimetype) errors.push(`ERT file not found.`);
      else if (!['application/xml', 'text/xml'].includes(mimetype)) {
        errors.push(`Expected ERT file to be of type XML, but got ${mimetype}`);
      }
    }

    // Payload file must be PDF, JSON, or XML.
    const validPayloadFileTypes = [
      'application/json',
      'application/pdf',
      'application/xml',
      'text/json',
      'text/xml',
    ];
    if (payloadFile) {
      const mimetype = await this.getMimeType(payloadFile, locationId);
      if (!mimetype) errors.push(`Payload file not found.`);
      if (!validPayloadFileTypes.includes(mimetype)) {
        errors.push(
          `Expected Payload file to be of type ${validPayloadFileTypes.join(
            ', ',
          )} but got ${mimetype}`,
        );
      }
    }

    // Supporting files must be PDF.
    if (supportingFiles) {
      const mimetypes = await Promise.all(
        supportingFiles.map((file) => this.getMimeType(file, locationId)),
      );
      if (mimetypes.some((mimetype) => !mimetype)) {
        errors.push(`Supporting file not found.`);
      }
      const filteredMimetypes = mimetypes.filter(Boolean);
      if (
        !filteredMimetypes.every((mimetype) => mimetype === 'application/pdf')
      ) {
        errors.push(
          `Expected Supporting files to be of type PDF, but got ${filteredMimetypes.join(', ')}`,
        );
      }
    }

    return errors;
  }

  private validateFileNames(fileNames: MatsDataSubmissionFileNamesDTO) {
    const errors = [];

    const fileNamesFlat = Object.values(fileNames).flat().filter(Boolean);

    if (fileNamesFlat.length !== new Set(fileNamesFlat).size) {
      errors.push('File names must be unique.');
    }

    if (fileNamesFlat.some((name) => name === METADATA_XML_FILE_NAME)) {
      errors.push(`File name [${METADATA_XML_FILE_NAME}] is reserved.`);
    }

    return errors;
  }
}
