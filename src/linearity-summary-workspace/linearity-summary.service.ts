import { In } from 'typeorm';
import { v4 as uuid } from 'uuid';

import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Logger } from '@us-epa-camd/easey-common/logger';

import {
  LinearitySummaryDTO,
  LinearitySummaryBaseDTO,
  LinearitySummaryRecordDTO,
  LinearitySummaryImportDTO,
} from '../dto/linearity-summary.dto';

import { currentDateTime } from '@us-epa-camd/easey-common/utilities/functions';
import { LinearitySummaryMap } from '../maps/linearity-summary.map';
import { LinearitySummaryWorkspaceRepository } from './linearity-summary.repository';
import { LinearityInjectionWorkspaceService } from '../linearity-injection-workspace/linearity-injection.service';
import { TestSummaryWorkspaceService } from './../test-summary-workspace/test-summary.service';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { LinearitySummary } from '../entities/linearity-summary.entity';
import { LinearitySummaryRepository } from '../linearity-summary/linearity-summary.repository';

@Injectable()
export class LinearitySummaryWorkspaceService {
  constructor(
    private readonly logger: Logger,
    private readonly map: LinearitySummaryMap,
    @Inject(forwardRef(() => TestSummaryWorkspaceService))
    private readonly testSummaryService: TestSummaryWorkspaceService,
    @Inject(forwardRef(() => LinearityInjectionWorkspaceService))
    private readonly injectionService: LinearityInjectionWorkspaceService,
    @InjectRepository(LinearitySummaryWorkspaceRepository)
    private readonly repository: LinearitySummaryWorkspaceRepository,
    @InjectRepository(LinearitySummaryRepository)
    private readonly historicalRepository: LinearitySummaryRepository,
  ) {}

  async getSummaryById(id: string): Promise<LinearitySummaryDTO> {
    const result = await this.repository.getSummaryById(id);

    if (!result) {
      throw new LoggingException(
        `A linearity summary record not found with Record Id [${id}].`,
        HttpStatus.NOT_FOUND,
      );
    }

    return this.map.one(result);
  }

  async getSummariesByTestSumId(
    testSumId: string,
  ): Promise<LinearitySummaryDTO[]> {
    const results = await this.repository.getSummariesByTestSumId(testSumId);
    return this.map.many(results);
  }

  async getSummariesByTestSumIds(
    testSumIds: string[],
  ): Promise<LinearitySummaryDTO[]> {
    const results = await this.repository.find({
      where: { testSumId: In(testSumIds) },
    });
    return this.map.many(results);
  }

  async export(testSumIds: string[]): Promise<LinearitySummaryDTO[]> {
    const summaries = await this.getSummariesByTestSumIds(testSumIds);

    const injections = await this.injectionService.export(
      summaries.map(i => i.id),
    );

    summaries.forEach(s => {
      s.linearityInjectionData = injections.filter(i => i.linSumId === s.id);
    });

    return summaries;
  }

  async import(
    testSumId: string,
    payload: LinearitySummaryImportDTO,
    userId: string,
    isHistoricalRecord?: boolean,
  ) {
    const isImport = true;
    const promises = [];
    let historicalRecord: LinearitySummary;

    if (isHistoricalRecord) {
      historicalRecord = await this.historicalRepository.findOne({
        testSumId: testSumId,
        gasLevelCode: payload.gasLevelCode,
      });
    }

    const createdLineSummary = await this.createSummary(
      testSumId,
      payload,
      userId,
      isImport,
      historicalRecord ? historicalRecord.id : null,
    );

    this.logger.info(
      `Linear Summary Successfully Imported. Record Id: ${createdLineSummary.id}`,
    );

    if (payload.linearityInjectionData?.length > 0) {
      for (const injection of payload.linearityInjectionData) {
        promises.push(
          this.injectionService.import(
            testSumId,
            createdLineSummary.id,
            injection,
            userId,
            isHistoricalRecord,
          ),
        );
      }
    }

    await Promise.all(promises);

    return null;
  }

  async createSummary(
    testSumId: string,
    payload: LinearitySummaryBaseDTO,
    userId: string,
    isImport: boolean = false,
    historicalRecordId?: string,
  ): Promise<LinearitySummaryRecordDTO> {
    const timestamp = currentDateTime();

    let entity = this.repository.create({
      ...payload,
      id: historicalRecordId ? historicalRecordId : uuid(),
      testSumId,
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
    const dto = await this.map.one(entity);
    delete dto.linearityInjectionData;
    return dto;
  }

  async updateSummary(
    testSumId: string,
    id: string,
    payload: LinearitySummaryBaseDTO,
    userId: string,
    isImport: boolean = false,
  ): Promise<LinearitySummaryRecordDTO> {
    const timestamp = currentDateTime();
    const entity = await this.repository.findOne(id);

    if (!entity) {
      throw new LoggingException(
        `A linearity summary record not found with Record Id [${id}].`,
        HttpStatus.NOT_FOUND,
      );
    }

    entity.meanReferenceValue = payload.meanReferenceValue;
    entity.meanMeasuredValue = payload.meanMeasuredValue;
    entity.percentError = payload.percentError;
    entity.apsIndicator = payload.apsIndicator;
    entity.gasLevelCode = payload.gasLevelCode;
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

  async deleteSummary(
    testSumId: string,
    id: string,
    userId: string,
    isImport: boolean = false,
  ): Promise<void> {
    try {
      await this.repository.delete(id);
    } catch (e) {
      throw new LoggingException(
        `Error deleting Linearity Summary record Id [${id}]`,
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
