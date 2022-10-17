import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { v4 as uuid } from 'uuid';

import {
  FuelFlowToLoadTestBaseDTO,
  FuelFlowToLoadTestDTO,
  FuelFlowToLoadTestRecordDTO,
} from '../dto/fuel-flow-to-load-test.dto';
import { FuelFlowToLoadTestMap } from '../maps/fuel-flow-to-load-test.map';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { FuelFlowToLoadTestWorkspaceRepository } from './fuel-flow-to-load-test-workspace.repository';
import { currentDateTime } from '../utilities/functions';
import { In } from 'typeorm';

@Injectable()
export class FuelFlowToLoadTestWorkspaceService {
  constructor(
    private readonly map: FuelFlowToLoadTestMap,
    @Inject(forwardRef(() => TestSummaryWorkspaceService))
    private readonly testSummaryService: TestSummaryWorkspaceService,
    @InjectRepository(FuelFlowToLoadTestWorkspaceRepository)
    private readonly repository: FuelFlowToLoadTestWorkspaceRepository,
  ) {}

  async getFuelFlowToLoadTests(
    testSumId: string,
  ): Promise<FuelFlowToLoadTestRecordDTO[]> {
    const records = await this.repository.find({ where: { testSumId } });

    return this.map.many(records);
  }

  async getFuelFlowToLoadTest(
    id: string,
  ): Promise<FuelFlowToLoadTestRecordDTO> {
    const result = await this.repository.findOne(id);

    if (!result) {
      throw new LoggingException(
        `Fuel Flow To Load Test record not found with Record Id [${id}].`,
        HttpStatus.NOT_FOUND,
      );
    }

    return this.map.one(result);
  }

  async createFuelFlowToLoadTest(
    testSumId: string,
    payload: FuelFlowToLoadTestBaseDTO,
    userId: string,
    isImport: boolean = false,
  ): Promise<FuelFlowToLoadTestRecordDTO> {
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

  async editFuelFlowToLoadTest(
    testSumId: string,
    id: string,
    payload: FuelFlowToLoadTestBaseDTO,
    userId: string,
    isImport: boolean = false,
  ) {
    const entity = await this.repository.findOne(id);

    entity.testBasisCode = payload.testBasisCode;
    entity.averageDifference = payload.averageDifference;
    entity.numberOfHoursUsed = payload.numberOfHoursExcludedCofiring;

    entity.numberOfHoursExcludedRamping = payload.numberOfHoursExcludedRamping;
    entity.numberOfHoursExcludedLowRange =
      payload.numberOfHoursExcludedLowRange;

    await this.repository.save(entity);

    await this.testSummaryService.resetToNeedsEvaluation(
      testSumId,
      userId,
      isImport,
    );

    return this.getFuelFlowToLoadTest(id);
  }

  async deleteFuelFlowToLoadTest(
    testSumId: string,
    id: string,
    userId: string,
    isImport: boolean = false,
  ): Promise<void> {
    await this.repository.delete(id);

    await this.testSummaryService.resetToNeedsEvaluation(
      testSumId,
      userId,
      isImport,
    );
  }

  async getFuelFlowToLoadTestBySumIds(
    testSumIds: string[],
  ): Promise<FuelFlowToLoadTestDTO[]> {
    const results = await this.repository.find({
      where: { testSumId: In(testSumIds) },
    });

    return this.map.many(results);
  }

  async export(testSumIds: string[]): Promise<FuelFlowToLoadTestDTO[]> {
    return this.getFuelFlowToLoadTestBySumIds(testSumIds);
  }
}
