import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';

import { currentDateTime } from '@us-epa-camd/easey-common/utilities/functions';
import {
  RataSummaryBaseDTO,
  RataSummaryDTO,
  RataSummaryImportDTO,
  RataSummaryRecordDTO,
} from '../dto/rata-summary.dto';
import { RataSummaryMap } from '../maps/rata-summary.map';
import { RataSummaryWorkspaceRepository } from './rata-summary-workspace.repository';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { In } from 'typeorm';
import { RataRunWorkspaceService } from '../rata-run-workspace/rata-run-workspace.service';
import { RataSummary } from '../entities/rata-summary.entity';
import { RataSummaryRepository } from '../rata-summary/rata-summary.repository';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { RataWorkspaceService } from '../rata-workspace/rata-workspace.service';

@Injectable()
export class RataSummaryWorkspaceService {
  constructor(
    private readonly logger: Logger,
    private readonly map: RataSummaryMap,
    @Inject(forwardRef(() => TestSummaryWorkspaceService))
    private readonly testSummaryService: TestSummaryWorkspaceService,
    @Inject(forwardRef(() => RataWorkspaceService))
    private readonly rataService: RataWorkspaceService,
    @InjectRepository(RataSummaryWorkspaceRepository)
    private readonly repository: RataSummaryWorkspaceRepository,
    @InjectRepository(RataSummaryRepository)
    private readonly historicalRepository: RataSummaryRepository,
    @Inject(forwardRef(() => RataRunWorkspaceService))
    private readonly rataRunService: RataRunWorkspaceService,
  ) {}

  async getRataSummaries(rataId: string): Promise<RataSummaryDTO[]> {
    const records = await this.repository.find({
      rataId: rataId,
    });

    return this.map.many(records);
  }

  async getRataSummary(id: string): Promise<RataSummaryDTO> {
    const result = await this.repository.findOne(id);

    if (!result) {
      throw new EaseyException(
        new Error(
          `Rata Summary workspace record not found with Record Id [${id}].`,
        ),
        HttpStatus.NOT_FOUND,
      );
    }

    return this.map.one(result);
  }

  async createRataSummary(
    testSumId: string,
    rataId: string,
    payload: RataSummaryBaseDTO,
    userId: string,
    isImport: boolean = false,
    historicalRecordId?: string,
  ): Promise<RataSummaryRecordDTO> {
    const timestamp = currentDateTime();

    // Checks if Test Summary is valid.
    await this.testSummaryService.getTestSummaryById(testSumId);
    // Checks if RATA Test is valid.
    await this.rataService.getRataById(rataId);

    let entity = this.repository.create({
      ...payload,
      id: historicalRecordId ? historicalRecordId : uuid(),
      rataId,
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

  async updateRataSummary(
    testSumId: string,
    rataSumId: string,
    payload: RataSummaryBaseDTO,
    userId: string,
    isImport: boolean = false,
  ): Promise<RataSummaryRecordDTO> {
    const timestamp = currentDateTime();
    const record = await this.repository.findOne(rataSumId);

    if (!record) {
      throw new EaseyException(
        new Error(
          `A Rata Summary record not found with Record Id [${rataSumId}].`,
        ),
        HttpStatus.NOT_FOUND,
      );
    }

    record.operatingLevelCode = payload.operatingLevelCode;
    record.averageGrossUnitLoad = payload.averageGrossUnitLoad;
    record.referenceMethodCode = payload.referenceMethodCode;
    record.meanCEMValue = payload.meanCEMValue;
    record.meanRATAReferenceValue = payload.meanRATAReferenceValue;
    record.meanDifference = payload.meanDifference;
    record.standardDeviationDifference = payload.standardDeviationDifference;
    record.confidenceCoefficient = payload.confidenceCoefficient;
    record.tValue = payload.tValue;
    record.apsIndicator = payload.apsIndicator;
    record.apsCode = payload.apsCode;
    record.relativeAccuracy = payload.relativeAccuracy;
    record.biasAdjustmentFactor = payload.biasAdjustmentFactor;
    record.co2OrO2ReferenceMethodCode = payload.co2OrO2ReferenceMethodCode;
    record.stackDiameter = payload.stackDiameter;
    record.stackArea = payload.stackArea;
    record.numberOfTraversePoints = payload.numberOfTraversePoints;
    record.calculatedWAF = payload.calculatedWAF;
    record.defaultWAF = payload.defaultWAF;
    record.userId = userId;
    record.updateDate = timestamp;

    await this.repository.save(record);

    await this.testSummaryService.resetToNeedsEvaluation(
      testSumId,
      userId,
      isImport,
    );
    return this.map.one(record);
  }

  async deleteRataSummary(
    testSumId: string,
    id: string,
    userId: string,
    isImport: boolean = false,
  ): Promise<void> {
    try {
      await this.repository.delete(id);
    } catch (e) {
      throw new EaseyException(
        new Error(`Error deleting Rata Summary with record Id [${id}]`),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    await this.testSummaryService.resetToNeedsEvaluation(
      testSumId,
      userId,
      isImport,
    );
  }

  async getRataSummariesByRataIds(
    rataIds: string[],
  ): Promise<RataSummaryDTO[]> {
    const results = await this.repository.find({
      where: { rataId: In(rataIds) },
    });
    return this.map.many(results);
  }

  async import(
    testSumId: string,
    rataId: string,
    payload: RataSummaryImportDTO,
    userId: string,
    isHistoricalRecord?: boolean,
  ) {
    const isImport = true;
    const promises = [];
    let historicalRecord: RataSummary;

    if (isHistoricalRecord) {
      historicalRecord = await this.historicalRepository.findOne({
        rataId: rataId,
        operatingLevelCode: payload.operatingLevelCode,
      });
    }

    const createdRataSummary = await this.createRataSummary(
      testSumId,
      rataId,
      payload,
      userId,
      isImport,
      historicalRecord ? historicalRecord.id : null,
    );

    this.logger.log(
      `Rata Summary Successfully Imported. Record Id: ${createdRataSummary.id}`,
    );

    if (payload.rataRunData?.length > 0) {
      for (const rataRun of payload.rataRunData) {
        promises.push(
          this.rataRunService.import(
            testSumId,
            createdRataSummary.id,
            rataRun,
            userId,
            isHistoricalRecord,
          ),
        );
      }
    }

    await Promise.all(promises);

    return null;
  }

  async export(rataIds: string[]): Promise<RataSummaryDTO[]> {
    const rataSummaries = await this.getRataSummariesByRataIds(rataIds);

    const rataRuns = await this.rataRunService.export(
      rataSummaries.map(i => i.id),
    );

    rataSummaries.forEach(s => {
      s.rataRunData = rataRuns.filter(i => i.rataSumId === s.id);
    });

    return rataSummaries;
  }
}
