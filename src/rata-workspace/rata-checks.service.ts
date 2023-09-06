import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';

import { TestSummary } from '../entities/workspace/test-summary.entity';
import { TestResultCodes } from '../enums/test-result-code.enum';
import { RataFrequencyCodeRepository } from '../rata-frequency-code/rata-frequency-code.repository';
import { TestSummaryWorkspaceRepository } from '../test-summary-workspace/test-summary.repository';
import { RataBaseDTO, RataImportDTO } from '../dto/rata.dto';
import {
  TestSummaryBaseDTO,
  TestSummaryImportDTO,
} from '../dto/test-summary.dto';
import { MonitorSystemRepository } from '../monitor-system/monitor-system.repository';
import { TestTypeCodes } from '../enums/test-type-code.enum';
import { TestResultCodeRepository } from '../test-result-code/test-result-code.repository';

const KEY = 'RATA';

@Injectable()
export class RataChecksService {
  constructor(
    private readonly logger: Logger,
    private readonly rataFreqCodeRepository: RataFrequencyCodeRepository,
    @InjectRepository(TestSummaryWorkspaceRepository)
    private readonly testSummaryRepository: TestSummaryWorkspaceRepository,
    @InjectRepository(MonitorSystemRepository)
    private readonly monitorSystemRepository: MonitorSystemRepository,
    @InjectRepository(TestResultCodeRepository)
    private readonly testResultCodeRepository: TestResultCodeRepository,
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
    rata: RataBaseDTO | RataImportDTO,
    testSumId?: string,
    isImport: boolean = false,
    _isUpdate: boolean = false,
    testSummary?: TestSummaryImportDTO,
  ): Promise<string[]> {
    let error: string = null;
    const errorList: string[] = [];
    this.logger.log('Running RATA Checks');
    let testSumRecord;

    if (isImport) {
      testSumRecord = testSummary;
      testSumRecord.system = await this.monitorSystemRepository.findOne({
        monitoringSystemID: testSummary.monitoringSystemId,
        locationId: locationId,
      });
    } else {
      testSumRecord = await this.testSummaryRepository.getTestSummaryById(
        testSumId,
      );
    }

    if (testSumRecord.testTypeCode === TestTypeCodes.RATA) {
      // RATA-100 Test Result Code Valid
      error = await this.rata100check(testSumRecord);
      if (error) {
        errorList.push(error);
      }

      // RATA-102 Number of Load Levels Valid
      error = this.rata102Check(testSumRecord, rata.numberOfLoadLevels);
      if (error) {
        errorList.push(error);
      }

      // RATA-103 Overall Relative Accuracy Valid
      error = this.rata103Check(testSumRecord, rata.relativeAccuracy);
      if (error) {
        errorList.push(error);
      }

      // RATA-104 Overall BAF Valid
      error = this.rata104Check(
        testSumRecord,
        rata.overallBiasAdjustmentFactor,
      );
      if (error) {
        errorList.push(error);
      }

      // RATA-105 RATA Frequency Valid
      error = await this.rata105Check(testSumRecord, rata.rataFrequencyCode);
      if (error) {
        errorList.push(error);
      }
    }

    this.throwIfErrors(errorList, isImport);
    this.logger.log('Completed RATA Checks');
    return errorList;
  }

  // RATA-100 Test Result Code Valid
  private async rata100check(
    summary: TestSummaryBaseDTO | TestSummaryImportDTO,
  ): Promise<string> {
    let error: string = null;
    let FIELDNAME: string = 'testResultCode';
    let KEY: 'Test Summary';
    const resultC = this.getMessage('RATA-100-C', {
      value: summary.testResultCode,
      fieldname: FIELDNAME,
      key: KEY,
    });

    if (
      !['PASSED', 'PASSAPS', 'FAILED', 'ABORTED'].includes(
        summary.testResultCode,
      )
    ) {
      const record = await this.testResultCodeRepository.findOne(
        summary.testResultCode,
      );

      if (record) {
        error = resultC;
      }

      return error;
    }
  }

  private rata102Check(
    testSumRecord: TestSummary,
    numberOfLoadLevels: number,
  ): string {
    let error: string = null;
    let FIELDNAME: string = 'numberOfLoadLevels';

    if (testSumRecord.system?.systemTypeCode === 'FLOW') {
      if (numberOfLoadLevels < 1 || numberOfLoadLevels > 3) {
        error = this.getMessage('RATA-102-B', {
          value: numberOfLoadLevels,
          fieldname: FIELDNAME,
          minvalue: 1,
          maxvalue: 3,
          key: KEY,
        });
      }
    } else {
      if (numberOfLoadLevels !== 1) {
        error = this.getMessage('RATA-102-C', {
          value: numberOfLoadLevels,
          fieldname: FIELDNAME,
          key: KEY,
        });
      }
    }

    return error;
  }

  private rata103Check(
    testSumRecord: TestSummary,
    relativeAccuracy: number,
  ): string {
    let error: string = null;
    let FIELDNAME: string = 'relativeAccuracy';

    if (testSumRecord.testResultCode === TestResultCodes.ABORTED) {
      // RATA-103 Result A
      if (relativeAccuracy !== null) {
        error = this.getMessage('RATA-103-A', {
          fieldname: FIELDNAME,
          testtype: testSumRecord.testTypeCode,
        });
      }
    } else if (
      [
        TestResultCodes.PASSED.toString(),
        TestResultCodes.PASSAPS.toString(),
        TestResultCodes.FAILED.toString(),
      ].includes(testSumRecord.testResultCode)
    ) {
      if (relativeAccuracy === null) {
        // RATA-103 Result B
        error = this.getMessage('RATA-103-B', {
          fieldname: FIELDNAME,
          key: KEY,
        });
      } else if (relativeAccuracy < 0) {
        // RATA-103 Result C
        error = this.getMessage('RATA-103-C', {
          value: relativeAccuracy,
          fieldname: FIELDNAME,
          key: KEY,
        });
      }
    }
    return error;
  }

  private rata104Check(
    testSumRecord: TestSummary,
    overallBiasAdjustmentFactor: number,
  ): string {
    let error: string = null;
    let FIELDNAME: string = 'overallBiasAdjustmentFactor;' + '';
    if (
      [
        TestResultCodes.ABORTED.toString(),
        TestResultCodes.FAILED.toString(),
      ].includes(testSumRecord.testResultCode)
    ) {
      if (overallBiasAdjustmentFactor !== null) {
        error = this.getMessage('RATA-104-A', {
          fieldname: FIELDNAME,
          testtype: testSumRecord.testTypeCode,
        });
      }
    } else if (
      [
        TestResultCodes.PASSED.toString(),
        TestResultCodes.PASSAPS.toString(),
      ].includes(testSumRecord.testResultCode)
    ) {
      if (overallBiasAdjustmentFactor === null) {
        error = this.getMessage('RATA-104-B', {
          fieldname: FIELDNAME,
          key: KEY,
        });
      } else if (overallBiasAdjustmentFactor < 1) {
        error = this.getMessage('RATA-104-C', {
          fieldname: FIELDNAME,
          key: KEY,
        });
      }
    }
    return error;
  }

  private async rata105Check(
    testSumRecord: TestSummary,
    rataFrequencyCode: string,
  ): Promise<string> {
    let error: string = null;
    let FIELDNAME: string = 'rataFrequencyCode';

    const validCode = await this.rataFreqCodeRepository.getRataFrequencyCode(
      rataFrequencyCode,
    );

    if (
      [
        TestResultCodes.ABORTED.toString(),
        TestResultCodes.FAILED.toString(),
      ].includes(testSumRecord.testResultCode)
    ) {
      // RATA-105 Result A
      if (rataFrequencyCode !== null) {
        error = this.getMessage('RATA-105-A', {
          fieldname: FIELDNAME,
          testtype: testSumRecord.testTypeCode,
        });
      }
    } else if (
      [
        TestResultCodes.PASSED.toString(),
        TestResultCodes.PASSAPS.toString(),
      ].includes(testSumRecord.testResultCode)
    ) {
      if (rataFrequencyCode === null) {
        error = this.getMessage('RATA-105-B', {
          fieldname: FIELDNAME,
          key: KEY,
        });
      } else if (!validCode) {
        error = this.getMessage('RATA-105-C', {
          value: rataFrequencyCode,
          fieldname: FIELDNAME,
          key: KEY,
        });
      } else if (rataFrequencyCode === '8QTRS') {
        if (testSumRecord.system?.systemDesignationCode !== 'B') {
          error = this.getMessage('RATA-105-C', {
            value: rataFrequencyCode,
            fieldname: FIELDNAME,
            key: KEY,
          });
        }
      } else if (rataFrequencyCode === 'ALTSL') {
        if (testSumRecord.system?.systemTypeCode !== 'FLOW') {
          error = this.getMessage('RATA-105-C', {
            value: rataFrequencyCode,
            fieldname: FIELDNAME,
            key: KEY,
          });
        }
      }
    }

    return error;
  }

  getMessage(messageKey: string, messageArgs: object): string {
    return CheckCatalogService.formatResultMessage(messageKey, messageArgs);
  }
}
