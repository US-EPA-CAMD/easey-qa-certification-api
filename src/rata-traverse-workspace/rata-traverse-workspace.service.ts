import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { currentDateTime } from '@us-epa-camd/easey-common/utilities/functions';
import { EntityManager, In } from 'typeorm';
import { v4 as uuid } from 'uuid';

import {
  RataTraverseBaseDTO,
  RataTraverseDTO,
  RataTraverseImportDTO,
  RataTraverseRecordDTO,
} from '../dto/rata-traverse.dto';
import { RataTraverse } from '../entities/rata-traverse.entity';
import { RataTraverseMap } from '../maps/rata-traverse.map';
import { RataTraverseRepository } from '../rata-traverse/rata-traverse.repository';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { RataTraverseWorkspaceRepository } from './rata-traverse-workspace.repository';

@Injectable()
export class RataTraverseWorkspaceService {
  constructor(
      private readonly logger: Logger,
      private readonly repository: RataTraverseWorkspaceRepository,
      private readonly map: RataTraverseMap,
      @Inject(forwardRef(() => TestSummaryWorkspaceService))
      private readonly testSummaryService: TestSummaryWorkspaceService,
      private readonly historicalRepository: RataTraverseRepository,
  ) {}

  async getRataTraverses(
      flowRataRunId: string,
  ): Promise<RataTraverseRecordDTO[]> {
    const records = await this.repository.find({ where: { flowRataRunId } });

    return this.map.many(records);
  }

  async getRataTraverse(id: string): Promise<RataTraverseRecordDTO> {
    const result = await this.repository.findOneBy({ id });

    if (!result) {
      throw new EaseyException(
          new Error(`Rata Traverse record not found with Record Id [${id}].`),
          HttpStatus.NOT_FOUND,
      );
    }

    return this.map.one(result);
  }

  async createRataTraverse(
      testSumId: string,
      flowRataRunId: string,
      payload: RataTraverseBaseDTO,
      userId: string,
      isImport: boolean = false,
      historicalRecordId?: string,
      trx?: EntityManager,
  ): Promise<RataTraverseRecordDTO> {
    const timestamp = currentDateTime();

    // Use the transaction entity manager if provided
    const repo = trx ? trx.getRepository(this.repository.target) : this.repository;

    let entity = repo.create({
      ...payload,
      id: historicalRecordId ? historicalRecordId : uuid(),
      flowRataRunId,
      userId,
      addDate: timestamp,
      updateDate: timestamp,
    });

    await repo.save(entity);

    entity = await repo.findOneBy({ id: entity.id });

    await this.testSummaryService.resetToNeedsEvaluation(
        testSumId,
        userId,
        isImport,
        trx,
    );

    return this.map.one(entity);
  }

  async updateRataTraverse(
      testSumId: string,
      rataTraverseId: string,
      payload: RataTraverseBaseDTO,
      userId: string,
      isImport: boolean = false,
      trx?: EntityManager,
  ): Promise<RataTraverseRecordDTO> {
    const timestamp = currentDateTime();

    // Use the transaction entity manager if provided
    const repo = trx ? trx.getRepository(this.repository.target) : this.repository;

    const record = await repo.findOneBy({ id: rataTraverseId });

    if (!record) {
      throw new EaseyException(
          new Error(
              `A Rata Traverse record not found with Record Id [${rataTraverseId}].`,
          ),
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
    record.averageVelocityDifferencePressure =
        payload.averageVelocityDifferencePressure;
    record.averageSquareVelocityDifferencePressure =
        payload.averageSquareVelocityDifferencePressure;
    record.tStackTemperature = payload.tStackTemperature;
    record.pointUsedIndicator = payload.pointUsedIndicator;
    record.numberWallEffectsPoints = payload.numberWallEffectsPoints;
    record.yawAngle = payload.yawAngle;
    record.pitchAngle = payload.pitchAngle;
    record.calculatedVelocity = payload.calculatedVelocity;
    record.replacementVelocity = payload.replacementVelocity;
    record.userId = userId;
    record.updateDate = timestamp;

    await repo.save(record);

    await this.testSummaryService.resetToNeedsEvaluation(
        testSumId,
        userId,
        isImport,
        trx,
    );

    return this.map.one(record);
  }

  async deleteRataTraverse(
      testSumId: string,
      id: string,
      userId: string,
      isImport: boolean = false,
      trx?: EntityManager,
  ): Promise<void> {
    // Use the transaction entity manager if provided
    const repo = trx ? trx.getRepository(this.repository.target) : this.repository;
    await repo.delete(id);

    await this.testSummaryService.resetToNeedsEvaluation(
        testSumId,
        userId,
        isImport,
        trx,
    );
  }

  async getRatatravarsesByFlowRataRunIds(
      flowRataRunIds: string[],
  ): Promise<RataTraverseDTO[]> {
    const results = await this.repository.find({
      where: { flowRataRunId: In(flowRataRunIds) },
    });
    return this.map.many(results);
  }

  async import(
      testSumId: string,
      flowRataRunId: string,
      payload: RataTraverseImportDTO,
      userId: string,
      isHistoricalRecord?: boolean,
      trx?: EntityManager,
  ) {
    const isImport = true;
    let historicalRecord: RataTraverse;

    if (isHistoricalRecord) {
      historicalRecord = await this.historicalRepository.findOneBy({
        flowRataRunId: flowRataRunId,
        methodTraversePointId: payload.methodTraversePointId,
      });
    }

    const createdRataRun = await this.createRataTraverse(
        testSumId,
        flowRataRunId,
        payload,
        userId,
        isImport,
        historicalRecord ? historicalRecord.id : null,
        trx,
    );

    this.logger.log(
        `Rata Traverse Successfully Imported. Record Id: ${createdRataRun.id}`,
    );

    return null;
  }

  async export(flowRataRunIds: string[]): Promise<RataTraverseDTO[]> {
    return this.getRatatravarsesByFlowRataRunIds(flowRataRunIds);
  }
}
