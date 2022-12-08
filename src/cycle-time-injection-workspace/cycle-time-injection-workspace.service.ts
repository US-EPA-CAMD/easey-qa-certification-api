import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';

import { currentDateTime } from '../utilities/functions';
import {
  CycleTimeInjectionBaseDTO,
  CycleTimeInjectionImportDTO,
  CycleTimeInjectionRecordDTO,
} from '../dto/cycle-time-injection.dto';
import { CycleTimeInjectionWorkspaceRepository } from './cycle-time-injection-workspace.repository';
import { CycleTimeInjectionMap } from '../maps/cycle-time-injection.map';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';

@Injectable()
export class CycleTimeInjectionWorkspaceService {
  constructor(
    private readonly logger: Logger,
    private readonly map: CycleTimeInjectionMap,
    @Inject(forwardRef(() => TestSummaryWorkspaceService))
    private readonly testSummaryService: TestSummaryWorkspaceService,
    @InjectRepository(CycleTimeInjectionWorkspaceRepository)
    private readonly repository: CycleTimeInjectionWorkspaceRepository,
  ) {}

  async createCycleTimeInjection(
    testSumId: string,
    cycleTimeSumId: string,
    payload: CycleTimeInjectionBaseDTO | CycleTimeInjectionImportDTO,
    userId: string,
    isImport: boolean = false,
  ): Promise<CycleTimeInjectionRecordDTO> {
    const timestamp = currentDateTime();

    let entity = this.repository.create({
      ...payload,
      id: uuid(),
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

  async updateCycleTimeInjection(
    testSumId: string,
    id: string,
    payload: CycleTimeInjectionBaseDTO,
    userId: string,
    isImport: boolean = false,
  ): Promise<CycleTimeInjectionRecordDTO> {
    const timestamp = currentDateTime();

    const entity = await this.repository.findOne(id);

    if (!entity) {
      throw new LoggingException(
        `A Cycle Time Injection record not found with Record Id [${id}].`,
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
}
