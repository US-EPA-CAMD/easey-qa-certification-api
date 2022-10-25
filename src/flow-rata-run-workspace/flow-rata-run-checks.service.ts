import { HttpStatus, Injectable } from '@nestjs/common';

import { Logger } from '@us-epa-camd/easey-common/logger';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import {
  FlowRataRunBaseDTO,
  FlowRataRunImportDTO,
} from '../dto/flow-rata-run.dto';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { InjectRepository } from '@nestjs/typeorm';
import { RataSummaryImportDTO } from '../dto/rata-summary.dto';
import { RataSummaryWorkspaceRepository } from '../rata-summary-workspace/rata-summary-workspace.repository';
import { RataSummary } from '../entities/workspace/rata-summary.entity';
import { RataRunImportDTO } from '../dto/rata-run.dto';
import { RataRunWorkspaceRepository } from '../rata-run-workspace/rata-run-workspace.repository';
import { RataRun } from '../entities/workspace/rata-run.entity';
import { TestSummaryWorkspaceRepository } from '../test-summary-workspace/test-summary.repository';
import { TestTypeCodes } from '../enums/test-type-code.enum';
import { TestSummaryImportDTO } from '../dto/test-summary.dto';

const KEY = 'Flow RATA Run';

@Injectable()
export class FlowRataRunChecksService {
  constructor(
    private readonly logger: Logger,
    @InjectRepository(RataSummaryWorkspaceRepository)
    private readonly rataSummaryRepository: RataSummaryWorkspaceRepository,
    @InjectRepository(RataRunWorkspaceRepository)
    private readonly rataRunRepository: RataRunWorkspaceRepository,
    @InjectRepository(TestSummaryWorkspaceRepository)
    private readonly testSummaryRepository: TestSummaryWorkspaceRepository,
  ) {}

  private throwIfErrors(errorList: string[]) {
    if (errorList.length > 0) {
      throw new LoggingException(errorList, HttpStatus.BAD_REQUEST);
    }
  }

  async runChecks(
    flowRataRun: FlowRataRunBaseDTO | FlowRataRunImportDTO,
    isImport: boolean = false,
    _isUpdate: boolean = false,
    rataSumId?: string,
    rataSummary?: RataSummaryImportDTO,
    rataRunId?: string,
    rataRun?: RataRunImportDTO,
    testSumId?: string,
    testSummary?: TestSummaryImportDTO,
  ): Promise<string[]> {
    let error: string = null;
    const errorList: string[] = [];
    let rataSummaryRecord, rataRunRecord, testSumRecord;

    this.logger.info('Running Flow Rata Run Checks');

    if (isImport) {
      testSumRecord = testSummary;
      rataSummaryRecord = rataSummary;
      rataRunRecord = rataRun;
    } else {
      testSumRecord = await this.testSummaryRepository.getTestSummaryById(
        testSumId,
      );
      rataSummaryRecord = await this.rataSummaryRepository.findOne(rataSumId);
      rataRunRecord = await this.rataRunRepository.findOne(rataRunId);
    }

    if (testSumRecord.testTypeCode === TestTypeCodes.RATA) {
      error = this.rata114Check(
        rataSummaryRecord,
        flowRataRun.averageVelocityWithWallEffects,
      );
      if (error) {
        errorList.push(error);
      }

      error = this.rata124Check(rataSummaryRecord, rataRunRecord);
      if (error) {
        errorList.push(error);
      }
    }

    /* // RATA-85 Number of Traverse Points Valid
    error = this.rata85Check(flowRataRun, rataSummaryRecord);
    if (error) {
      errorList.push(error);
    }
    
    if (!isUpdate) {
      // RATA-109 Duplicate Flow RATA Run
      error = this.rata109Check(rataSummaryRecord, rataRunRecord);
      if (error) {
        errorList.push(error);
      }
    } */

    this.throwIfErrors(errorList);
    this.logger.info('Completed Flow Rata Run Checks');
    return errorList;
  }

  /* // RATA-85 Number of Traverse Points Valid
  private rata85Check(
    flowRataRun: FlowRataRunBaseDTO | FlowRataRunImportDTO,
    rataSummary: RataSummaryImportDTO | RataSummary,
  ): string {
    let error: string = null;
    let rataReplacementPointCount = 0;

    if (!['2FH', '2GH', 'M2H'].includes(rataSummary.referenceMethodCode) && rataReplacementPointCount > 0 && flowRataRun.numberOfTraversePoints < 16) {
      error = CheckCatalogService.formatResultMessage('RATA-85-C', {
        key: 'Flow RATA Run',
      });
    }

    return error;
  }

  // RATA-109 Duplicate Flow RATA Run
  private rata109Check(
    rataSummary: RataSummaryImportDTO | RataSummary,
    rataRun: RataRunImportDTO | RataRun,
  ): string {
    let error: string = null;

    return error;
  } */

  private rata114Check(
    rataSummaryRecord: RataSummary,
    averageVelocityWithWallEffects: number,
  ): string {
    let error: string = null;
    let FIELDNAME: string = 'averageVelocityWithWallEffects;' + '';
    if (averageVelocityWithWallEffects) {
      if (
        ['2F', '2G', '2FJ', '2GJ'].includes(
          rataSummaryRecord.referenceMethodCode,
        )
      ) {
        error = this.getMessage('RATA-114-A', {
          fieldname: FIELDNAME,
          key: KEY,
        });
      } else if (
        averageVelocityWithWallEffects < 0 ||
        averageVelocityWithWallEffects > 20000
      ) {
        error = this.getMessage('RATA-114-B', {
          fieldname: FIELDNAME,
          key: KEY,
        });
      }
    } else {
      if (
        rataSummaryRecord.referenceMethodCode === 'M2H' ||
        rataSummaryRecord.calculatedWAF
      ) {
        error = this.getMessage('RATA-114-C', {
          fieldname: FIELDNAME,
          key: KEY,
        });
      }
    }

    return error;
  }

  private rata124Check(
    rataSummaryRecord: RataSummary,
    rataRunRecord: RataRun,
  ): string {
    let error: string = null;

    if (
      rataSummaryRecord.referenceMethodCode &&
      !rataSummaryRecord.referenceMethodCode.match('(2F|2G|M2H).*')
    ) {
      error = this.getMessage('RATA-124-A');
    } else if (rataRunRecord.runStatusCode === 'NOTUSED') {
      error = this.getMessage('RATA-124-B');
    }

    return error;
  }

  getMessage(messageKey: string, messageArgs?: object): string {
    return CheckCatalogService.formatResultMessage(messageKey, messageArgs);
  }
}
