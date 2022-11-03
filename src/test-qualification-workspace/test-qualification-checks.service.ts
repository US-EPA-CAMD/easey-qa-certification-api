import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { Logger } from '@us-epa-camd/easey-common/logger';

import { TestSummaryImportDTO } from '../dto/test-summary.dto';
import {
  TestQualificationBaseDTO,
  TestQualificationImportDTO,
} from '../dto/test-qualification.dto';
import { TestSummaryWorkspaceRepository } from '../test-summary-workspace/test-summary.repository';

const KEY = 'Test Qualification';

@Injectable()
export class TestQualificationChecksService {
  constructor(
    private readonly logger: Logger,
    @InjectRepository(TestSummaryWorkspaceRepository)
    private readonly testSummaryRepository: TestSummaryWorkspaceRepository,
  ) {}

  private throwIfErrors(errorList: string[]) {
    if (errorList.length > 0) {
      throw new LoggingException(errorList, HttpStatus.BAD_REQUEST);
    }
  }

  async runChecks(
    testQualification: TestQualificationBaseDTO | TestQualificationImportDTO,
    testSumId: string,
    isImport: boolean = false,
    isUpdate: boolean = false,
    testSummary?: TestSummaryImportDTO,
  ) {
    let error: string = null;
    const errorList: string[] = [];
    let testSumRecord;

    this.logger.info('Running Test Qualification Checks');

    if (isImport) {
      testSumRecord = testSummary;
    }

    if (isUpdate) {
      testSumRecord = await this.testSummaryRepository.getTestSummaryById(
        testSumId,
      );
    }

    // RATA-9-E
    error = this.rata9Check(testQualification);
    if (error) {
      errorList.push(error);
    }

    this.throwIfErrors(errorList);

    this.logger.info('Completed Test Qualification Checks');

    return errorList;
  }

  // RATA-9-E
  private rata9Check(
    testQualification: TestQualificationBaseDTO | TestQualificationImportDTO,
  ) {
    if (
      testQualification.testClaimCode !== 'SLC' &&
      testQualification.highLoadPercentage !== null
    ) {
      let error: string = null;

      error = CheckCatalogService.formatResultMessage('RATA-9-E', {
        fieldname: 'highLoadPercentage',
        key: KEY,
      });

      return error;
    }
  }
}
