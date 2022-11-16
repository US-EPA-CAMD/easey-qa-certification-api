import { HttpStatus, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';
import { currentDateTime } from '../utilities/functions';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';

import {
  FuelFlowmeterAccuracyBaseDTO,
  FuelFlowmeterAccuracyDTO,
  FuelFlowmeterAccuracyRecordDTO,
} from '../dto/fuel-flowmeter-accuracy.dto';
import { FuelFlowmeterAccuracyWorkspaceRepository } from './fuel-flowmeter-accuracy-workspace.repository';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { FuelFlowmeterAccuracyMap } from '../maps/fuel-flowmeter-accuracy.map';

@Injectable()
export class FuelFlowmeterAccuracyWorkspaceService {
  constructor(
    private readonly map: FuelFlowmeterAccuracyMap,
    @Inject(forwardRef(() => TestSummaryWorkspaceService))
    private readonly testSummaryService: TestSummaryWorkspaceService,
    @InjectRepository(FuelFlowmeterAccuracyWorkspaceRepository)
    private readonly repository: FuelFlowmeterAccuracyWorkspaceRepository,
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
    const result = await this.repository.findOne(id);

    if (!result) {
      throw new LoggingException(
        `Fuel Flowmeter Accuracy record not found with Record Id [${id}].`,
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
    const timestamp = currentDateTime().toLocaleString();

    const entity = await this.getFuelFlowmeterAccuracy(id);

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
  ): Promise<FuelFlowmeterAccuracyDTO> {
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
      throw new LoggingException(
        `Error deleting Fuel Flowmeter Accuracy record Id [${id}]`,
        HttpStatus.INTERNAL_SERVER_ERROR,
        e,
      );
    }
  }
}
