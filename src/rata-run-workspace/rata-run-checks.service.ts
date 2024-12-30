import { HttpStatus, Injectable } from '@nestjs/common';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { Logger } from '@us-epa-camd/easey-common/logger';

import { RataRunBaseDTO, RataRunImportDTO } from '../dto/rata-run.dto';
import { TestSummaryImportDTO } from '../dto/test-summary.dto';
import { TestSummary } from '../entities/test-summary.entity';
import { RataRun } from '../entities/workspace/rata-run.entity';
import { TestTypeCodes } from '../enums/test-type-code.enum';
import { MonitorSystemRepository } from '../monitor-system/monitor-system.repository';
import { TestSummaryWorkspaceRepository } from '../test-summary-workspace/test-summary.repository';
import { RataRunWorkspaceRepository } from './rata-run-workspace.repository';

const moment = require('moment');

const KEY = 'RATA Run';

@Injectable()
export class RataRunChecksService {
  constructor(
    private readonly logger: Logger,
    private readonly testSummaryRepository: TestSummaryWorkspaceRepository,
    private readonly repository: RataRunWorkspaceRepository,
    private readonly monitorSystemRepository: MonitorSystemRepository,
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
    rataRun: RataRunBaseDTO | RataRunImportDTO,
    locationId: string,
    testSumId?: string,
    isImport: boolean = false,
    isUpdate: boolean = false,
    testSummary?: TestSummaryImportDTO,
    rataSumId?: string,
    rataRuns?: RataRunImportDTO[],
  ): Promise<string[]> {
    let error: string = null;
    const errorList: string[] = [];
    let testSumRecord;

    this.logger.log('Running RATA Run Checks');

    if (isImport) {
      testSumRecord = testSummary;
      testSumRecord.system = await this.monitorSystemRepository.findOneBy({
        monitoringSystemID: testSummary.monitoringSystemId,
        locationId: locationId,
      });
    } else {
      testSumRecord = await this.testSummaryRepository.getTestSummaryById(
        testSumId,
      );
    }

    if (testSumRecord.testTypeCode === TestTypeCodes.RATA) {
      if (!isImport && rataRun.runStatusCode === 'RUNUSED') {
        // RATA-26
        error = this.rata26Check(rataRun.grossUnitLoad);
        if (error) {
          errorList.push(error);
        }

        // RATA-27
        error = this.rata27Check(rataRun, testSumRecord);
        if (error) {
          errorList.push(error);
        }

        // RATA-33
        error = this.rata33Check(rataRun, testSumRecord);
        if (error) {
          errorList.push(error);
        }

        // RATA-130
        error = this.rata130Check(rataRun, testSumRecord);
        if (error) {
          errorList.push(error);
        }
      }

      // RATA-29 Result C
      error = this.rata29Check(rataRun, testSumRecord);
      if (error) {
        errorList.push(error);
      }

      // RATA-31 Result B
      error = this.rata31Check(rataRun);
      if (error) {
        errorList.push(error);
      }

      if (!isUpdate) {
        // RATA-108 Duplicate RATA Run
        error = await this.rata108Check(rataRun, isImport, rataSumId, rataRuns);
        if (error) {
          errorList.push(error);
        }
      }
    }

    this.throwIfErrors(errorList, isImport);
    this.logger.log('Completed RATA Run Checks');
    return errorList;
  }

  private rata26Check(grossUnitLoad: number): string {
    if (grossUnitLoad === null || grossUnitLoad === undefined) {
      return this.getMessage('RATA-26-A', {
        fieldname: 'grossUnitLoad',
        key: KEY,
      });
    } else if (grossUnitLoad <= 0) {
      return this.getMessage('RATA-26-B', {
        fieldname: 'grossUnitLoad',
        key: KEY,
      });
    }
    return null;
  }

  private rata27Check(
    rataRun: RataRunBaseDTO,
    testSumRecord: TestSummary,
  ): string {
    if (rataRun.cemValue === null || rataRun.cemValue === undefined) {
      return this.getMessage('RATA-27-A', {
        fieldname: 'cemValue',
        key: KEY,
      });
    } else if (rataRun.cemValue < 0) {
      return this.getMessage('RATA-27-B', {
        fieldname: 'cemValue',
        key: KEY,
      });
    }

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
    if (
      rataRun.rataReferenceValue === null ||
      rataRun.rataReferenceValue === undefined
    ) {
      return this.getMessage('RATA-33-A', {
        fieldname: rataRun.rataReferenceValue,
        key: KEY,
      });
    } else if (rataRun.rataReferenceValue < 0) {
      return this.getMessage('RATA-33-B', {
        value: rataRun.rataReferenceValue,
        fieldname: 'rataReferenceValue',
        key: KEY,
      });
    }

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

  private async rata108Check(
    rataRun: RataRunBaseDTO | RataRunImportDTO,
    isImport: boolean,
    rataSumId: string,
    rataRuns: RataRunImportDTO[],
  ): Promise<string> {
    let error: string = null;
    let duplicates: RataRun[] | RataRunBaseDTO[];

    if (rataSumId && !isImport) {
      duplicates = await this.repository.findBy({
        rataSumId: rataSumId,
        runNumber: rataRun.runNumber,
      });
      if (duplicates.length > 0) {
        error = CheckCatalogService.formatResultMessage('RATA-108-A', {
          recordtype: KEY,
          fieldnames: 'runNumber & operatingLevelCode',
        });
      }
    }

    if (rataRuns?.length > 1 && isImport) {
      duplicates = rataRuns.filter(rs => rs.runNumber === rataRun.runNumber);

      if (duplicates.length > 1) {
        error = CheckCatalogService.formatResultMessage('RATA-108-A', {
          recordtype: KEY,
          fieldnames: 'runNumber & operatingLevelCode',
        });
      }
    }
    return error;
  }

  private rata130Check(
    rataRun: RataRunBaseDTO,
    testSumRecord: TestSummary,
  ): string {
    let error: string = null;
    let beginDate = moment(rataRun.beginDate);
    let endDate = moment(rataRun.endDate);
    beginDate.hours(rataRun.beginHour);
    endDate.hours(rataRun.endHour);
    beginDate.minutes(rataRun.beginMinute);
    endDate.minutes(rataRun.endMinute);

    if (rataRun.runStatusCode === 'RUNUSED') {
      if (testSumRecord.system?.systemTypeCode === 'FLOW') {
        if (endDate.diff(beginDate, 'minute') < 5) {
          error = CheckCatalogService.formatResultMessage('RATA-130-A', {
            key: KEY,
          });
        }
      } else if (
        !testSumRecord.system?.systemTypeCode.startsWith('HG') &&
        testSumRecord.system?.systemTypeCode !== 'FLOW'
      ) {
        if (endDate.diff(beginDate, 'minute') < 20) {
          error = CheckCatalogService.formatResultMessage('RATA-130-B', {
            key: KEY,
          });
        }
      }
    }

    return error;
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

    const beginDate = moment(rataRun.beginDate);
    const endDate = moment(rataRun.endDate);

    if (
      beginDate.isAfter(endDate) ||
      (beginDate.isSame(endDate) && rataRun.beginHour > rataRun.endHour) ||
      (beginDate.isSame(endDate) &&
        rataRun.beginHour === rataRun.endHour &&
        rataRun.beginMinute >= rataRun.endMinute)
    ) {
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
