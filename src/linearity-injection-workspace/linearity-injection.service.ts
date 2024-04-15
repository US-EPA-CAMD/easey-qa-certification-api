import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { currentDateTime } from '@us-epa-camd/easey-common/utilities/functions';
import { In } from 'typeorm';
import { v4 as uuid } from 'uuid';

import {
  LinearityInjectionBaseDTO,
  LinearityInjectionDTO,
  LinearityInjectionImportDTO,
  LinearityInjectionRecordDTO,
} from '../dto/linearity-injection.dto';
import { LinearityInjection } from '../entities/linearity-injection.entity';
import { LinearityInjectionRepository } from '../linearity-injection/linearity-injection.repository';
import { LinearityInjectionMap } from '../maps/linearity-injection.map';
import { TestSummaryWorkspaceService } from './../test-summary-workspace/test-summary.service';
import { LinearityInjectionWorkspaceRepository } from './linearity-injection.repository';

@Injectable()
export class LinearityInjectionWorkspaceService {
  constructor(
    private readonly logger: Logger,
    private readonly map: LinearityInjectionMap,
    @Inject(forwardRef(() => TestSummaryWorkspaceService))
    private readonly testSummaryService: TestSummaryWorkspaceService,
    private readonly repository: LinearityInjectionWorkspaceRepository,
    private readonly historicalRepository: LinearityInjectionRepository,
  ) {}

  async getInjectionById(id: string): Promise<LinearityInjectionDTO> {
    const result = await this.repository.findOneBy({ id });

    if (!result) {
      throw new EaseyException(
        new Error(
          `A linearity injection record not found with Record Id [${id}].`,
        ),
        HttpStatus.NOT_FOUND,
      );
    }

    return this.map.one(result);
  }

  async getInjectionsByLinSumId(
    linSumId: string,
  ): Promise<LinearityInjectionDTO[]> {
    const results = await this.repository.findBy({
      linSumId: linSumId,
    });
    return this.map.many(results);
  }

  async getInjectionsByLinSumIds(
    linSumIds: string[],
  ): Promise<LinearityInjectionDTO[]> {
    const results = await this.repository.findBy({
      linSumId: In(linSumIds),
    });
    return this.map.many(results);
  }

  async export(linSumIds: string[]): Promise<LinearityInjectionDTO[]> {
    return this.getInjectionsByLinSumIds(linSumIds);
  }

  async import(
    testSumId: string,
    linSumId: string,
    payload: LinearityInjectionImportDTO,
    userId: string,
    isHistoricalRecord?: boolean,
  ) {
    const isImport = true;
    let historicalRecord: LinearityInjection;

    if (isHistoricalRecord) {
      historicalRecord = await this.historicalRepository.findOneBy({
        linSumId: linSumId,
        injectionDate: payload.injectionDate,
        injectionHour: payload.injectionHour,
        injectionMinute: payload.injectionMinute,
      });
    }

    const result = await this.createInjection(
      testSumId,
      linSumId,
      payload,
      userId,
      isImport,
      historicalRecord ? historicalRecord.id : null,
    );

    this.logger.log(
      `Linearity Injection Successfully Imported. Record Id: ${result.id}`,
    );
    return null;
  }

  async createInjection(
    testSumId: string,
    linSumId: string,
    payload: LinearityInjectionBaseDTO | LinearityInjectionImportDTO,
    userId: string,
    isImport: boolean = false,
    historicalRecordId?: string,
  ): Promise<LinearityInjectionRecordDTO> {
    const timestamp = currentDateTime();

    let entity = this.repository.create({
      ...payload,
      id: historicalRecordId ? historicalRecordId : uuid(),
      linSumId,
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

  async updateInjection(
    testSumId: string,
    id: string,
    payload: LinearityInjectionBaseDTO,
    userId: string,
    isImport: boolean = false,
  ): Promise<LinearityInjectionRecordDTO> {
    const timestamp = currentDateTime();
    const entity = await this.repository.findOneBy({ id });

    if (!entity) {
      throw new EaseyException(
        new Error(
          `A linearity injection record not found with Record Id [${id}].`,
        ),
        HttpStatus.NOT_FOUND,
      );
    }

    entity.injectionDate = payload.injectionDate;
    entity.injectionHour = payload.injectionHour;
    entity.injectionMinute = payload.injectionMinute;
    entity.measuredValue = payload.measuredValue;
    entity.referenceValue = payload.referenceValue;
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

  async deleteInjection(
    testSumId: string,
    id: string,
    userId: string,
    isImport: boolean = false,
  ): Promise<void> {
    try {
      await this.repository.delete(id);
    } catch (e) {
      throw new EaseyException(
        new Error(`Error deleting Linearity Injection record Id [${id}]`),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    await this.testSummaryService.resetToNeedsEvaluation(
      testSumId,
      userId,
      isImport,
    );
  }
}
