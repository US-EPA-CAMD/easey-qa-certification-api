import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { currentDateTime } from '@us-epa-camd/easey-common/utilities/functions';
import { EntityManager, In, IsNull } from 'typeorm';
import { v4 as uuid } from 'uuid';

import { CycleTimeInjectionWorkspaceService } from '../cycle-time-injection-workspace/cycle-time-injection-workspace.service';
import { CycleTimeSummaryRepository } from '../cycle-time-summary/cycle-time-summary.repository';
import { settlePromises } from '../utilities/constants';
import {
  CycleTimeSummaryBaseDTO,
  CycleTimeSummaryDTO,
  CycleTimeSummaryImportDTO,
} from '../dto/cycle-time-summary.dto';
import { CycleTimeSummary } from '../entities/cycle-time-summary.entity';
import { CycleTimeSummaryMap } from '../maps/cycle-time-summary.map';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { CycleTimeSummaryWorkspaceRepository } from './cycle-time-summary-workspace.repository';

@Injectable()
export class CycleTimeSummaryWorkspaceService {
  constructor(
    private readonly logger: Logger,
    private readonly map: CycleTimeSummaryMap,
    @Inject(forwardRef(() => TestSummaryWorkspaceService))
    private readonly testSummaryService: TestSummaryWorkspaceService,
    private readonly repository: CycleTimeSummaryWorkspaceRepository,
    private readonly historicalRepository: CycleTimeSummaryRepository,
    @Inject(forwardRef(() => CycleTimeInjectionWorkspaceService))
    private readonly cycleTimeInjectionService: CycleTimeInjectionWorkspaceService,
  ) {}

  async getCycleTimeSummaries(
    testSumId: string,
  ): Promise<CycleTimeSummaryDTO[]> {
    const records = await this.repository.find({ where: { testSumId } });

    return this.map.many(records);
  }

  async getCycleTimeSummary(
    id: string,
    testSumId: string,
  ): Promise<CycleTimeSummaryDTO> {
    const result = await this.repository.findOneBy({
      id,
      testSumId,
    });

    if (!result) {
      throw new EaseyException(
        new Error(
          `Cycle Time Summary record not found with Record Id [${id}].`,
        ),
        HttpStatus.NOT_FOUND,
      );
    }

    return this.map.one(result);
  }

  async createCycleTimeSummary(
    testSumId: string,
    payload: CycleTimeSummaryBaseDTO,
    userId: string,
    isImport: boolean = false,
    historicalRecordId?: string,
    trx?: EntityManager,
  ): Promise<CycleTimeSummaryDTO> {
    const timestamp = currentDateTime();
    const repository = trx ? trx.getRepository(CycleTimeSummary) : this.repository;

    let entity = repository.create({
      ...payload,
      id: historicalRecordId ? historicalRecordId : uuid(),
      testSumId,
      userId,
      addDate: timestamp,
      updateDate: timestamp,
    });

    await repository.save(entity);
    entity = await repository.findOneBy({ id: entity.id });
    await this.testSummaryService.resetToNeedsEvaluation(
      testSumId,
      userId,
      isImport,
      trx,
    );
    return this.map.one(entity);
  }

  async updateCycleTimeSummary(
    testSumId: string,
    id: string,
    payload: CycleTimeSummaryBaseDTO,
    userId: string,
    isImport: boolean = false,
    trx?: EntityManager,
  ): Promise<CycleTimeSummaryDTO> {
    const repository = trx ? trx.getRepository(CycleTimeSummary) : this.repository;
    const entity = await repository.findOneBy({
      id,
      testSumId,
    });

    if (!entity) {
      throw new EaseyException(
        new Error(
          `Cycle Time Summary record not found with Record Id [${id}].`,
        ),
        HttpStatus.NOT_FOUND,
      );
    }

    entity.totalTime = payload.totalTime;

    const timestamp = currentDateTime();
    entity.userId = userId;
    entity.updateDate = timestamp;

    await repository.save(entity);

    await this.testSummaryService.resetToNeedsEvaluation(
      testSumId,
      userId,
      isImport,
      trx,
    );

    return this.map.one(entity);
  }

  async deleteCycleTimeSummary(
    testSumId: string,
    id: string,
    userId: string,
    isImport: boolean = false,
    trx?: EntityManager,
  ): Promise<void> {
    try {
      const repository = trx ? trx.getRepository(CycleTimeSummary) : this.repository;
      await repository.delete({
        id,
        testSumId,
      });
    } catch (e) {
      throw new EaseyException(
        new Error(`Error deleting Cycle Time Summary record [${id}]`),
        HttpStatus.INTERNAL_SERVER_ERROR,
        e,
      );
    }

    await this.testSummaryService.resetToNeedsEvaluation(
      testSumId,
      userId,
      isImport,
      trx,
    );
  }

  async getCycleTimeSummaryByTestSumIds(
    testSumIds: string[],
  ): Promise<CycleTimeSummaryDTO[]> {
    const results = await this.repository.find({
      where: { testSumId: In(testSumIds) },
    });
    return this.map.many(results);
  }

  async export(testSumIds: string[]): Promise<CycleTimeSummaryDTO[]> {
    const cycleTimeSummaries = await this.getCycleTimeSummaryByTestSumIds(
      testSumIds,
    );

    const cycleTimeInjections = await this.cycleTimeInjectionService.export(
      cycleTimeSummaries.map(i => i.id),
    );

    cycleTimeSummaries.forEach(s => {
      s.cycleTimeInjectionData = cycleTimeInjections.filter(
        i => i.cycleTimeSumId === s.id,
      );
    });

    return cycleTimeSummaries;
  }

  async import(
    testSumId: string,
    payload: CycleTimeSummaryImportDTO,
    userId: string,
    isHistoricalRecord?: boolean,
    trx?: EntityManager,
  ) {
    const isImport = true;
    let historicalRecord: CycleTimeSummary;

    if (isHistoricalRecord) {
      historicalRecord = await this.historicalRepository.findOneBy({
        testSumId: testSumId,
        totalTime: payload.totalTime ?? IsNull(),
      });
    }

    const createdCycleTimeSummary = await this.createCycleTimeSummary(
      testSumId,
      payload,
      userId,
      isImport,
      historicalRecord ? historicalRecord.id : null,
      trx,
    );

    this.logger.log(
      `Cycle Time Summary Successfully Imported. Record Id: ${createdCycleTimeSummary.id}`,
    );

    await settlePromises(
      payload.cycleTimeInjectionData?.map(cycleTimeInjection =>
        this.cycleTimeInjectionService.import(
          testSumId,
          createdCycleTimeSummary.id,
          cycleTimeInjection,
          userId,
          isHistoricalRecord,
          trx,
        ),
      ) || [],
      this.logger,
    );

    return null;
  }
}
