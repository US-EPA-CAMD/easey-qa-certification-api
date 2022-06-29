import { In } from 'typeorm';
import { v4 as uuid } from 'uuid';

import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Logger } from '@us-epa-camd/easey-common/logger';

import {
  LinearityInjectionDTO,
  LinearityInjectionBaseDTO,
  LinearityInjectionRecordDTO,
  LinearityInjectionImportDTO,
} from '../dto/linearity-injection.dto';

import { currentDateTime } from '../utilities/functions';
import { LinearityInjectionMap } from '../maps/linearity-injection.map';
import { LinearityInjectionWorkspaceRepository } from './linearity-injection.repository';
import { TestSummaryWorkspaceService } from './../test-summary-workspace/test-summary.service';

@Injectable()
export class LinearityInjectionWorkspaceService {
  constructor(
    private readonly logger: Logger,
    private readonly map: LinearityInjectionMap,
    @Inject(forwardRef(() => TestSummaryWorkspaceService))
    private readonly testSummaryService: TestSummaryWorkspaceService,
    @InjectRepository(LinearityInjectionWorkspaceRepository)
    private readonly repository: LinearityInjectionWorkspaceRepository,
  ) {}

  async getInjectionById(id: string): Promise<LinearityInjectionDTO> {
    const result = await this.repository.findOne(id);
    return this.map.one(result);
  }

  async getInjectionsByLinSumId(
    linSumId: string,
  ): Promise<LinearityInjectionDTO[]> {
    const results = await this.repository.find({ linSumId });
    return this.map.many(results);
  }

  async getInjectionsByLinSumIds(
    linSumIds: string[],
  ): Promise<LinearityInjectionDTO[]> {
    const results = await this.repository.find({
      where: { linSumId: In(linSumIds) },
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
  ) {
    const isImport = true;
    const result = await this.createInjection(
      testSumId,
      linSumId,
      payload,
      userId,
      isImport,
    );

    this.logger.info(
      `Linearity Injection Successfully Imported. Record Id: ${result.id}`,
    );
    return null;
  }

  async createInjection(
    testSumId: string,
    linSumId: string,
    payload: LinearityInjectionBaseDTO,
    userId: string,
    isImport: boolean = false,
  ): Promise<LinearityInjectionRecordDTO> {
    const timestamp = currentDateTime();

    let entity = this.repository.create({
      ...payload,
      id: uuid(),
      linSumId,
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

  async updateInjection(
    testSumId: string,
    id: string,
    payload: LinearityInjectionBaseDTO,
    userId: string,
    isImport: boolean = false,
  ): Promise<LinearityInjectionRecordDTO> {
    const timestamp = currentDateTime();
    const entity = await this.repository.findOne(id);

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
      throw new InternalServerErrorException(
        `Error deleting Linearity Injection record Id [${id}]`,
        e.message,
      );
    }

    await this.testSummaryService.resetToNeedsEvaluation(
      testSumId,
      userId,
      isImport,
    );
  }
}
