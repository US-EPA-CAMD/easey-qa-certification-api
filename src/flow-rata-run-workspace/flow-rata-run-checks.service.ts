import { HttpStatus, Injectable } from '@nestjs/common';

import { Logger } from '@us-epa-camd/easey-common/logger';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
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

    this.logger.log('Running Flow Rata Run Checks');

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

      error = this.rata115Check(
        rataSummaryRecord,
        flowRataRun.averageVelocityWithoutWallEffects,
      );
      if (error) {
        errorList.push(error);
      }

      error = this.rata124Check(rataSummaryRecord, rataRunRecord);
      if (error) {
        errorList.push(error);
      }

      error = this.rata94Check(rataRunRecord, flowRataRun.averageStackFlowRate);
      if (error) {
        errorList.push(error);
      }
    }

    this.throwIfErrors(errorList, isImport);
    this.logger.log('Completed Flow Rata Run Checks');
    return errorList;
  }

  private rata94Check(
    rataRunRecord: RataRun | RataRunImportDTO,
    averageStackFlowRate: number,
  ): string {
    let error: string = null;
    if (
      rataRunRecord.rataReferenceValue &&
      averageStackFlowRate !== rataRunRecord.rataReferenceValue
    ) {
      error = this.getMessage('RATA-94-C', {
        key: KEY,
      });
    }
    return error;
  }

  private rata115Check(
    rataSummaryRecord: RataSummary,
    averageVelocityWithoutWallEffects: number,
  ): string {
    let error: string = null;
    let FIELDNAME: string = 'averageVelocityWithoutWallEffects';
    if (averageVelocityWithoutWallEffects <= 0) {
      error = this.getMessage('RATA-115-B', {
        fieldname: FIELDNAME,
        key: KEY,
      });
    }
    return error;
  }

  private rata114Check(
    rataSummaryRecord: RataSummary,
    averageVelocityWithWallEffects: number,
  ): string {
    let error: string = null;
    let FIELDNAME: string = 'averageVelocityWithWallEffects';
    if (
      averageVelocityWithWallEffects !== null ||
      averageVelocityWithWallEffects === 0
    ) {
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
        averageVelocityWithWallEffects <= 0 ||
        averageVelocityWithWallEffects >= 20000
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
