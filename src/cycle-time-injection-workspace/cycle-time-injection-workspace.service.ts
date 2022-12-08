import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';
import { Logger } from '@us-epa-camd/easey-common/logger';

import { currentDateTime } from '../utilities/functions';
import {
  CycleTimeInjectionBaseDTO,
  CycleTimeInjectionDTO,
  CycleTimeInjectionImportDTO,
  CycleTimeInjectionRecordDTO,
} from '../dto/cycle-time-injection.dto';
import { CycleTimeInjectionWorkspaceRepository } from './cycle-time-injection-workspace.repository';
import { CycleTimeInjectionMap } from '../maps/cycle-time-injection.map';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { In } from 'typeorm';
import { CycleTimeInjection } from '../entities/cycle-time-injection.entity';
import { CycleTimeInjectionRepository } from '../cycle-time-injection/cycle-time-injection.repository';

@Injectable()
export class CycleTimeInjectionWorkspaceService {
  constructor(
    private readonly logger: Logger,
    private readonly map: CycleTimeInjectionMap,
    @Inject(forwardRef(() => TestSummaryWorkspaceService))
    private readonly testSummaryService: TestSummaryWorkspaceService,
    @InjectRepository(CycleTimeInjectionWorkspaceRepository)
    private readonly repository: CycleTimeInjectionWorkspaceRepository,
    @InjectRepository(CycleTimeInjectionRepository)
    private readonly historicalRepository: CycleTimeInjectionRepository,
  ) {}

  async createCycleTimeInjection(
    testSumId: string,
    cycleTimeSumId: string,
    payload: CycleTimeInjectionBaseDTO | CycleTimeInjectionImportDTO,
    userId: string,
    isImport: boolean = false,
    historicalRecordId?: string,
  ): Promise<CycleTimeInjectionRecordDTO> {
    const timestamp = currentDateTime();

    let entity = this.repository.create({
      ...payload,
      id: historicalRecordId ? historicalRecordId : uuid(),
      cycleTimeSumId,
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

  async getCycleTimeInjectionByCycleTimeSumIds(
    cycleTimeSumIds: string[],
  ): Promise<CycleTimeInjectionDTO[]> {
    const results = await this.repository.find({
      where: { cycleTimeSumId: In(cycleTimeSumIds) },
    });
    return this.map.many(results);
  }

  async export(cycleTimeSumIds: string[]): Promise<CycleTimeInjectionDTO[]> {
    return this.getCycleTimeInjectionByCycleTimeSumIds(cycleTimeSumIds);
  }

  async import(
    testSumId: string,
    cycleTimeSumId: string,
    payload: CycleTimeInjectionImportDTO,
    userId: string,
    isHistoricalRecord?: boolean,
  ) {
    const isImport = true;
    let historicalRecord: CycleTimeInjection;

    if (isHistoricalRecord) {
      historicalRecord = await this.historicalRepository.findOne({
        cycleTimeSumId: cycleTimeSumId,
        gasLevelCode: payload.gasLevelCode,
      });
    }

    const createdCycleTimeInjection = await this.createCycleTimeInjection(
      testSumId,
      cycleTimeSumId,
      payload,
      userId,
      isImport,
      historicalRecord ? historicalRecord.id : null,
    );

    this.logger.info(
      `Cycle Time Injection Successfully Imported. Record Id: ${createdCycleTimeInjection.id}`,
    );

    return null;
  }
}
