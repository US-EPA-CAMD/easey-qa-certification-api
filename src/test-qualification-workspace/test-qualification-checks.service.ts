import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { Logger } from '@us-epa-camd/easey-common/logger';

import { TestTypeCodes } from '../enums/test-type-code.enum';
import {
  TestQualificationBaseDTO,
  TestQualificationImportDTO,
} from '../dto/test-qualification.dto';
import {
  TestSummaryBaseDTO,
  TestSummaryImportDTO,
} from '../dto/test-summary.dto';
import { TestSummaryWorkspaceRepository } from '../test-summary-workspace/test-summary.repository';

const KEY = 'Test Qualification';

@Injectable()
export class TestQualificationChecksService {
  constructor(
    private readonly logger: Logger,
    @InjectRepository(TestSummaryWorkspaceRepository)
    private readonly testSummaryRepository: TestSummaryWorkspaceRepository,
  ) {}

  private throwIfErrors(errorList: string[], isImport: boolean = false) {
    if (!isImport && errorList.length > 0) {
      throw new LoggingException(errorList, HttpStatus.BAD_REQUEST);
    }
  }

  async runChecks(
    testQualification: TestQualificationBaseDTO | TestQualificationImportDTO,
    testSumId: string,
    testSummary?: TestSummaryImportDTO,
    isImport: boolean = false,
    isUpdate: boolean = false,
  ): Promise<string[]> {
    let error: string = null;
    const errorList: string[] = [];
    let testSumRecord: TestSummaryBaseDTO;

    this.logger.info('Running Test Qualification Checks');

    if (isImport) {
      testSumRecord = testSummary;
    } else {
      testSumRecord = await this.testSummaryRepository.getTestSummaryById(
        testSumId,
      );
    }

    if (testSumRecord.testTypeCode === TestTypeCodes.RATA) {
      // RATA-119
      error = this.rata119Check(testQualification);
      if (error) {
        errorList.push(error);
      }

      // RATA-120
      const rata120errors = this.rata120Checks(
        testSumRecord.beginDate,
        testQualification,
      );
      if (rata120errors.length > 0) errorList.push(...rata120errors);

      // RATA-9-10-11-E
      const rata91011errors = this.rata9_10_11Check(testQualification);
      if (rata91011errors.length > 0) errorList.push(...rata91011errors);
    }

    this.throwIfErrors(errorList, isImport);
    this.logger.info('Completed Test Qualification Checks');
    return errorList;
  }

  // RATA-9-10-11-E
  private rata9_10_11Check(
    testQualification: TestQualificationBaseDTO | TestQualificationImportDTO,
  ): string[] {
    const errors: string[] = [];
    let error: string = null;

    if (testQualification.testClaimCode !== 'SLC') {
      if (testQualification.highLoadPercentage !== null) {
        error = this.getErrorMessage('RATA-9-E', {
          fieldname: 'highLoadPercentage',
          key: KEY,
        });
        errors.push(error);
      }

      if (testQualification.midLoadPercentage !== null) {
        error = this.getErrorMessage('RATA-10-E', {
          fieldname: 'midLoadPercentage',
          key: KEY,
        });
        errors.push(error);
      }

      if (testQualification.lowLoadPercentage !== null) {
        error = this.getErrorMessage('RATA-11-E', {
          fieldname: 'lowLoadPercentage',
          key: KEY,
        });
        errors.push(error);
      }
    }

    return errors;
  }

  private rata119Check(
    testQualification: TestQualificationBaseDTO | TestQualificationImportDTO,
  ) {
    let error = null;

    if (
      testQualification.testClaimCode === 'SLC' &&
      new Date(testQualification.beginDate) < new Date('1993-01-01')
    ) {
      error = this.getErrorMessage('RATA-119-B', {
        fieldname: 'beginDate',
        date: testQualification.beginDate,
        key: KEY,
      });
    }

    return error;
  }

  private rata120Checks(
    testSumBeginDate: Date,
    testQualification: TestQualificationBaseDTO | TestQualificationImportDTO,
  ) {
    const errors: string[] = [];
    let error: string = null;

    if (testQualification.testClaimCode === 'SLC') {
      if (testQualification.endDate > testSumBeginDate) {
        error = this.getErrorMessage('RATA-120-B');
        errors.push(error);
      }

      if (
        testSumBeginDate !== null &&
        testQualification.endDate <= testSumBeginDate
      ) {
        error = this.getErrorMessage('RATA-120-C', {
          datefield1: testSumBeginDate,
          datefield2: testQualification.endDate,
          key: KEY,
        });
        errors.push(error);
      }
    }

    return errors;
  }

  getErrorMessage(errorCode: string, options?: object): string {
    return CheckCatalogService.formatResultMessage(errorCode, options);
  }
}
