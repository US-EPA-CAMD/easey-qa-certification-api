import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';

import { Logger } from '@us-epa-camd/easey-common/logger';
import { RataFrequencyCode } from 'src/entities/workspace/rata-frequency-code.entity';
import { TestSummary } from 'src/entities/workspace/test-summary.entity';
import { TestResultCodes } from 'src/enums/test-result-code.enum';
import { TestSummaryWorkspaceRepository } from 'src/test-summary-workspace/test-summary.repository';
import { getEntityManager } from 'src/utilities/utils';
import { RataBaseDTO, RataImportDTO } from '../dto/rata.dto';

const KEY = 'RATA';

@Injectable()
export class RataChecksService {
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
    testSumId: string,
    rata: RataBaseDTO | RataImportDTO,
    isImport: boolean = false,
    isUpdate: boolean = false,
  ): Promise<string[]> {
    let error: string = null;
    const errorList: string[] = [];
    this.logger.info('Running RATA Checks');

    const testSumRecord = await this.testSummaryRepository.getTestSummaryById(
      testSumId,
    );

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
      // RATA-102 Result B
      if (numberOfLoadLevels < 1 && numberOfLoadLevels > 3) {
        error = `[RATA-102-B] The value [${numberOfLoadLevels}] in the field [numberOfLoadLevels] for [RATA] is not within the range of valid values from [1] to [3].`;
      }
    } else {
      // RATA-102 Result C
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
        error = `You reported [relativeAccuracy], which is not appropriate for [${testSumRecord.testTypeCode}]`;
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
        error = `You did not provide [relativeAccuracy], which is required for [${KEY}].`;
      } else if (relativeAccuracy < 0) {
        // RATA-103 Result C
        error = `The value [${relativeAccuracy}] in the field [relativeAccuracy] for [${KEY}] is not within the range of valid values. This value must be greater than or equal to zero`;
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
      // RATA-104 Result A
      if (overallBiasAdjustmentFactor !== null) {
        error = `You reported [overallBiasAdjustmentFactor], which is not appropriate for [${testSumRecord.testTypeCode}]`;
      }
    } else if (
      [
        TestResultCodes.PASSED.toString(),
        TestResultCodes.PASSAPS.toString(),
      ].includes(testSumRecord.testResultCode)
    ) {
      if (overallBiasAdjustmentFactor === null) {
        // RATA-104 Result B
        error = `You did not provide [overallBiasAdjustmentFactor], which is required for [${KEY}].`;
      } else if (overallBiasAdjustmentFactor < 1) {
        // RATA-104 Result C
        error = `The value [${overallBiasAdjustmentFactor}] in the field [overallBiasAdjustmentFactor] for [${KEY}] is not within the range of valid values. This value must be greater than or equal to 1.00`;
      }
    }
    return error;
  }

  private async rata105Check(
    testSumRecord: TestSummary,
    rataFrequencyCode: string,
  ): Promise<string> {
    let error: string = null;

    const validCode = await getEntityManager().findOne(RataFrequencyCode, {
      rataFrequencyCode: rataFrequencyCode,
    });

    if (
      [
        TestResultCodes.ABORTED.toString(),
        TestResultCodes.FAILED.toString(),
      ].includes(testSumRecord.testResultCode)
    ) {
      // RATA-105 Result A
      if (rataFrequencyCode !== null) {
        error = `You reported [rataFrequencyCode], which is not appropriate for [${testSumRecord.testTypeCode}]`;
      }
    } else if (
      [
        TestResultCodes.PASSED.toString(),
        TestResultCodes.PASSAPS.toString(),
      ].includes(testSumRecord.testResultCode)
    ) {
      if (rataFrequencyCode === null) {
        // RATA-105 Result B
        error = `You did not provide [rataFrequencyCode], which is required for [${KEY}].`;
      } else if (!validCode) {
        // RATA-105 Result C
        error = `You reported the value [${rataFrequencyCode}], which is not in the list of valid values, in the field
          [rataFrequencyCode] for [${KEY}]`;
      } else if (rataFrequencyCode === '8QTRS') {
        if (testSumRecord.system?.systemDesignationCode !== 'B') {
          // RATA-105 Result C
          error = `You reported the value [${rataFrequencyCode}], which is not in the list of valid values, in the field
        [rataFrequencyCode] for [${KEY}]`;
        }
      } else if (rataFrequencyCode === 'ALTSL') {
        if (testSumRecord.system?.systemTypeCode !== 'FLOW') {
          // RATA-105 Result C
          error = `You reported the value [${rataFrequencyCode}], which is not in the list of valid values, in the field
        [rataFrequencyCode] for [${KEY}]`;
        }
      }
    }
    return error;
  }
}
