import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';

import { TestSummary } from '../entities/test-summary.entity';
import { RataRunBaseDTO, RataRunImportDTO } from '../dto/rata-run.dto';
import { TestSummaryImportDTO } from '../dto/test-summary.dto';
import { TestSummaryWorkspaceRepository } from '../test-summary-workspace/test-summary.repository';
import { MonitorSystemRepository } from '../monitor-system/monitor-system.repository';

@Injectable()
export class RataRunChecksService {
  constructor(
    private readonly logger: Logger,
    @InjectRepository(TestSummaryWorkspaceRepository)
    private readonly testSummaryRepository: TestSummaryWorkspaceRepository,
    @InjectRepository(MonitorSystemRepository)
    private readonly monitoringSystemRepository: MonitorSystemRepository,
  ) {}

  KEY: 'RATA Run';

  private throwIfErrors(errorList: string[], isImport: boolean = false) {
    if (!isImport && errorList.length > 0) {
      throw new LoggingException(errorList, HttpStatus.BAD_REQUEST);
    }
  }

  async runChecks(
    locationId: string,
    rataRun: RataRunBaseDTO | RataRunImportDTO,
    testSumId?: string,
    isImport: boolean = false,
    _isUpdate: boolean = false,
    testSummary?: TestSummaryImportDTO,
  ): Promise<string[]> {
    let error: string = null;
    const errorList: string[] = [];
    let testSumRecord;

    this.logger.info('Running RATA Run Checks');

    if (isImport) {
      testSumRecord = TestSummary;

      testSumRecord.system = await this.monitoringSystemRepository.findOne({
        monitoringSystemID: testSummary.monitoringSystemID,
        locationId,
      });
    } else {
      testSumRecord = await this.testSummaryRepository.getTestSummaryById(
        testSumId,
      );
    }

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

    this.throwIfErrors(errorList, isImport);

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
        rataRun.rataReferenceValue,
      ) || null
    );
  }

  private rata29Check(
    rataRun: RataRunBaseDTO,
    testSumRecord: TestSummary,
  ): string {
    let error: string = null;

    const resultC = this.getMessage('RATA-29-C', {});

    if (rataRun.runStatusCode === 'IGNORED') {
      if (testSumRecord.system?.systemTypeCode !== 'ST') {
        error = resultC;
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
      key: this.KEY,
    });

    if (rataRun.runStatusCode === 'RUNUSED') {
      if (rataRun.rataReferenceValue) {
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

  getMessage(messageKey: string, messageArgs: object): string {
    return CheckCatalogService.formatResultMessage(messageKey, messageArgs);
  }
}
