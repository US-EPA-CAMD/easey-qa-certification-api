import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { Logger } from '@us-epa-camd/easey-common/logger';

import {
  TestQualificationBaseDTO,
  TestQualificationImportDTO,
} from '../dto/test-qualification.dto';
import {
  TestSummaryBaseDTO,
  TestSummaryImportDTO,
} from '../dto/test-summary.dto';
import { TestSummaryWorkspaceRepository } from '../test-summary-workspace/test-summary.repository';
import { TestSummary } from 'src/entities/workspace/test-summary.entity';

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
  ): Promise<string[]> {
    let error: string = null;
    const errorList: string[] = [];
    let testSumRecord: TestSummaryBaseDTO;

    this.logger.info('Running Test Qualification Checks');

    if (isImport) {
      testSumRecord = testSummary;
    }

    if (isUpdate) {
      testSumRecord = await this.testSummaryRepository.getTestSummaryById(
        testSumId,
      );
    }

    if (testQualification.testClaimCode === 'SLC') {
      // RATA-119
      error = this.rata119Check(testQualification.beginDate);
      if (error) {
        errorList.push(error);
      }

      // RATA-120
      const rata120errors = this.rata120Checks(
        testSumRecord.beginDate,
        testQualification.endDate,
      );
      if (rata120errors.length > 0) errorList.push(...rata120errors);
    }

    if (testQualification.testClaimCode !== 'SLC') {
      // RATA-9-10-11-E
      const rata91011errors = this.rata9And10And11Check(testQualification);
      if (rata91011errors.length > 0) errorList.push(...rata91011errors);
    }

    this.throwIfErrors(errorList);

    this.logger.info('Completed Test Qualification Checks');

    return errorList;
  }

  // RATA-9-10-11-E
  private rata9And10And11Check(
    testQualification: TestQualificationBaseDTO | TestQualificationImportDTO,
  ): string[] {
    const errors: string[] = [];
    let error: string = null;

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

    return errors;
  }

  private rata119Check(beginDate: Date) {
    let error = null;

    if (new Date(beginDate) < new Date('1993-01-01')) {
      error = this.getErrorMessage('RATA-119-B', {
        fieldname: 'beginDate',
        date: beginDate,
        key: KEY,
      });
    }

    return error;
  }

  private rata120Checks(testSumBeginDate, testQualEndDate) {
    const errors: string[] = [];
    let error: string = null;

    if (testQualEndDate > testSumBeginDate) {
      error = this.getErrorMessage('RATA-120-B');
      errors.push(error);
    }

    if (testSumBeginDate !== null && testQualEndDate <= testSumBeginDate) {
      error = this.getErrorMessage('RATA-120-C', {
        datefield1: testSumBeginDate,
        datefield2: testQualEndDate,
      });
      errors.push(error);
    }

    return errors;
  }

  getErrorMessage(errorCode: string, options?: object): string {
    return CheckCatalogService.formatResultMessage(errorCode, options);
  }
}
