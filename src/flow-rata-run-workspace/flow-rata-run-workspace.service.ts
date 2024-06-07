import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { currentDateTime } from '@us-epa-camd/easey-common/utilities/functions';
import { In } from 'typeorm';
import { v4 as uuid } from 'uuid';

import {
  FlowRataRunBaseDTO,
  FlowRataRunDTO,
  FlowRataRunImportDTO,
  FlowRataRunRecordDTO,
} from '../dto/flow-rata-run.dto';
import { FlowRataRun } from '../entities/flow-rata-run.entity';
import { FlowRataRunRepository } from '../flow-rata-run/flow-rata-run.repository';
import { FlowRataRunMap } from '../maps/flow-rata-run.map';
import { RataTraverseWorkspaceService } from '../rata-traverse-workspace/rata-traverse-workspace.service';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { FlowRataRunWorkspaceRepository } from './flow-rata-run-workspace.repository';

@Injectable()
export class FlowRataRunWorkspaceService {
  constructor(
    private readonly logger: Logger,
    private readonly repository: FlowRataRunWorkspaceRepository,
    private readonly map: FlowRataRunMap,
    @Inject(forwardRef(() => RataTraverseWorkspaceService))
    private readonly rataTravarseService: RataTraverseWorkspaceService,
    @Inject(forwardRef(() => TestSummaryWorkspaceService))
    private readonly testSummaryService: TestSummaryWorkspaceService,
    private readonly historicalRepository: FlowRataRunRepository,
  ) {}

  async getFlowRataRuns(rataRunId: string): Promise<FlowRataRunDTO[]> {
    const records = await this.repository.find({ where: { rataRunId } });

    return this.map.many(records);
  }

  async getFlowRataRun(id: string): Promise<FlowRataRunDTO> {
    const result = await this.repository.findOneBy({ id });

    if (!result) {
      throw new EaseyException(
        new Error(`Flow Rata Run record not found with Record Id [${id}].`),
        HttpStatus.NOT_FOUND,
      );
    }

    return this.map.one(result);
  }

  async createFlowRataRun(
    testSumId: string,
    rataRunId: string,
    payload: FlowRataRunBaseDTO,
    userId: string,
    isImport: boolean = false,
    historicalRecordId?: string,
  ): Promise<FlowRataRunRecordDTO> {
    const timestamp = currentDateTime();

    let entity = this.repository.create({
      ...payload,
      id: historicalRecordId ? historicalRecordId : uuid(),
      rataRunId,
      userId,
      addDate: timestamp,
      updateDate: timestamp,
    });

    await this.repository.save(entity);
    entity = await this.repository.findOneBy({ id: entity.id });
    await this.testSummaryService.resetToNeedsEvaluation(
      testSumId,
      userId,
      isImport,
    );

    return this.map.one(entity);
  }

  async updateRataRun(
    testSumId: string,
    flowRataRunId: string,
    payload: FlowRataRunBaseDTO,
    userId: string,
    isImport: boolean = false,
  ): Promise<FlowRataRunRecordDTO> {
    const timestamp = currentDateTime();
    const record = await this.repository.findOneBy({ id: flowRataRunId });

    if (!record) {
      throw new EaseyException(
        new Error(
          `A Flow Rata Run record not found with Record Id [${flowRataRunId}].`,
        ),
        HttpStatus.NOT_FOUND,
      );
    }

    record.numberOfTraversePoints = payload.numberOfTraversePoints;
    record.barometricPressure = payload.barometricPressure;
    record.staticStackPressure = payload.staticStackPressure;
    record.percentCO2 = payload.percentCO2;
    record.percentO2 = payload.percentO2;
    record.percentMoisture = payload.percentMoisture;
    record.dryMolecularWeight = payload.dryMolecularWeight;
    record.wetMolecularWeight = payload.wetMolecularWeight;
    record.averageVelocityWithoutWallEffects =
      payload.averageVelocityWithoutWallEffects;
    record.averageVelocityWithWallEffects =
      payload.averageVelocityWithWallEffects;
    record.calculatedWAF = payload.calculatedWAF;
    record.averageStackFlowRate = payload.averageStackFlowRate;
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

  async deleteFlowRataRun(
    testSumId: string,
    id: string,
    userId: string,
    isImport: boolean = false,
  ): Promise<void> {
    try {
      await this.repository.delete(id);
    } catch (e) {
      throw new EaseyException(
        new Error(`Error deleting Flow Rata Run with record Id [${id}]`),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    await this.testSummaryService.resetToNeedsEvaluation(
      testSumId,
      userId,
      isImport,
    );
  }

  async getFlowRataRunsByRataRunIds(
    rataRunIds: string[],
  ): Promise<FlowRataRunDTO[]> {
    const results = await this.repository.find({
      where: { rataRunId: In(rataRunIds) },
    });

    return this.map.many(results);
  }

  async import(
    testSumId: string,
    rataRunId: string,
    payload: FlowRataRunImportDTO,
    userId: string,
    isHistoricalRecord?: boolean,
  ) {
    const isImport = true;
    const promises = [];
    let historicalRecord: FlowRataRun;

    if (isHistoricalRecord) {
      historicalRecord = await this.historicalRepository.findOneBy({
        rataRunId: rataRunId,
        numberOfTraversePoints: payload.numberOfTraversePoints,
      });
    }

    const createdFlowRataRun = await this.createFlowRataRun(
      testSumId,
      rataRunId,
      payload,
      userId,
      isImport,
      historicalRecord ? historicalRecord.id : null,
    );

    this.logger.log(
      `Flow Rata Run Successfully Imported. Record Id: ${createdFlowRataRun.id}`,
    );

    if (payload.rataTraverseData?.length > 0) {
      for (const rataTraverse of payload.rataTraverseData) {
        promises.push(
          this.rataTravarseService.import(
            testSumId,
            createdFlowRataRun.id,
            rataTraverse,
            userId,
            isHistoricalRecord,
          ),
        );
      }
    }

    await Promise.all(promises);

    return null;
  }

  async export(rataRunIds: string[]): Promise<FlowRataRunDTO[]> {
    const flowRataRuns = await this.getFlowRataRunsByRataRunIds(rataRunIds);

    const rataTravarses = await this.rataTravarseService.export(
      flowRataRuns.map(i => i.id),
    );

    flowRataRuns.forEach(s => {
      s.rataTraverseData = rataTravarses.filter(i => i.flowRataRunId === s.id);
    });

    return flowRataRuns;
  }
}
