import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';

import { TestSummary } from '../entities/test-summary.entity';
import { RataRunBaseDTO, RataRunImportDTO } from '../dto/rata-run.dto';
import { TestSummaryImportDTO } from '../dto/test-summary.dto';
import { TestTypeCodes } from '../enums/test-type-code.enum';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';

const KEY = 'RATA Run';
@Injectable()
export class RataRunChecksService {
  constructor(
    private readonly logger: Logger,
    private readonly testSummaryService: TestSummaryWorkspaceService,
  ) {}

  private throwIfErrors(errorList: string[]) {
    if (errorList.length > 0) {
      throw new LoggingException(errorList, HttpStatus.BAD_REQUEST);
    }
  }

  async runChecks(
    rataRun: RataRunBaseDTO | RataRunImportDTO,
    testSumId?: string,
    isImport: boolean = false,
    isUpdate: boolean = false,
    testSummary?: TestSummaryImportDTO,
  ): Promise<string[]> {
    let error: string = null;
    const errorList: string[] = [];
    let testSumRecord;

    this.logger.info('Running RATA Run Checks');

    if (isImport) {
      testSumRecord = testSummary;
    }

    if (isUpdate) {
      testSumRecord = await this.testSummaryService.getTestSummaryById(
        testSumId,
      );
    }

    if (testSumRecord.testTypeCode === TestTypeCodes.RATA) {
      // RATA-27 Result C
      error = this.rata27Check(rataRun, testSumRecord);
      if (error) {
        errorList.push(error);
      }

      // RATA-29 Result C
      error = this.rata29Check(rataRun, testSumRecord);
      if (error) {
        errorList.push(error);
      }

      // RATA-33 Result C
      error = this.rata33Check(rataRun, testSumRecord);
      if (error) {
        errorList.push(error);
      }

      // RATA-31 Result B
      error = this.rata31Check(rataRun);
      if (error) {
        errorList.push(error);
      }
    }

    this.throwIfErrors(errorList);
    this.logger.info('Completed RATA Run Checks');
    return errorList;
  }

  private rata27Check(
    rataRun: RataRunBaseDTO,
    testSumRecord: TestSummary,
  ): string {
    return (
      this.rataRunValueFloatCheck(
        rataRun,
        testSumRecord,
        'cemValue',
        'RATA-27-C',
        rataRun.cemValue,
      ) || null
    );
  }

  private rata29Check(
    rataRun: RataRunBaseDTO,
    testSumRecord: TestSummary,
  ): string {
    let error: string = null;

    if (rataRun.runStatusCode === 'IGNORED') {
      if (testSumRecord.system?.systemTypeCode !== 'ST') {
        error = CheckCatalogService.formatResultMessage('RATA-29-C');
      }
    }

    return error;
  }

  private rata33Check(
    rataRun: RataRunBaseDTO,
    testSumRecord: TestSummary,
  ): string {
    return (
      this.rataRunValueFloatCheck(
        rataRun,
        testSumRecord,
        'rataReferenceValue',
        'RATA-33-C',
        rataRun.rataReferenceValue,
      ) || null
    );
  }

  private rataRunValueFloatCheck(
    rataRun: RataRunBaseDTO,
    testSumRecord: TestSummary,
    fieldname: string,
    checkCode: string,
    value: number,
  ) {
    const error = this.getMessage(checkCode, {
      fieldname,
      key: KEY,
    });

    if (rataRun.runStatusCode === 'RUNUSED') {
      if (fieldname) {
        if (
          testSumRecord.system?.systemTypeCode !== null &&
          !['HCL', 'HF', 'HG', 'ST'].includes(
            testSumRecord.system?.systemTypeCode,
          )
        ) {
          if (value !== +value.toFixed(3)) {
            return error;
          }
        }
      }
    }
  }

  private rata31Check(rataRun: RataRunBaseDTO) {
    let error: string = null;
    const beginTime = `${rataRun.beginDate +
      rataRun.beginHour.toString() +
      rataRun.beginMinute.toString()}`;
    const endTime = `${rataRun.endDate +
      rataRun.endHour.toString() +
      rataRun.endMinute.toString()}`;

    if (beginTime > endTime) {
      error = CheckCatalogService.formatResultMessage('RATA-31-B', {
        key: KEY,
      });
    }

    return error;
  }

  getMessage(messageKey: string, messageArgs: object): string {
    return CheckCatalogService.formatResultMessage(messageKey, messageArgs);
  }
}
