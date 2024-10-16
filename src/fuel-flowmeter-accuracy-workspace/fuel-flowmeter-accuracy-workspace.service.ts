import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { currentDateTime } from '@us-epa-camd/easey-common/utilities/functions';
import { In, IsNull } from 'typeorm';
import { v4 as uuid } from 'uuid';

import {
  FuelFlowmeterAccuracyBaseDTO,
  FuelFlowmeterAccuracyDTO,
  FuelFlowmeterAccuracyImportDTO,
  FuelFlowmeterAccuracyRecordDTO,
} from '../dto/fuel-flowmeter-accuracy.dto';
import { FuelFlowmeterAccuracy } from '../entities/fuel-flowmeter-accuracy.entity';
import { FuelFlowmeterAccuracyRepository } from '../fuel-flowmeter-accuracy/fuel-flowmeter-accuracy.repository';
import { FuelFlowmeterAccuracyMap } from '../maps/fuel-flowmeter-accuracy.map';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { FuelFlowmeterAccuracyWorkspaceRepository } from './fuel-flowmeter-accuracy-workspace.repository';

@Injectable()
export class FuelFlowmeterAccuracyWorkspaceService {
  constructor(
    private readonly map: FuelFlowmeterAccuracyMap,
    @Inject(forwardRef(() => TestSummaryWorkspaceService))
    private readonly testSummaryService: TestSummaryWorkspaceService,
    private readonly repository: FuelFlowmeterAccuracyWorkspaceRepository,
    private readonly historicalRepo: FuelFlowmeterAccuracyRepository,
    private readonly logger: Logger,
  ) {}

  async getFuelFlowmeterAccuracies(
    testSumId: string,
  ): Promise<FuelFlowmeterAccuracyRecordDTO[]> {
    const records = await this.repository.find({ where: { testSumId } });

    return this.map.many(records);
  }

  async getFuelFlowmeterAccuracy(
    id: string,
  ): Promise<FuelFlowmeterAccuracyRecordDTO> {
    const result = await this.repository.findOneBy({ id });

    if (!result) {
      throw new EaseyException(
        new Error(
          `Fuel Flowmeter Accuracy record not found with Record Id [${id}].`,
        ),
        HttpStatus.NOT_FOUND,
      );
    }

    return this.map.one(result);
  }

  async editFuelFlowmeterAccuracy(
    testSumId: string,
    id: string,
    payload: FuelFlowmeterAccuracyBaseDTO,
    userId: string,
    isImport: boolean = false,
  ): Promise<FuelFlowmeterAccuracyDTO> {
    const timestamp = currentDateTime();

    const entity = await this.repository.findOneBy({ id });

    if (!entity) {
      throw new EaseyException(
        new Error(
          `Fuel Flowmeter Accuracy record not found with Record Id [${id}].`,
        ),
        HttpStatus.NOT_FOUND,
      );
    }

    entity.accuracyTestMethodCode = payload.accuracyTestMethodCode;
    entity.reinstallationDate = payload.reinstallationDate;
    entity.reinstallationHour = payload.reinstallationHour;
    entity.lowFuelAccuracy = payload.lowFuelAccuracy;
    entity.midFuelAccuracy = payload.midFuelAccuracy;
    entity.highFuelAccuracy = payload.highFuelAccuracy;
    entity.userId = userId;
    entity.updateDate = timestamp;

    await this.repository.save(entity);

    await this.testSummaryService.resetToNeedsEvaluation(
      testSumId,
      userId,
      isImport,
    );

    return this.getFuelFlowmeterAccuracy(id);
  }

  async createFuelFlowmeterAccuracy(
    testSumId: string,
    payload: FuelFlowmeterAccuracyBaseDTO,
    userId: string,
    isImport: boolean = false,
    historicalRecordId?: string,
  ): Promise<FuelFlowmeterAccuracyDTO> {
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

  async deleteFuelFlowmeterAccuracy(
    testSumId: string,
    id: string,
    userId: string,
    isImport: boolean = false,
  ): Promise<void> {
    try {
      await this.repository.delete({
        id,
        testSumId,
      });
    } catch (e) {
      throw new EaseyException(
        new Error(`Error deleting Fuel Flowmeter Accuracy record Id [${id}]`),
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

  async getFuelFlowmeterAccuraciesByTestSumIds(
    testSumIds: string[],
  ): Promise<FuelFlowmeterAccuracyDTO[]> {
    const results = await this.repository.find({
      where: { testSumId: In(testSumIds) },
    });

    return this.map.many(results);
  }

  async export(testSumIds: string[]): Promise<FuelFlowmeterAccuracyDTO[]> {
    return this.getFuelFlowmeterAccuraciesByTestSumIds(testSumIds);
  }

  async import(
    testSumId: string,
    payload: FuelFlowmeterAccuracyImportDTO,
    userId: string,
    isHistoricalRecord: boolean,
  ) {
    const isImport = true;
    let historicalRecord: FuelFlowmeterAccuracy;

    if (isHistoricalRecord) {
      historicalRecord = await this.historicalRepo.findOneBy({
        testSumId: testSumId,
        accuracyTestMethodCode: payload.accuracyTestMethodCode ?? IsNull(),
      });
    }

    const createdFlowToLoadReference = await this.createFuelFlowmeterAccuracy(
      testSumId,
      payload,
      userId,
      isImport,
      historicalRecord ? historicalRecord.id : null,
    );

    this.logger.log(
      `Fuel to Flowmeter Accuracy Successfully Imported.  Record Id: ${createdFlowToLoadReference.id}`,
    );
  }
}
