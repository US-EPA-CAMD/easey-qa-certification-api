import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { currentDateTime } from '@us-epa-camd/easey-common/utilities/functions';
import { In } from 'typeorm';
import { v4 as uuid } from 'uuid';

import {
  FuelFlowToLoadTestBaseDTO,
  FuelFlowToLoadTestDTO,
  FuelFlowToLoadTestImportDTO,
  FuelFlowToLoadTestRecordDTO,
} from '../dto/fuel-flow-to-load-test.dto';
import { FuelFlowToLoadTest } from '../entities/fuel-flow-to-load-test.entity';
import { FuelFlowToLoadTestRepository } from '../fuel-flow-to-load-test/fuel-flow-to-load-test.repository';
import { FuelFlowToLoadTestMap } from '../maps/fuel-flow-to-load-test.map';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { FuelFlowToLoadTestWorkspaceRepository } from './fuel-flow-to-load-test-workspace.repository';

@Injectable()
export class FuelFlowToLoadTestWorkspaceService {
  constructor(
    private readonly map: FuelFlowToLoadTestMap,
    @Inject(forwardRef(() => TestSummaryWorkspaceService))
    private readonly testSummaryService: TestSummaryWorkspaceService,
    private readonly repository: FuelFlowToLoadTestWorkspaceRepository,
    private readonly historicalRepo: FuelFlowToLoadTestRepository,
    private readonly logger: Logger,
  ) {}

  async getFuelFlowToLoadTests(
    testSumId: string,
  ): Promise<FuelFlowToLoadTestRecordDTO[]> {
    const records = await this.repository.find({ where: { testSumId } });

    return this.map.many(records);
  }

  async getFuelFlowToLoadTest(
    id: string,
    testSumId: string,
  ): Promise<FuelFlowToLoadTestRecordDTO> {
    const result = await this.repository.findOneBy({
      id,
      testSumId,
    });

    if (!result) {
      throw new EaseyException(
        new Error(
          `Fuel Flow To Load Test record not found with Record Id [${id}].`,
        ),
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
    historicalRecordId?: string,
  ): Promise<FuelFlowToLoadTestRecordDTO> {
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

  async editFuelFlowToLoadTest(
    testSumId: string,
    id: string,
    payload: FuelFlowToLoadTestBaseDTO,
    userId: string,
    isImport: boolean = false,
  ) {
    const entity = await this.repository.findOneBy({
      id,
      testSumId,
    });

    if (!entity) {
      throw new EaseyException(
        new Error(
          `Fuel Flow To Load Test record not found with Record Id [${id}].`,
        ),
        HttpStatus.NOT_FOUND,
      );
    }

    entity.testBasisCode = payload.testBasisCode;
    entity.averageDifference = payload.averageDifference;
    entity.numberOfHoursUsed = payload.numberOfHoursExcludedCofiring;

    entity.numberOfHoursExcludedRamping = payload.numberOfHoursExcludedRamping;
    entity.numberOfHoursExcludedLowRange =
      payload.numberOfHoursExcludedLowRange;

    const timestamp = currentDateTime();
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

  async import(
    testSumId: string,
    payload: FuelFlowToLoadTestImportDTO,
    userId: string,
    isHistoricalRecord: boolean,
  ) {
    const isImport = true;
    let historicalRecord: FuelFlowToLoadTest;

    if (isHistoricalRecord) {
      historicalRecord = await this.historicalRepo.findOneBy({
        testSumId: testSumId,
        testBasisCode: payload.testBasisCode,
      });
    }

    const createdFuelFlowToLoadTest = await this.createFuelFlowToLoadTest(
      testSumId,
      payload,
      userId,
      isImport,
      historicalRecord ? historicalRecord.id : null,
    );

    this.logger.log(
      `Fuel FLow To Load Test Successfully Imported.  Record Id: ${createdFuelFlowToLoadTest.id}`,
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
