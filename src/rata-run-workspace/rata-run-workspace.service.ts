import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { RataRunWorkspaceRepository } from './rata-run-workspace.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { RataRunMap } from '../maps/rata-run.map';
import {
  RataRunBaseDTO,
  RataRunDTO,
  RataRunImportDTO,
  RataRunRecordDTO,
} from '../dto/rata-run.dto';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { currentDateTime } from '../utilities/functions';
import { v4 as uuid } from 'uuid';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { In } from 'typeorm';
import { RataRun } from '../entities/rata-run.entity';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { RataRunRepository } from '../rata-run/rata-run.repository';
import { FlowRataRunWorkspaceService } from '../flow-rata-run-workspace/flow-rata-run-workspace.service';

@Injectable()
export class RataRunWorkspaceService {
  constructor(
    private readonly logger: Logger,
    @InjectRepository(RataRunWorkspaceRepository)
    private readonly repository: RataRunWorkspaceRepository,
    private readonly map: RataRunMap,
    @Inject(forwardRef(() => TestSummaryWorkspaceService))
    private readonly testSummaryService: TestSummaryWorkspaceService,
    @Inject(forwardRef(() => FlowRataRunWorkspaceService))
    private readonly flowRataRunService: FlowRataRunWorkspaceService,
    @InjectRepository(RataRunRepository)
    private readonly historicalRepository: RataRunRepository,
  ) {}

  async getRataRuns(rataSumId: string): Promise<RataRunDTO[]> {
    const records = await this.repository.find({ where: { rataSumId } });

    return this.map.many(records);
  }

  async getRataRun(id: string): Promise<RataRunDTO> {
    const result = await this.repository.findOne(id);

    if (!result) {
      throw new LoggingException(
        `Rata Run record not found with Record Id [${id}].`,
        HttpStatus.NOT_FOUND,
      );
    }

    return this.map.one(result);
  }

  async createRataRun(
    testSumId: string,
    rataSumId: string,
    payload: RataRunBaseDTO,
    userId: string,
    isImport: boolean = false,
    historicalRecordId?: string,
  ): Promise<RataRunRecordDTO> {
    const timestamp = currentDateTime();

    let entity = this.repository.create({
      ...payload,
      id: historicalRecordId ? historicalRecordId : uuid(),
      rataSumId,
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

  async deleteRataRun(
    testSumId: string,
    id: string,
    userId: string,
    isImport: boolean = false,
  ): Promise<void> {
    await this.repository.delete(id);

    await this.testSummaryService.resetToNeedsEvaluation(
      testSumId,
      userId,
      isImport,
    );
  }

  async updateRataRun(
    testSumId: string,
    rataRunId: string,
    payload: RataRunBaseDTO,
    userId: string,
    isImport: boolean = false,
  ): Promise<RataRunRecordDTO> {
    const timestamp = currentDateTime();
    const record = await this.repository.findOne(rataRunId);

    if (!record) {
      throw new LoggingException(
        `A Rata Run record not found with Record Id [${rataRunId}].`,
        HttpStatus.NOT_FOUND,
      );
    }

    record.runNumber = payload.runNumber;
    record.beginDate = payload.beginDate;
    record.beginHour = payload.beginHour;
    record.beginMinute = payload.beginMinute;
    record.endDate = payload.endDate;
    record.endHour = payload.endHour;
    record.endMinute = payload.endMinute;
    record.cemValue = payload.cemValue;
    record.rataReferenceValue = payload.rataReferenceValue;
    record.grossUnitLoad = payload.grossUnitLoad;
    record.runStatusCode = payload.runStatusCode;
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

  async getRataRunsByRataSumIds(rataSumIds: string[]): Promise<RataRunDTO[]> {
    const results = await this.repository.find({
      where: { rataSumId: In(rataSumIds) },
    });
    return this.map.many(results);
  }

  async import(
    testSumId: string,
    rataSumId: string,
    payload: RataRunImportDTO,
    userId: string,
    isHistoricalRecord?: boolean,
  ) {
    const isImport = true;
    const promises = [];
    let historicalRecord: RataRun;

    if (isHistoricalRecord) {
      historicalRecord = await this.historicalRepository.findOne({
        rataSumId: rataSumId,
        runNumber: payload.runNumber,
      });
    }

    const createdRataRun = await this.createRataRun(
      testSumId,
      rataSumId,
      payload,
      userId,
      isImport,
      historicalRecord ? historicalRecord.id : null,
    );

    this.logger.info(
      `Rata Run Successfully Imported. Record Id: ${createdRataRun.id}`,
    );

    if (payload.flowRataRunData?.length > 0) {
      for (const flowRataRun of payload.flowRataRunData) {
        promises.push(
          this.flowRataRunService.import(
            testSumId,
            createdRataRun.id,
            flowRataRun,
            userId,
            isHistoricalRecord,
          ),
        );
      }
    }

    await Promise.all(promises);

    return null;
  }

  async export(rataSumIds: string[]): Promise<RataRunDTO[]> {
    const rataRuns = await this.getRataRunsByRataSumIds(rataSumIds);

    const flowRataRuns = await this.flowRataRunService.export(
      rataRuns.map(i => i.id),
    );

    rataRuns.forEach(s => {
      s.flowRataRunData = flowRataRuns.filter(i => i.rataRunId === s.id);
    });

    return rataRuns;
  }
}
