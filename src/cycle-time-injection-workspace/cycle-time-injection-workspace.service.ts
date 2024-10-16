import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { currentDateTime } from '@us-epa-camd/easey-common/utilities/functions';
import { In } from 'typeorm';
import { v4 as uuid } from 'uuid';

import { CycleTimeInjectionRepository } from '../cycle-time-injection/cycle-time-injection.repository';
import {
  CycleTimeInjectionBaseDTO,
  CycleTimeInjectionDTO,
  CycleTimeInjectionImportDTO,
  CycleTimeInjectionRecordDTO,
} from '../dto/cycle-time-injection.dto';
import { CycleTimeInjection } from '../entities/cycle-time-injection.entity';
import { CycleTimeInjectionMap } from '../maps/cycle-time-injection.map';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { CycleTimeInjectionWorkspaceRepository } from './cycle-time-injection-workspace.repository';

@Injectable()
export class CycleTimeInjectionWorkspaceService {
  constructor(
    private readonly logger: Logger,
    private readonly map: CycleTimeInjectionMap,
    @Inject(forwardRef(() => TestSummaryWorkspaceService))
    private readonly testSummaryService: TestSummaryWorkspaceService,
    private readonly repository: CycleTimeInjectionWorkspaceRepository,
    private readonly historicalRepository: CycleTimeInjectionRepository,
  ) {}

  async getCycleTimeInjectionsByCycleTimeSumId(cycleTimeSumId: string) {
    const results = await this.repository.find({
      where: {
        cycleTimeSumId,
      },
    });

    return this.map.many(results);
  }

  async getCycleTimeInjection(id: string) {
    const result = await this.repository.findOneBy({ id });

    if (!result) {
      throw new EaseyException(
        new Error(
          `A Cycle Time Injection record not found with Record Id [${id}]`,
        ),
        HttpStatus.NOT_FOUND,
      );
    }

    return this.map.one(result);
  }

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

    entity = await this.repository.findOneBy({ id: entity.id });

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
      historicalRecord = await this.historicalRepository.findOneBy({
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

    this.logger.log(
      `Cycle Time Injection Successfully Imported. Record Id: ${createdCycleTimeInjection.id}`,
    );

    return null;
  }

  async updateCycleTimeInjection(
    testSumId: string,
    id: string,
    payload: CycleTimeInjectionBaseDTO,
    userId: string,
    isImport: boolean = false,
  ): Promise<CycleTimeInjectionRecordDTO> {
    const timestamp = currentDateTime();

    const entity = await this.repository.findOneBy({ id });

    if (!entity) {
      throw new EaseyException(
        new Error(
          `A Cycle Time Injection record not found with Record Id [${id}].`,
        ),
        HttpStatus.NOT_FOUND,
      );
    }

    entity.gasLevelCode = payload.gasLevelCode;
    entity.calibrationGasValue = payload.calibrationGasValue;
    entity.beginDate = payload.beginDate;
    entity.beginHour = payload.beginHour;
    entity.beginMinute = payload.beginMinute;
    entity.beginMinute = payload.beginMinute;
    entity.endDate = payload.endDate;
    entity.endHour = payload.endHour;
    entity.endMinute = payload.endMinute;
    entity.injectionCycleTime = payload.injectionCycleTime;
    entity.beginMonitorValue = payload.beginMonitorValue;
    entity.endMonitorValue = payload.endMonitorValue;
    entity.userId = userId;
    entity.updateDate = timestamp;

    await this.repository.save(entity);

    await this.testSummaryService.resetToNeedsEvaluation(
      testSumId,
      userId,
      isImport,
    );

    return this.map.one(entity);
  }

  async deleteCycleTimeInjection(
    testSumId: string,
    id: string,
    userId: string,
    isImport: boolean = false,
  ): Promise<void> {
    try {
      await this.repository.delete({ id });
    } catch (e) {
      throw new EaseyException(
        new Error(`Error deleting Cycle Time Injection record Id [${id}]`),
        HttpStatus.INTERNAL_SERVER_ERROR,
        e,
      );
    }

    await this.testSummaryService.resetToNeedsEvaluation(
      testSumId,
      userId,
      isImport,
    );
  }
}
