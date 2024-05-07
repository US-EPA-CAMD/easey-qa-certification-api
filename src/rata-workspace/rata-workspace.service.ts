import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { currentDateTime } from '@us-epa-camd/easey-common/utilities/functions';
import { In } from 'typeorm';
import { v4 as uuid } from 'uuid';

import {
  RataBaseDTO,
  RataDTO,
  RataImportDTO,
  RataRecordDTO,
} from '../dto/rata.dto';
import { Rata } from '../entities/rata.entity';
import { RataMap } from '../maps/rata.map';
import { RataSummaryWorkspaceService } from '../rata-summary-workspace/rata-summary-workspace.service';
import { RataRepository } from '../rata/rata.repository';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { RataWorkspaceRepository } from './rata-workspace.repository';

@Injectable()
export class RataWorkspaceService {
  constructor(
    private readonly logger: Logger,
    private readonly map: RataMap,
    @Inject(forwardRef(() => TestSummaryWorkspaceService))
    private readonly testSummaryService: TestSummaryWorkspaceService,
    private readonly repository: RataWorkspaceRepository,
    private readonly historicalRepository: RataRepository,
    @Inject(forwardRef(() => RataSummaryWorkspaceService))
    private readonly rataSummaryService: RataSummaryWorkspaceService,
  ) {}

  async getRataById(id: string): Promise<RataDTO> {
    const result = await this.repository.findOneBy({
      id,
    });

    if (!result) {
      throw new EaseyException(
        new Error(`A RATA record not found with Record Id [${id}].`),
        HttpStatus.NOT_FOUND,
      );
    }

    return this.map.one(result);
  }

  async getRatasByTestSumId(testSumId: string): Promise<RataDTO[]> {
    const results = await this.repository.findBy({
      testSumId,
    });
    return this.map.many(results);
  }

  async createRata(
    testSumId: string,
    payload: RataBaseDTO,
    userId: string,
    isImport: boolean = false,
    historicalRecordId?: string,
  ): Promise<RataRecordDTO> {
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
    entity = await this.repository.findOneBy({ id: entity.id });
    await this.testSummaryService.resetToNeedsEvaluation(
      testSumId,
      userId,
      isImport,
    );
    return this.map.one(entity);
  }

  async updateRata(
    testSumId: string,
    id: string,
    payload: RataBaseDTO,
    userId: string,
    isImport: boolean = false,
  ): Promise<RataRecordDTO> {
    const timestamp = currentDateTime();
    const entity = await this.repository.findOneBy({ id });

    if (!entity) {
      throw new EaseyException(
        new Error(`A RATA record not found with Record Id [${id}].`),
        HttpStatus.NOT_FOUND,
      );
    }

    entity.numberOfLoadLevels = payload.numberOfLoadLevels;
    entity.relativeAccuracy = payload.relativeAccuracy;
    entity.rataFrequencyCode = payload.rataFrequencyCode;
    entity.overallBiasAdjustmentFactor = payload.overallBiasAdjustmentFactor;
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

  async deleteRata(
    testSumId: string,
    id: string,
    userId: string,
    isImport: boolean = false,
  ): Promise<void> {
    try {
      await this.repository.delete(id);
    } catch (e) {
      throw new EaseyException(
        new Error(`Error deleting RATA with record Id [${id}]`),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    await this.testSummaryService.resetToNeedsEvaluation(
      testSumId,
      userId,
      isImport,
    );
  }

  async getRatasByTestSumIds(testSumIds: string[]): Promise<RataDTO[]> {
    const results = await this.repository.findBy({
      testSumId: In(testSumIds),
    });
    return this.map.many(results);
  }

  async import(
    testSumId: string,
    payload: RataImportDTO,
    userId: string,
    isHistoricalRecord?: boolean,
  ) {
    const isImport = true;
    const promises = [];
    let historicalRecord: Rata;

    if (isHistoricalRecord) {
      historicalRecord = await this.historicalRepository.findOneBy({
        testSumId: testSumId,
        rataFrequencyCode: payload.rataFrequencyCode,
      });
    }

    const createdRata = await this.createRata(
      testSumId,
      payload,
      userId,
      isImport,
      historicalRecord ? historicalRecord.id : null,
    );

    this.logger.log(`Rata Successfully Imported. Record Id: ${createdRata.id}`);

    if (payload.rataSummaryData?.length > 0) {
      for (const rataSummary of payload.rataSummaryData) {
        promises.push(
          this.rataSummaryService.import(
            testSumId,
            createdRata.id,
            rataSummary,
            userId,
            isHistoricalRecord,
          ),
        );
      }
    }

    await Promise.all(promises);

    return null;
  }

  async export(testSumIds: string[]): Promise<RataDTO[]> {
    const ratas = await this.getRatasByTestSumIds(testSumIds);

    const rataSummaries = await this.rataSummaryService.export(
      ratas.map(i => i.id),
    );

    ratas.forEach(s => {
      s.rataSummaryData = rataSummaries.filter(i => i.rataId === s.id);
    });

    return ratas;
  }
}
