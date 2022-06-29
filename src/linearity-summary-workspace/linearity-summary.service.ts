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
  LinearitySummaryDTO,
  LinearitySummaryBaseDTO,
  LinearitySummaryRecordDTO,
  LinearitySummaryImportDTO,
} from '../dto/linearity-summary.dto';

import { currentDateTime } from '../utilities/functions';
import { LinearitySummaryMap } from '../maps/linearity-summary.map';
import { LinearitySummaryWorkspaceRepository } from './linearity-summary.repository';
import { LinearityInjectionWorkspaceService } from '../linearity-injection-workspace/linearity-injection.service';
import { TestSummaryWorkspaceService } from './../test-summary-workspace/test-summary.service';

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
  ) {}

  async getSummaryById(id: string): Promise<LinearitySummaryDTO> {
    const result = await this.repository.findOne(id);
    return this.map.one(result);
  }

  async getSummariesByTestSumId(
    testSumId: string,
  ): Promise<LinearitySummaryDTO[]> {
    const results = await this.repository.find({ testSumId });
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
  ) {
    const isImport = true;
    const promises = [];

    const createdLineSummary = await this.createSummary(
      testSumId,
      payload,
      userId,
      isImport,
    );

    this.logger.info(
      `Linear Summary Successfully Imported. Record Id: ${createdLineSummary.id}`,
    );

    if (
      payload.linearityInjectionData &&
      payload.linearityInjectionData.length > 0
    ) {
      for (const injection of payload.linearityInjectionData) {
        promises.push(
          new Promise(async (resolve, _reject) => {
            const innerPromises = [];
            innerPromises.push(
              this.injectionService.import(
                testSumId,
                createdLineSummary.id,
                injection,
                userId,
              ),
            );
            await Promise.all(innerPromises);
            resolve(true);
          }),
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
  ): Promise<LinearitySummaryRecordDTO> {
    const timestamp = currentDateTime();

    let entity = this.repository.create({
      ...payload,
      id: uuid(),
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
      throw new InternalServerErrorException(
        `Error deleting Linearity Summary record Id [${id}]`,
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
