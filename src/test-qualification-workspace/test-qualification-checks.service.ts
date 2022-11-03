import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { Logger } from '@us-epa-camd/easey-common/logger';

import {
  TestQualificationBaseDTO,
  TestQualificationImportDTO,
} from '../dto/test-qualification.dto';

const KEY = 'Test Qualification';

@Injectable()
export class TestQualificationChecksService {
  constructor(private readonly logger: Logger) {}

  private throwIfErrors(errorList: string[]) {
    if (errorList.length > 0) {
      throw new LoggingException(errorList, HttpStatus.BAD_REQUEST);
    }
  }

  async runChecks(
    testQualification: TestQualificationBaseDTO | TestQualificationImportDTO,
    _testSumId: string,
    _isImport: boolean = false,
    _isUpdate: boolean = false,
  ) {
    let error: string = null;
    const errorList: string[] = [];
    let testSumRecord;

    this.logger.info('Running Test Qualification Checks');

    // RATA-9-10-11-E
    const errors = this.rata9And10And11Check(testQualification);
    if (errors.length > 0) {
      errorList.push(...errors);
    }

    this.throwIfErrors(errorList);

    this.logger.info('Completed Test Qualification Checks');

    return errorList;
  }

  // RATA-9-10-11-E
  private rata9And10And11Check(
    testQualification: TestQualificationBaseDTO | TestQualificationImportDTO,
  ): string[] {
    if (testQualification.testClaimCode !== 'SLC') {
      const errors: string[] = [];
      let error: string = null;

      if (testQualification.highLoadPercentage !== null) {
        error = CheckCatalogService.formatResultMessage('RATA-9-E', {
          fieldname: 'highLoadPercentage',
          key: KEY,
        });
        errors.push(error);
      }

      if (testQualification.midLoadPercentage !== null) {
        error = CheckCatalogService.formatResultMessage('RATA-10-E', {
          fieldname: 'midLoadPercentage',
          key: KEY,
        });
        errors.push(error);
      }

      if (testQualification.lowLoadPercentage !== null) {
        error = CheckCatalogService.formatResultMessage('RATA-11-E', {
          fieldname: 'lowLoadPercentage',
          key: KEY,
        });
        errors.push(error);
      }

      return errors;
    }
  }
}
