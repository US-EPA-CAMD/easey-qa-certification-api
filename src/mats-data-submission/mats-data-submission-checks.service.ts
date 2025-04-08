import { Injectable } from '@nestjs/common';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { validate } from 'class-validator';
import { EntityManager } from 'typeorm';

import { throwIfErrors } from '../utilities/functions';
import { MatsDataSubmissionBaseDTO } from '../dto/mats-data-submission.dto';
import { MatsReportTypeCode } from '../entities/mats-report-type-code.entity';

@Injectable()
export class MatsDataSubmissionChecksService {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly logger: Logger,
  ) {
    this.logger.setContext(MatsDataSubmissionChecksService.name);
  }

  async runChecks(
    metadata: MatsDataSubmissionBaseDTO,
    files: {
      ertFile?: Express.Multer.File[];
      payloadFile?: Express.Multer.File[];
      supportingFiles?: Express.Multer.File[];
    },
  ): Promise<Array<string>> {
    const warnings: string[] = [];

    // Validate the DTO.
    const dtoErrors = await validate(metadata);
    const errorList = dtoErrors.map(e => e.toString());

    // Conditional validation of `testNumber`.
    if (
      metadata.reportTypeCode === 'NOTIFY' &&
      files.ertFile?.length > 0 &&
      !metadata.testNumber
    ) {
      errorList.push(
        'Test Number is required when ERT file is provided and Report Type Code is NOTIFY',
      );
    }
    throwIfErrors(errorList, { asArray: true });

    // TODO: Perform crosscheck validation.
    const reportType = await this.entityManager.findOneBy(MatsReportTypeCode, {
      code: metadata.reportTypeCode,
    });

    // TODO: Perform file validation.

    return warnings;
  }
}
