import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';

import { currentDateTime } from '../utilities/functions';
import {
  RataSummaryBaseDTO,
  RataSummaryDTO,
  RataSummaryRecordDTO,
} from '../dto/rata-summary.dto';
import { RataSummaryMap } from '../maps/rata-summary.map';
import { RataSummaryWorkspaceRepository } from './rata-summary-workspace.repository';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';

@Injectable()
export class RataSummaryWorkspaceService {
  constructor(
    private readonly map: RataSummaryMap,
    @Inject(forwardRef(() => TestSummaryWorkspaceService))
    private readonly testSummaryService: TestSummaryWorkspaceService,
    @InjectRepository(RataSummaryWorkspaceRepository)
    private readonly repository: RataSummaryWorkspaceRepository,
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
      throw new LoggingException(
        `Rata Summary workspace record not found with Record Id [${id}].`,
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
  ): Promise<RataSummaryRecordDTO> {
    const timestamp = currentDateTime();

    let entity = this.repository.create({
      ...payload,
      id: uuid(),
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
      throw new LoggingException(
        `A Rata Summary record not found with Record Id [${rataSumId}].`,
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
      throw new LoggingException(
        `Error deleting Rata Summary with record Id [${id}]`,
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