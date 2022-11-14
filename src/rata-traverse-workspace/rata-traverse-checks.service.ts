import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';

import { TestSummaryImportDTO } from '../dto/test-summary.dto';
import { TestTypeCodes } from '../enums/test-type-code.enum';
import { TestSummaryWorkspaceRepository } from '../test-summary-workspace/test-summary.repository';
import { MonitorSystemRepository } from '../monitor-system/monitor-system.repository';
import {
  RataTraverseBaseDTO,
  RataTraverseImportDTO,
} from '../dto/rata-traverse.dto';
import { RataSummary } from '../entities/workspace/rata-summary.entity';
import { RataSummaryWorkspaceRepository } from '../rata-summary-workspace/rata-summary-workspace.repository';
import { RataSummaryImportDTO } from '../dto/rata-summary.dto';
import { RataTraverse } from '../entities/workspace/rata-traverse.entity';
import { RataTraverseWorkspaceRepository } from './rata-traverse-workspace.repository';

const KEY = 'RATA Traverse';

@Injectable()
export class RataTraverseChecksService {
  constructor(
    private readonly logger: Logger,
    @InjectRepository(TestSummaryWorkspaceRepository)
    private readonly testSummaryRepository: TestSummaryWorkspaceRepository,
    @InjectRepository(RataTraverseWorkspaceRepository)
    private readonly repository: RataTraverseWorkspaceRepository,
    @InjectRepository(MonitorSystemRepository)
    private readonly monitorSystemRepository: MonitorSystemRepository,
    @InjectRepository(RataSummaryWorkspaceRepository)
    private readonly rataSummaryRepository: RataSummaryWorkspaceRepository,
  ) {}

  private throwIfErrors(errorList: string[]) {
    if (errorList.length > 0) {
      throw new LoggingException(errorList, HttpStatus.BAD_REQUEST);
    }
  }

  getMessage(messageKey: string, messageArgs: object): string {
    return CheckCatalogService.formatResultMessage(messageKey, messageArgs);
  }

  async runChecks(
    rataTraverse: RataTraverseBaseDTO | RataTraverseImportDTO,
    locationId: string,
    testSumId?: string,
    testSummary?: TestSummaryImportDTO,
    rataSumId?: string,
    rataSummary?: RataSummaryImportDTO,
    flowRataRunId?: string,
    isImport: boolean = false,
    isUpdate: boolean = false,
    rataTraverses?: RataTraverseImportDTO[],
  ): Promise<string[]> {
    let error: string = null;
    const errorList: string[] = [];
    let testSumRecord;
    let rataSumRecord;

    this.logger.info('Running RATA Traverse Checks');

    if (isImport) {
      testSumRecord = testSummary;
      rataSumRecord = rataSummary;
      testSumRecord.system = await this.monitorSystemRepository.findOne({
        monitoringSystemID: testSummary.monitoringSystemID,
        locationId: locationId,
      });
    } else {
      testSumRecord = await this.testSummaryRepository.getTestSummaryById(
        testSumId,
      );
      rataSumRecord = await this.rataSummaryRepository.findOne(
        rataSumId,
      );
    }

    if (testSumRecord.testTypeCode === TestTypeCodes.RATA) {
      error = this.rata76Check(rataTraverse);
      if (error) {
        errorList.push(error);
      }
    
      this.logger.info(errorList)

      error = this.rata81Check(rataTraverse, rataSumRecord);
      if (error) {
        errorList.push(error);
      }
    
      this.logger.info(errorList)

      error = this.rata82Check(rataTraverse, rataSumRecord);
      if (error) {
        errorList.push(error);
      }

    
      this.logger.info(errorList)
      error = this.rata83Check(rataTraverse, rataSumRecord);
      if (error) {
        errorList.push(error);
      }
    
      this.logger.info(errorList)
      if (!isUpdate) {
        error = await this.rata110Check(rataTraverse, isImport, flowRataRunId, rataTraverses);
        if (error) {
          errorList.push(error);
        }
      }
    }
    
    
    this.logger.info(errorList)

    this.throwIfErrors(errorList);
    this.logger.info('Completed RATA Traverse Checks');
    return errorList;
  }

  private rata76Check(
    rataTraverse: RataTraverseBaseDTO | RataTraverseImportDTO,
  ): string {
    let error = null;

    if (
      rataTraverse.avgVelDiffPressure === null &&
      rataTraverse.avgSquareVelDiffPressure === null
    ) {
      error = this.getMessage('RATA-76-A', {
        key: KEY,
      });
    }

    if (
      rataTraverse.avgVelDiffPressure !== null &&
      rataTraverse.avgSquareVelDiffPressure !== null
    ) {
      error = this.getMessage('RATA-76-B', {
        key: KEY,
      });
    }

    return error;
  }

  private rata81Check(
    rataTraverse: RataTraverseBaseDTO | RataTraverseImportDTO,
    rataSumRecord: RataSummary,
  ): string {
    let error = null;
    const FIELDNAME = "ReferenceMethodCode";

    if(rataTraverse.pointUsedIndicator === 1){
      if(['2FH', '2GH', 'M2H'].includes(rataSumRecord.referenceMethodCode)){
        if(!rataTraverse.replacementVelocity || rataTraverse.replacementVelocity === 0){
          if(rataSumRecord.referenceMethodCode === 'M2H' || !rataSumRecord.defaultWAF){
            error = this.getMessage('RATA-81-A', {
              key: KEY,
            });
          } else {
            error = this.getMessage('RATA-81-B', {
              key: KEY,
            });
          }
        }
      } else {
        error = this.getMessage('RATA-81-C', {
          fieldname: FIELDNAME,
          key: KEY,
        });
      }
    }

    return error;
  }

  private rata82Check(
    rataTraverse: RataTraverseBaseDTO | RataTraverseImportDTO,
    rataSumRecord: RataSummary,
  ): string {
    let error = null;
    const FIELDNAME = "NumberWallEffectsPoints";

    if(['2FH', '2GH', 'M2H'].includes(rataSumRecord.referenceMethodCode)){
      if(rataTraverse.pointUsedIndicator === 1){
        if(!rataTraverse.numberWallEffectsPoints || rataTraverse.numberWallEffectsPoints < 2){
          if(rataSumRecord.referenceMethodCode === 'M2H' || !rataSumRecord.defaultWAF){
            error = this.getMessage('RATA-82-A', {
              key: KEY,
            });
          } else {
            error = this.getMessage('RATA-82-B', {
              key: KEY,
            });
          }
        }
      } else {
        if(rataTraverse.numberWallEffectsPoints || rataTraverse.numberWallEffectsPoints === 0){
          error = this.getMessage('RATA-82-C', {
            fieldname: FIELDNAME,
            key: KEY,
          });
        }
      }
    } else {
      if(rataSumRecord.referenceMethodCode){
        if(rataTraverse.numberWallEffectsPoints || rataTraverse.numberWallEffectsPoints === 0){
          error = this.getMessage('RATA-82-D', {
            fieldname: FIELDNAME,
            key: KEY,
          });
        }
      }
    }

    return error;
  }

  private rata83Check(
    rataTraverse: RataTraverseBaseDTO | RataTraverseImportDTO,
    rataSumRecord: RataSummary,
  ): string {
    let error = null;
    const FIELDNAME = "replacementVelocity";

    if(['2FH', '2GH', 'M2H'].includes(rataSumRecord.referenceMethodCode)){
      if(rataTraverse.pointUsedIndicator === 1){
        if(!rataTraverse.replacementVelocity && rataTraverse.replacementVelocity !== 0){
          error = this.getMessage('RATA-83-A', {
            fieldname: FIELDNAME,
            key: KEY,
          });
        } else if(rataTraverse.replacementVelocity <= 0 || rataTraverse.replacementVelocity >= 20000){
          error = this.getMessage('RATA-83-B', {
            fieldname: FIELDNAME,
            key: KEY,
          });
        }
      } else {
        if(rataTraverse.replacementVelocity || rataTraverse.replacementVelocity === 0){
          if(rataSumRecord.referenceMethodCode === 'M2H' || !rataSumRecord.defaultWAF){
            error = this.getMessage('RATA-83-C', {
              key: KEY,
            });
          } else {
            error = this.getMessage('RATA-83-D', {
              key: KEY,
            });
          }
        }
      }
    } else {
      if(rataSumRecord.referenceMethodCode){
        if(rataTraverse.replacementVelocity || rataTraverse.replacementVelocity === 0){
          error = this.getMessage('RATA-83-E', {
            fieldname: FIELDNAME,
            key: KEY,
          });
        }
      }
    }

    return error;
  }

  private async rata110Check(
    rataTraverse: RataTraverseBaseDTO | RataTraverseImportDTO,
    isImport: boolean,
    flowRataRunId: string,
    rataTraverses: RataTraverseImportDTO[],
  ): Promise<string> {
    let error: string = null;
    let duplicates: RataTraverse[] | RataTraverseBaseDTO[];
    const FIELDNAMES = 'runNumber, operatingLevelCode, and MethodTraversePointID';
    
    if (flowRataRunId && !isImport) {
      duplicates = await this.repository.find({
        flowRataRunId: flowRataRunId,
        methodTraversePointID: rataTraverse.methodTraversePointID,
      });
      if (duplicates.length > 0) {
        error = CheckCatalogService.formatResultMessage('RATA-110-A', {
          recordtype: KEY,
          fieldnames: FIELDNAMES,
        });
      }
    }

    if (rataTraverses?.length > 1 && isImport) {
      duplicates = rataTraverses.filter(rs => rs.methodTraversePointID === rataTraverse.methodTraversePointID);
      if (duplicates.length > 1) {
        error = CheckCatalogService.formatResultMessage('RATA-110-A', {
          recordtype: KEY,
          fieldnames: FIELDNAMES,
        });
      }
    }
    return error;
  }
}
