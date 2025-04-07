import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { currentDateTime } from '@us-epa-camd/easey-common/utilities/functions';
import { EntityManager, In } from 'typeorm';
import { settlePromises } from '../utilities/constants';
import { v4 as uuid } from 'uuid';

import {
  LinearitySummaryBaseDTO,
  LinearitySummaryDTO,
  LinearitySummaryImportDTO,
  LinearitySummaryRecordDTO,
} from '../dto/linearity-summary.dto';
import { LinearitySummary } from '../entities/linearity-summary.entity';
import { LinearityInjectionWorkspaceService } from '../linearity-injection-workspace/linearity-injection.service';
import { LinearitySummaryRepository } from '../linearity-summary/linearity-summary.repository';
import { LinearitySummaryMap } from '../maps/linearity-summary.map';
import { TestSummaryWorkspaceService } from './../test-summary-workspace/test-summary.service';
import { LinearitySummaryWorkspaceRepository } from './linearity-summary.repository';

@Injectable()
export class LinearitySummaryWorkspaceService {
  constructor(
      private readonly logger: Logger,
      private readonly map: LinearitySummaryMap,
      @Inject(forwardRef(() => TestSummaryWorkspaceService))
      private readonly testSummaryService: TestSummaryWorkspaceService,
      @Inject(forwardRef(() => LinearityInjectionWorkspaceService))
      private readonly injectionService: LinearityInjectionWorkspaceService,
      private readonly repository: LinearitySummaryWorkspaceRepository,
      private readonly historicalRepository: LinearitySummaryRepository,
  ) {}

  async getSummaryById(id: string): Promise<LinearitySummaryDTO> {
    const result = await this.repository.getSummaryById(id);

    if (!result) {
      throw new EaseyException(
          new Error(
              `A linearity summary record not found with Record Id [${id}].`,
          ),
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
      trx?: EntityManager,
  ) {
    const isImport = true;
    const promises = [];
    let historicalRecord: LinearitySummary;

    if (isHistoricalRecord) {
      historicalRecord = await this.historicalRepository.findOneBy({
        testSumId: testSumId,
        gasLevelCode: payload.gasLevelCode,
      });
    }

    // Make sure we're passing the historicalRecordId correctly
    const historicalRecordId = historicalRecord ? historicalRecord.id : null;

    // Create the linearity summary with transaction
    const createdLineSummary = await this.createSummary(
        testSumId,
        payload,
        userId,
        isImport,
      historicalRecordId,
        trx,
    );

    this.logger.log(
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
                trx,
            ),
        );
      }
    }

    // Use Promise.allSettled to handle errors properly
    const results = await Promise.allSettled(promises);
    const errors: Error[] = [];

    // Process the results
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        const error = result.reason;
        if (this.logger) {
          this.logger.error(`Error in promise at index ${index}: ${error.message}`);
        }
        errors.push(error);
      }
    });

    // If there were errors, log a summary
    if (errors.length > 0 && this.logger) {
      this.logger.error(`${errors.length} errors occurred while processing promises`);
    }

    // Always rethrow errors in import to ensure they propagate
    if (errors.length > 0) {
      throw errors[0];
    }

    return null;
  }

  async createSummary(
      testSumId: string,
      payload: LinearitySummaryBaseDTO,
      userId: string,
      isImport: boolean = false,
      historicalRecordId?: string,
      trx?: EntityManager,
  ): Promise<LinearitySummaryRecordDTO> {
    const timestamp = currentDateTime();

    // Use the transaction entity manager if provided
    const repo = trx ? trx.getRepository(this.repository.target) : this.repository;

    let entity = repo.create({
      ...payload,
      id: historicalRecordId ? historicalRecordId : uuid(),
      testSumId,
      userId,
      addDate: timestamp,
      updateDate: timestamp,
    });

    await repo.save(entity);
    entity = await repo.findOneBy({ id: entity.id });
    await this.testSummaryService.resetToNeedsEvaluation(
        testSumId,
        userId,
        isImport,
        trx,
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
      trx?: EntityManager,
  ): Promise<LinearitySummaryRecordDTO> {
    const timestamp = currentDateTime();
    // Use the transaction entity manager if provided
    const repo = trx ? trx.getRepository(this.repository.target) : this.repository;

    const entity = await repo.findOneBy({ id });

    if (!entity) {
      throw new EaseyException(
          new Error(
              `A linearity summary record not found with Record Id [${id}].`,
          ),
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

    await repo.save(entity);

    await this.testSummaryService.resetToNeedsEvaluation(
        testSumId,
        userId,
        isImport,
        trx,
    );
    return this.map.one(entity);
  }

  async deleteSummary(
      testSumId: string,
      id: string,
      userId: string,
      isImport: boolean = false,
      trx?: EntityManager,
  ): Promise<void> {
    try {
      // Use the transaction entity manager if provided
      const repo = trx ? trx.getRepository(this.repository.target) : this.repository;
      await repo.delete(id);
    } catch (e) {
      throw new EaseyException(
          new Error(`Error deleting Linearity Summary record Id [${id}]`),
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
}
