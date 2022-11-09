import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';
import { currentDateTime } from '../utilities/functions';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';

import { FuelFlowmeterAccuracyMap } from '../maps/fuel-flowmeter-accuracy.map';
import {
  FuelFlowmeterAccuracyBaseDTO,
  FuelFlowmeterAccuracyRecordDTO,
} from '../dto/fuel-flowmeter-accuracy.dto';
import { FuelFlowmeterAccuracyWorkspaceRepository } from './fuel-flowmeter-accuracy-workspace.repository';

@Injectable()
export class FuelFlowmeterAccuracyWorkspaceService {
  constructor(
    private readonly map: FuelFlowmeterAccuracyMap,
    @Inject(forwardRef(() => TestSummaryWorkspaceService))
    private readonly testSummaryService: TestSummaryWorkspaceService,
    @InjectRepository(FuelFlowmeterAccuracyWorkspaceRepository)
    private readonly repository: FuelFlowmeterAccuracyWorkspaceRepository,
  ) {}

  async createFuelFlowmeterAccuracy(
    testSumId: string,
    payload: FuelFlowmeterAccuracyBaseDTO,
    userId: string,
    isImport: boolean = false,
  ): Promise<FuelFlowmeterAccuracyRecordDTO> {
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
}
