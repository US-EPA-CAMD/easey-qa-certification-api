import { HttpStatus, Injectable } from '@nestjs/common';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { Logger } from '@us-epa-camd/easey-common/logger';

import { RataImportDTO } from '../dto/rata.dto';
import {
  TestQualificationBaseDTO,
  TestQualificationImportDTO,
} from '../dto/test-qualification.dto';
import { TestSummaryImportDTO } from '../dto/test-summary.dto';
import { TestTypeCodes } from '../enums/test-type-code.enum';
import { MonitorSystemRepository } from '../monitor-system/monitor-system.repository';
import { TestSummaryWorkspaceRepository } from '../test-summary-workspace/test-summary.repository';
import { TestQualificationWorkspaceRepository } from './test-qualification-workspace.repository';

const moment = require('moment');

const KEY = 'Test Qualification';

@Injectable()
export class TestQualificationChecksService {
  constructor(
    private readonly logger: Logger,
    private readonly testSummaryRepository: TestSummaryWorkspaceRepository,
    private readonly monitorSystemRepository: MonitorSystemRepository,
    private readonly testQualRepository: TestQualificationWorkspaceRepository,
  ) {}

  private throwIfErrors(errorList: string[], isImport: boolean = false) {
    if (!isImport && errorList.length > 0) {
      throw new EaseyException(
        new Error(errorList.join('\n')),
        HttpStatus.BAD_REQUEST,
        { responseObject: errorList },
      );
    }
  }

  async runChecks(
    locationId: string,
    testQualification: TestQualificationBaseDTO | TestQualificationImportDTO,
    testQualifications: TestQualificationImportDTO[],
    testSumId: string,
    testSummary: TestSummaryImportDTO,
    rata: RataImportDTO,
    isImport: boolean = false,
    isUpdate: boolean = false,
  ): Promise<string[]> {
    let error: string = null;
    const errorList: string[] = [];
    let testSumRecord, rataRecord;

    this.logger.log('Running Test Qualification Checks');

    if (isImport) {
      testSumRecord = testSummary;
      testSumRecord.system = await this.monitorSystemRepository.findOneBy({
        monitoringSystemID: testSummary.monitoringSystemId,
        locationId: locationId,
      });
      rataRecord = rata;
    } else {
      testSumRecord = await this.testSummaryRepository.getTestSummaryById(
        testSumId,
      );
      if (testSumRecord.ratas?.length > 0) {
        rataRecord = testSumRecord.ratas[0];
      }
    }

    if (testSumRecord.testTypeCode === TestTypeCodes.RATA) {
      const rata118errors = this.rata118Checks(
        testQualification,
        testSumRecord,
        rataRecord,
      );
      if (rata118errors.length > 0) {
        errorList.push(...rata118errors);
      }

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
      if (rata120errors.length > 0) {
        errorList.push(...rata120errors);
      }

      // RATA-9-10-11-E
      const rata91011errors = this.rata9_10_11Check(testQualification);
      if (rata91011errors.length > 0) {
        errorList.push(...rata91011errors);
      }

      if (!isUpdate) {
        error = await this.rata121DuplicateCheck(
          testQualification,
          testQualifications,
          testSumId,
          isImport,
        );
        if (error) {
          errorList.push(error);
        }
      }
    }

    this.throwIfErrors(errorList, isImport);
    this.logger.log('Completed Test Qualification Checks');
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

  private rata118Checks(
    testQualification: TestQualificationBaseDTO | TestQualificationImportDTO,
    testSummary: any,
    rataRecord: any,
  ) {
    let errors = [];

    if (!['SLC', 'NLE', 'ORE'].includes(testQualification.testClaimCode)) {
      errors.push(
        this.getErrorMessage('RATA-118-B', {
          fieldname: 'testClaimCode',
        }),
      );
    } else {
      if (testQualification.testClaimCode === 'SLC') {
        if (testSummary.system.systemTypeCode !== 'FLOW') {
          errors.push(
            this.getErrorMessage('RATA-118-C', {
              value: testQualification.testClaimCode,
            }),
          );
        }
        if (rataRecord?.numberOfLoadLevels > 1) {
          errors.push(
            this.getErrorMessage('RATA-118-D', {
              value: testQualification.testClaimCode,
            }),
          );
        }
      }

      if (testQualification.testClaimCode === 'ORE') {
        if (testSummary.system.systemTypeCode !== 'FLOW') {
          errors.push(
            this.getErrorMessage('RATA-118-C', {
              value: testQualification.testClaimCode,
            }),
          );
        }
        if (rataRecord?.numberOfLoadLevels < 2) {
          errors.push(
            this.getErrorMessage('RATA-118-E', {
              value: testQualification.testClaimCode,
            }),
          );
        }
      }

      if (testQualification.testClaimCode === 'NLE') {
        if (rataRecord?.numberOfLoadLevels > 1) {
          errors.push(
            this.getErrorMessage('RATA-118-D', {
              value: testQualification.testClaimCode,
            }),
          );
        }
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
      moment(testQualification.beginDate).isBefore(moment('1993-01-01'))
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
    }

    return errors;
  }

  private async rata121DuplicateCheck(
    testQualification: TestQualificationBaseDTO | TestQualificationImportDTO,
    testQualifications?: TestQualificationImportDTO[],
    testSumId?: string,
    isImport: boolean = false,
  ) {
    let error = null;
    let testQuals = [];

    if (isImport) {
      testQuals = testQualifications.filter(
        tq => tq.testClaimCode === testQualification.testClaimCode,
      );

      if (testQuals.length > 1) {
        error = this.getErrorMessage('RATA-121-A', {
          recordtype: 'Test Qualification',
          fieldnames: 'testClaimCode',
        });
      }
    } else {
      testQuals = await this.testQualRepository.findBy({
        testSumId: testSumId,
        testClaimCode: testQualification.testClaimCode,
      });

      if (testQuals.length > 0) {
        error = this.getErrorMessage('RATA-121-A', {
          recordtype: 'Test Qualification',
          fieldnames: 'testClaimCode',
        });
      }
    }

    return error;
  }

  getErrorMessage(errorCode: string, options?: object): string {
    return CheckCatalogService.formatResultMessage(errorCode, options);
  }
}
