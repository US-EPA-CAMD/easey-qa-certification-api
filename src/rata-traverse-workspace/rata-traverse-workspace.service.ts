import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';

import { currentDateTime } from '../utilities/functions';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { RataTraverseMap } from '../maps/rata-traverse.map';
import { RataTraverseWorkspaceRepository } from './rata-traverse-workspace.repository';
import {
  RataTraverseBaseDTO,
  RataTraverseRecordDTO,
} from '../dto/rata-traverse.dto';

@Injectable()
export class RataTraverseWorkspaceService {
  constructor(
    @InjectRepository(RataTraverseWorkspaceRepository)
    private readonly repository: RataTraverseWorkspaceRepository,
    private readonly map: RataTraverseMap,
    @Inject(forwardRef(() => TestSummaryWorkspaceService))
    private readonly testSummaryService: TestSummaryWorkspaceService,
  ) {}

  async createRataTraverse(
    testSumId: string,
    flowRataRunId: string,
    payload: RataTraverseBaseDTO,
    userId: string,
    isImport: boolean = false,
  ): Promise<RataTraverseRecordDTO> {
    const timestamp = currentDateTime();

    let entity = this.repository.create({
      ...payload,
      id: uuid(),
      flowRataRunId,
      userId,
      addDate: timestamp,
      updateDate: timestamp,
    });

    await this.repository.save(entity);

    entity = await this.repository.findOne(entity.id);

    await this.testSummaryService.resetToNeedsEvaluation(
      testSumId,
      userId,
      isImport,
    );

    return this.map.one(entity);
  }

  async updateRataTraverse(
    testSumId: string,
    rataTraverseId: string,
    payload: RataTraverseBaseDTO,
    userId: string,
    isImport: boolean = false,
  ): Promise<RataTraverseRecordDTO> {
    const timestamp = currentDateTime();
    const record = await this.repository.findOne(rataTraverseId);

    if (!record) {
      throw new LoggingException(
        `A Rata Traverse record not found with Record Id [${rataTraverseId}].`,
        HttpStatus.NOT_FOUND,
      );
    }

    record.probeId = payload.probeId;
    record.probeTypeCode = payload.probeTypeCode;
    record.pressureMeasureCode = payload.pressureMeasureCode;
    record.methodTraversePointId = payload.methodTraversePointId;
    record.velocityCalibrationCoefficient =
      payload.velocityCalibrationCoefficient;
    record.lastProbeDate = payload.lastProbeDate;
    record.avgVelDiffPressure = payload.avgVelDiffPressure;
    record.avgSquareVelDiffPressure = payload.avgSquareVelDiffPressure;
    record.tStackTemperature = payload.tStackTemperature;
    record.pointUsedIndicator = payload.pointUsedIndicator;
    record.numberWallEffectsPoints = payload.numberWallEffectsPoints;
    record.yawAngle = payload.yawAngle;
    record.pitchAngle = payload.pitchAngle;
    record.calculatedVelocity = payload.calculatedVelocity;
    record.replacementVelocity = payload.replacementVelocity;
    record.userId = userId;
    record.updateDate = timestamp;

    await this.repository.save(record);

    await this.testSummaryService.resetToNeedsEvaluation(
      testSumId,
      userId,
      isImport,
    );

    return this.map.one(record);
  }
}
