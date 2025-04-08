import { Injectable } from '@nestjs/common';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { validate } from 'class-validator';

import { throwIfErrors } from '../utilities/functions';
import { MatsDataSubmissionBaseDTO } from '../dto/mats-data-submission.dto';

@Injectable()
export class MatsDataSubmissionChecksService {
  constructor(private readonly logger: Logger) {
    this.logger.setContext(MatsDataSubmissionChecksService.name);
  }

  async runChecks(
    metadata: MatsDataSubmissionBaseDTO,
    files: {
      ertFile?: Express.Multer.File[];
      payloadFile?: Express.Multer.File[];
      supportingFiles?: Express.Multer.File[];
    },
  ) {
    const warnings: string[] = [];

    // Validate the DTO.
    const dtoErrors = await validate(metadata);
    throwIfErrors(
      dtoErrors.map(e => e.toString()),
      { asArray: true },
    );

    // TODO: Conditional validation of `testNumber`.

    // TODO: Perform crosscheck validation.

    // TODO: Perform file validation.
  }
}
