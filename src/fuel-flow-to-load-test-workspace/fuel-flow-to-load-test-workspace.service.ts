import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { v4 as uuid } from 'uuid';

import {
  FuelFlowToLoadTestBaseDTO,
  FuelFlowToLoadTestDTO,
  FuelFlowToLoadTestImportDTO,
  FuelFlowToLoadTestRecordDTO,
} from '../dto/fuel-flow-to-load-test.dto';
import { FuelFlowToLoadTestMap } from '../maps/fuel-flow-to-load-test.map';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { FuelFlowToLoadTestWorkspaceRepository } from './fuel-flow-to-load-test-workspace.repository';
import { currentDateTime } from '../utilities/functions';
import { FuelFlowToLoadTestRepository } from '../fuel-flow-to-load-test/fuel-flow-to-load-test.repository';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { FuelFlowToLoadTest } from 'src/entities/fuel-flow-to-load-test.entity';
import { In } from 'typeorm';

@Injectable()
export class FuelFlowToLoadTestWorkspaceService {
  constructor(
    private readonly map: FuelFlowToLoadTestMap,
    @Inject(forwardRef(() => TestSummaryWorkspaceService))
    private readonly testSummaryService: TestSummaryWorkspaceService,
    @InjectRepository(FuelFlowToLoadTestWorkspaceRepository)
    private readonly repository: FuelFlowToLoadTestWorkspaceRepository,
    @InjectRepository(FuelFlowToLoadTestRepository)
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
    const result = await this.repository.findOne({
      id,
      testSumId,
    });

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
    const entity = await this.repository.findOne({
      id,
      testSumId,
    });

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

  async import(
    testSumId: string,
    payload: FuelFlowToLoadTestImportDTO,
    userId: string,
    isHistoricalRecord: boolean,
  ) {
    const isImport = true;
    let historicalRecord: FuelFlowToLoadTest;

    if (isHistoricalRecord) {
      historicalRecord = await this.historicalRepo.findOne({
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

    this.logger.info(
      `Fuel FLow To Load Test Successfully Imported.  Record Id: ${createdFuelFlowToLoadTest.id}`,
    );
  }
}
