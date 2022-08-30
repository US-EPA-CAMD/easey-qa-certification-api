import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { Logger } from '@us-epa-camd/easey-common/logger';

import { TestSummary } from '../entities/workspace/test-summary.entity';
import { TestResultCodes } from '../enums/test-result-code.enum';
import { RataFrequencyCodeRepository } from '../rata-frequency-code/rata-frequency-code.repository';
import { TestSummaryWorkspaceRepository } from '../test-summary-workspace/test-summary.repository';
import { RataBaseDTO, RataImportDTO } from '../dto/rata.dto';
import { TestSummaryImportDTO } from '../dto/test-summary.dto';
import { MonitorSystemRepository } from '../monitor-system/monitor-system.repository';

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
  ) {}

  private throwIfErrors(errorList: string[], isImport: boolean = false) {
    if (!isImport && errorList.length > 0) {
      throw new LoggingException(errorList, HttpStatus.BAD_REQUEST);
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
    this.logger.info('Running RATA Checks');
    let testSumRecord;

    if (isImport) {
      testSumRecord = testSummary;
      testSumRecord.system = await this.monitorSystemRepository.findOne({
        monitoringSystemID: testSummary.monitoringSystemID,
        locationId: locationId,
      });
    } else {
      testSumRecord = await this.testSummaryRepository.getTestSummaryById(
        testSumId,
      );
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
    error = this.rata104Check(testSumRecord, rata.overallBiasAdjustmentFactor);
    if (error) {
      errorList.push(error);
    }

    // RATA-105 RATA Frequency Valid
    error = await this.rata105Check(testSumRecord, rata.rataFrequencyCode);
    if (error) {
      errorList.push(error);
    }

    this.throwIfErrors(errorList, isImport);
    this.logger.info('Completed RATA Checks');
    return errorList;
  }

  private rata102Check(
    testSumRecord: TestSummary,
    numberOfLoadLevels: number,
  ): string {
    let error: string = null;

    if (testSumRecord.system?.systemTypeCode === 'FLOW') {
      if (numberOfLoadLevels < 1 || numberOfLoadLevels > 3) {
        error = `[RATA-102-B] The value [${numberOfLoadLevels}] in the field [numberOfLoadLevels] for [RATA] is not within the range of valid values from [1] to [3].`;
      }
    } else {
      if (numberOfLoadLevels !== 1) {
        error = `[RATA-102-C] The value [${numberOfLoadLevels}] in the field [numberOfLoadLevels] for [RATA] is not within the range of valid values.`;
      }
    }

    return error;
  }

  private rata103Check(
    testSumRecord: TestSummary,
    relativeAccuracy: number,
  ): string {
    let error: string = null;

    if (testSumRecord.testResultCode === TestResultCodes.ABORTED) {
      // RATA-103 Result A
      if (relativeAccuracy !== null) {
        error = `[RATA-103-A] You reported [relativeAccuracy], which is not appropriate for [${testSumRecord.testTypeCode}].`;
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
        error = `[RATA-103-B] You did not provide [relativeAccuracy], which is required for [${KEY}].`;
      } else if (relativeAccuracy < 0) {
        // RATA-103 Result C
        error = `[RATA-103-C] The value [${relativeAccuracy}] in the field [relativeAccuracy] for [${KEY}] is not within the range of valid values. This value must be greater than or equal to zero.`;
      }
    }
    return error;
  }

  private rata104Check(
    testSumRecord: TestSummary,
    overallBiasAdjustmentFactor: number,
  ): string {
    let error: string = null;

    if (
      [
        TestResultCodes.ABORTED.toString(),
        TestResultCodes.FAILED.toString(),
      ].includes(testSumRecord.testResultCode)
    ) {
      if (overallBiasAdjustmentFactor !== null) {
        error = `[RATA-104-A] You reported [overallBiasAdjustmentFactor], which is not appropriate for [${testSumRecord.testTypeCode}].`;
      }
    } else if (
      [
        TestResultCodes.PASSED.toString(),
        TestResultCodes.PASSAPS.toString(),
      ].includes(testSumRecord.testResultCode)
    ) {
      if (overallBiasAdjustmentFactor === null) {
        error = `[RATA-104-B] You did not provide [overallBiasAdjustmentFactor], which is required for [${KEY}].`;
      } else if (overallBiasAdjustmentFactor < 1) {
        error = `[RATA-104-C] The value [${overallBiasAdjustmentFactor}] in the field [overallBiasAdjustmentFactor] for [${KEY}] is not within the range of valid values. This value must be greater than or equal to 1.000.`;
      }
    }
    return error;
  }

  private async rata105Check(
    testSumRecord: TestSummary,
    rataFrequencyCode: string,
  ): Promise<string> {
    let error: string = null;

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
        error = `[RATA-105-A] You reported [rataFrequencyCode], which is not appropriate for [${testSumRecord.testTypeCode}].`;
      }
    } else if (
      [
        TestResultCodes.PASSED.toString(),
        TestResultCodes.PASSAPS.toString(),
      ].includes(testSumRecord.testResultCode)
    ) {
      if (rataFrequencyCode === null) {
        error = `[RATA-105-B] You did not provide [rataFrequencyCode], which is required for [${KEY}].`;
      } else if (!validCode) {
        error = `[RATA-105-C] You reported the value [${rataFrequencyCode}], which is not in the list of valid values, in the field [rataFrequencyCode] for [${KEY}].`;
      } else if (rataFrequencyCode === '8QTRS') {
        if (testSumRecord.system?.systemDesignationCode !== 'B') {
          error = `[RATA-105-C] You reported the value [${rataFrequencyCode}], which is not in the list of valid values, in the field [rataFrequencyCode] for [${KEY}].`;
        }
      } else if (rataFrequencyCode === 'ALTSL') {
        if (testSumRecord.system?.systemTypeCode !== 'FLOW') {
          error = `[RATA-105-C] You reported the value [${rataFrequencyCode}], which is not in the list of valid values, in the field [rataFrequencyCode] for [${KEY}].`;
        }
      }
    }

    return error;
  }
}
