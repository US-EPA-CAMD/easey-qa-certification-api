import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';

import { TestSummary } from '../entities/test-summary.entity';
import { RataRunBaseDTO, RataRunImportDTO } from '../dto/rata-run.dto';
import { TestSummaryImportDTO } from '../dto/test-summary.dto';
import { TestSummaryWorkspaceRepository } from '../test-summary-workspace/test-summary.repository';
import { TestTypeCodes } from '../enums/test-type-code.enum';
import { RataRunWorkspaceRepository } from './rata-run-workspace.repository';
import { RataRun } from '../entities/workspace/rata-run.entity';

const KEY = 'RATA Run';
@Injectable()
export class RataRunChecksService {
  constructor(
    private readonly logger: Logger,
    @InjectRepository(TestSummaryWorkspaceRepository)
    private readonly testSummaryRepository: TestSummaryWorkspaceRepository,
    @InjectRepository(RataRunWorkspaceRepository)
    private readonly repository: RataRunWorkspaceRepository,
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
    rataSumId?: string,
    rataRuns?: RataRunImportDTO[],
  ): Promise<string[]> {
    let error: string = null;
    const errorList: string[] = [];
    let testSumRecord;

    this.logger.info('Running RATA Run Checks');

    if (isImport) {
      testSumRecord = TestSummary;
    } else {
      testSumRecord = await this.testSummaryRepository.getTestSummaryById(
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

      // RATA-101
      error = this.rata101Check(rataRun, testSumRecord);
      if (error) {
        errorList.push(error);
      }

      // RATA-130
      error = this.rata130Check(rataRun, testSumRecord);
      if (error) {
        errorList.push(error);
      }

      if (!isUpdate) {
        // RATA-108 Duplicate RATA Run
        error = await this.rata108Check(
          rataRun,
          isImport,
          rataSumId,
          rataRuns,
        );
        if (error) {
          errorList.push(error);
        }
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

  private rata101Check(
    rataRun: RataRunBaseDTO,
    testSumRecord: TestSummary,
  ): string {
    let error: string = null;
    
    if(rataRun.runStatusCode === 'RUNUSED'){
      if(
        testSumRecord.system?.systemTypeCode === 'FLOW' 
        && (
          (rataRun.cemValue > 0 
            && (Math.ceil(rataRun.cemValue/1000)*1000 !== rataRun.cemValue)
          ) || 
          (rataRun.rataReferenceValue > 0 
            && (Math.ceil(rataRun.rataReferenceValue/1000)*1000 !== rataRun.rataReferenceValue)
          )
        )
      ) {
        error = this.getMessage('RATA-101-A', {
          key: KEY,
        });
      } else if (
        rataRun.cemValue <= 0 || rataRun.rataReferenceValue <= 0
      ) {
        error = this.getMessage('RATA-101-B', {
          key: KEY,
        });
      }
    }

    return error;
  }

  private async rata108Check(
    rataRun: RataRunBaseDTO | RataRunImportDTO,
    isImport: boolean,
    rataSumId: string,
    rataRuns: RataRunImportDTO[],
  ): Promise<string> {
    let error: string = null;
    let duplicates: RataRun[] | RataRunBaseDTO[];
    this.logger.info(rataRun)
    this.logger.info(isImport)
    this.logger.info(rataSumId)
    this.logger.info(rataRuns)

    if (rataSumId && !isImport) {
      duplicates = await this.repository.find({
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
      duplicates = rataRuns.filter(
        rs => rs.runNumber === rataRun.runNumber,
      );

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
    let beginDate = new Date(rataRun.beginDate);
    let endDate = new Date(rataRun.endDate);
    beginDate.setHours(rataRun.beginHour)
    endDate.setHours(rataRun.endHour)
    beginDate.setMinutes(rataRun.beginMinute)
    endDate.setMinutes(rataRun.endMinute)

    if(rataRun.runStatusCode === 'RUNUSED'){
      if(testSumRecord.system?.systemTypeCode === 'FLOW'){
        if((Math.abs(endDate.getTime() - beginDate.getTime()))/(1000*60) < 5){
          error = CheckCatalogService.formatResultMessage('RATA-130-A', {
            key: KEY,
          });
        }
      } else if (
        testSumRecord.system?.systemTypeCode.startsWith('HG')
      ) {
        if((Math.abs(endDate.getTime() - beginDate.getTime()))/(1000*60) < 21){
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

  getMessage(messageKey: string, messageArgs: object): string {
    return CheckCatalogService.formatResultMessage(messageKey, messageArgs);
  }
}
