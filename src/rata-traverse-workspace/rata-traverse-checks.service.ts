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
let rataInvalidProbes = [];
const YAW_ANGLE_MIN_VALUE = -90;
const YAW_ANGLE_MAX_VALUE = 90;
const PITCH_ANGLE_MIN_VALUE = -90;
const PITCH_ANGLE_MAX_VALUE = 90;

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
      rataSumRecord = await this.rataSummaryRepository.findOne(rataSumId);
    }

    if (testSumRecord.testTypeCode === TestTypeCodes.RATA) {

      error = this.rata72Check(rataTraverse, rataSumRecord);
      if (error) {
        errorList.push(error);
      }
      
      error = this.rata75Check(
        testSumRecord.beginDate,
        rataTraverse.lastProbeDate,
      );
      error && errorList.push(error);

      error = this.rata76Check(rataTraverse);
      if (error) {
        errorList.push(error);
      }

      error = this.rata78Check(
        rataSumRecord.referenceMethodCode,
        rataTraverse.yawAngle,
      );
      if (error) {
        errorList.push(error);
      }

      error = this.rata81Check(rataTraverse, rataSumRecord);
      if (error) {
        errorList.push(error);
      }

      error = this.rata82Check(rataTraverse, rataSumRecord);
      if (error) {
        errorList.push(error);
      }

      error = this.rata83Check(rataTraverse, rataSumRecord);
      if (error) {
        errorList.push(error);
      }
    
      if (!isUpdate) {
        error = await this.rata110Check(
          rataTraverse,
          isImport,
          flowRataRunId,
          rataTraverses,
        );
        if (error) {
          errorList.push(error);
        }
      }
    }

    this.throwIfErrors(errorList);
    this.logger.info('Completed RATA Traverse Checks');
    return errorList;
  }

  private rata72Check(
    rataTraverse: RataTraverseBaseDTO | RataTraverseImportDTO,
    rataSumRecord: RataSummary,
  ): string {
    let error = null;

    if(rataTraverse.probeTypeCode){
      if(!rataInvalidProbes.includes(rataTraverse.probeTypeCode)){
        if(rataSumRecord.referenceMethodCode.startsWith('2F')){
          if(!['PRISM', 'PRISM-T', 'SPHERE'].includes(rataTraverse.probeTypeCode)){
            rataInvalidProbes.push(rataTraverse.probeTypeCode)
            error = this.getMessage('RATA-72-B', {
              value: rataTraverse.probeTypeCode,
              key: KEY,
              method: rataSumRecord.referenceMethodCode,
            });
          }
        } else if (rataSumRecord.referenceMethodCode.startsWith('2G')){
          if(rataTraverse.probeTypeCode === 'PRANDT1'){
            rataInvalidProbes.push(rataTraverse.probeTypeCode)
            error = this.getMessage('RATA-72-B', {
              value: rataTraverse.probeTypeCode,
              key: KEY,
              method: rataSumRecord.referenceMethodCode,
            });
          }
        } else if (rataSumRecord.referenceMethodCode === 'M2H'){
          if(!['TYPE-SA', 'TYPE-SM', 'PRANDT1'].includes(rataTraverse.probeTypeCode)){
            rataInvalidProbes.push(rataTraverse.probeTypeCode)
            error = this.getMessage('RATA-72-B', {
              value: rataTraverse.probeTypeCode,
              key: KEY,
              method: rataSumRecord.referenceMethodCode,
            });
          }
        }
      }
    }

    return error;
  }

  private rata75Check(testSumBeginDate, lastProbeDate) {
    let error = null;

    if (testSumBeginDate && lastProbeDate > testSumBeginDate) {
      error = this.getMessage('RATA-75-B', {
        key: KEY,
      });
    }

    return error;
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

  private rata78Check(referenceMethodCode: string, yawAngle: number): string {
    let error: string = null;

    if (['2F', '2G'].includes(referenceMethodCode)) {
      if (!yawAngle) {
        error = this.getMessage('RATA-78-A', {
          key: KEY,
        });
      }

      if (yawAngle < YAW_ANGLE_MIN_VALUE || yawAngle > YAW_ANGLE_MAX_VALUE) {
        error = this.getMessage('RATA-78-B', {
          value: yawAngle,
          fieldname: 'yawAngle',
          minvalue: YAW_ANGLE_MIN_VALUE,
          maxvalue: YAW_ANGLE_MAX_VALUE,
        });
      }
    } else {
      if (yawAngle) {
        error = this.getMessage('RATA-78-C', {
          fieldname: 'yawAngle',
          key: KEY,
        });
      }
    }

    return error;
  }

  private rata79Check(referenceMethodCode: string, pitchAngle: number): string {
    let error: string = null;

    if (referenceMethodCode === '2F') {
      if (!pitchAngle) {
        error = this.getMessage('RATA-79-A', {
          key: KEY,
        });
      }

      if (
        pitchAngle < PITCH_ANGLE_MIN_VALUE ||
        pitchAngle > PITCH_ANGLE_MAX_VALUE
      ) {
        error = this.getMessage('RATA-79-B', {
          value: pitchAngle,
          fieldname: 'yawAngle',
          minvalue: PITCH_ANGLE_MIN_VALUE,
          maxvalue: PITCH_ANGLE_MAX_VALUE,
        });
      }
    } else {
      if (pitchAngle) {
        error = this.getMessage('RATA-79-C', {
          fieldname: 'pitchAngle',
          key: KEY,
        });
      }
    }

    return error;
  }

  private rata81Check(
    rataTraverse: RataTraverseBaseDTO | RataTraverseImportDTO,
    rataSumRecord: RataSummary,
  ): string {
    let error = null;
    const FIELDNAME = 'ReferenceMethodCode';

    if (rataTraverse.pointUsedIndicator === 1) {
      if (['2FH', '2GH', 'M2H'].includes(rataSumRecord.referenceMethodCode)) {
        if (
          !rataTraverse.replacementVelocity ||
          rataTraverse.replacementVelocity === 0
        ) {
          if (
            rataSumRecord.referenceMethodCode === 'M2H' ||
            !rataSumRecord.defaultWAF
          ) {
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
    const FIELDNAME = 'NumberWallEffectsPoints';

    if (['2FH', '2GH', 'M2H'].includes(rataSumRecord.referenceMethodCode)) {
      if (rataTraverse.pointUsedIndicator === 1) {
        if (
          !rataTraverse.numberWallEffectsPoints ||
          rataTraverse.numberWallEffectsPoints < 2
        ) {
          if (
            rataSumRecord.referenceMethodCode === 'M2H' ||
            !rataSumRecord.defaultWAF
          ) {
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
        if (
          rataTraverse.numberWallEffectsPoints ||
          rataTraverse.numberWallEffectsPoints === 0
        ) {
          error = this.getMessage('RATA-82-C', {
            fieldname: FIELDNAME,
            key: KEY,
          });
        }
      }
    } else {
      if (rataSumRecord.referenceMethodCode) {
        if (
          rataTraverse.numberWallEffectsPoints ||
          rataTraverse.numberWallEffectsPoints === 0
        ) {
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
    const FIELDNAME = 'replacementVelocity';

    if (['2FH', '2GH', 'M2H'].includes(rataSumRecord.referenceMethodCode)) {
      if (rataTraverse.pointUsedIndicator === 1) {
        if (
          !rataTraverse.replacementVelocity &&
          rataTraverse.replacementVelocity !== 0
        ) {
          error = this.getMessage('RATA-83-A', {
            fieldname: FIELDNAME,
            key: KEY,
          });
        } else if (
          rataTraverse.replacementVelocity <= 0 ||
          rataTraverse.replacementVelocity >= 20000
        ) {
          error = this.getMessage('RATA-83-B', {
            fieldname: FIELDNAME,
            key: KEY,
          });
        }
      } else {
        if (
          rataTraverse.replacementVelocity ||
          rataTraverse.replacementVelocity === 0
        ) {
          if (
            rataSumRecord.referenceMethodCode === 'M2H' ||
            !rataSumRecord.defaultWAF
          ) {
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
      if (rataSumRecord.referenceMethodCode) {
        if (
          rataTraverse.replacementVelocity ||
          rataTraverse.replacementVelocity === 0
        ) {
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
    const FIELDNAMES =
      'runNumber, operatingLevelCode, and MethodTraversePointID';

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
      duplicates = rataTraverses.filter(
        rs => rs.methodTraversePointID === rataTraverse.methodTraversePointID,
      );
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
