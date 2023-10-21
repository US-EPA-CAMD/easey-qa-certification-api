import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FuelFlowToLoadBaselineBaseDTO,
  FuelFlowToLoadBaselineDTO,
  FuelFlowToLoadBaselineImportDTO,
  FuelFlowToLoadBaselineRecordDTO,
} from '../dto/fuel-flow-to-load-baseline.dto';
import { FuelFlowToLoadBaselineMap } from '../maps/fuel-flow-to-load-baseline.map';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { FuelFlowToLoadBaselineWorkspaceRepository } from './fuel-flow-to-load-baseline-workspace.repository';
import { v4 as uuid } from 'uuid';
import { currentDateTime } from '@us-epa-camd/easey-common/utilities/functions';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { FuelFlowToLoadBaseline } from '../entities/fuel-flow-to-load-baseline.entity';
import { FuelFlowToLoadBaselineRepository } from '../fuel-flow-to-load-baseline/fuel-flow-to-load-baseline.repository';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { In } from 'typeorm';

@Injectable()
export class FuelFlowToLoadBaselineWorkspaceService {
  constructor(
    private readonly map: FuelFlowToLoadBaselineMap,
    @Inject(forwardRef(() => TestSummaryWorkspaceService))
    private readonly testSummaryService: TestSummaryWorkspaceService,
    @InjectRepository(FuelFlowToLoadBaselineWorkspaceRepository)
    private readonly repository: FuelFlowToLoadBaselineWorkspaceRepository,
    @InjectRepository(FuelFlowToLoadBaselineRepository)
    private readonly historicalRepo: FuelFlowToLoadBaselineRepository,
    private readonly logger: Logger,
  ) {}

  async getFuelFlowToLoadBaselines(
    testSumId: string,
  ): Promise<FuelFlowToLoadBaselineDTO[]> {
    const records = await this.repository.find({ where: { testSumId } });

    return this.map.many(records);
  }

  async getFuelFlowToLoadBaseline(
    id: string,
    testSumId: string,
  ): Promise<FuelFlowToLoadBaselineDTO> {
    const result = await this.repository.findOne({
      id,
      testSumId,
    });

    if (!result) {
      throw new EaseyException(
        new Error(
          `Fuel Flow To Load Baseline record not found with Record Id [${id}].`,
        ),
        HttpStatus.NOT_FOUND,
      );
    }

    return this.map.one(result);
  }

  async createFuelFlowToLoadBaseline(
    testSumId: string,
    payload: FuelFlowToLoadBaselineBaseDTO,
    userId: string,
    isImport: boolean = false,
    historicalRecordId?: string,
  ): Promise<FuelFlowToLoadBaselineRecordDTO> {
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

  async updateFuelFlowToLoadBaseline(
    testSumId: string,
    id: string,
    payload: FuelFlowToLoadBaselineBaseDTO,
    userId: string,
    isImport: boolean = false,
  ): Promise<FuelFlowToLoadBaselineDTO> {
    const entity = await this.repository.findOne({
      id,
      testSumId,
    });

    if (!entity) {
      throw new EaseyException(
        new Error(
          `Fuel Flow To Load Baseline record not found with Record Id [${id}].`,
        ),
        HttpStatus.NOT_FOUND,
      );
    }

    entity.accuracyTestNumber = payload.accuracyTestNumber;
    entity.peiTestNumber = payload.peiTestNumber;
    entity.averageFuelFlowRate = payload.averageFuelFlowRate;
    entity.averageLoad = payload.averageLoad;
    entity.baselineFuelFlowToLoadRatio = payload.baselineFuelFlowToLoadRatio;
    entity.fuelFlowToLoadUnitsOfMeasureCode = payload.fuelFlowToLoadUnitsOfMeasureCode;
    entity.averageHourlyHeatInputRate = payload.averageHourlyHeatInputRate;
    entity.baselineGHR = payload.baselineGHR;
    entity.ghrUnitsOfMeasureCode = payload.ghrUnitsOfMeasureCode;

    entity.numberOfHoursExcludedCofiring =
      payload.numberOfHoursExcludedCofiring;
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

  async deleteFuelFlowToLoadBaseline(
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
        new Error(`Error deleting Fuel Flow To Load Baseline record [${id}]`),
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

  async import(
    testSumId: string,
    payload: FuelFlowToLoadBaselineImportDTO,
    userId: string,
    isHistoricalRecord: boolean,
  ) {
    const isImport = true;
    let historicalRecord: FuelFlowToLoadBaseline;

    if (isHistoricalRecord) {
      historicalRecord = await this.historicalRepo.findOne({
        testSumId: testSumId,
        accuracyTestNumber: payload.accuracyTestNumber,
      });
    }

    const createdFuelFlowToLoadBaseline = await this.createFuelFlowToLoadBaseline(
      testSumId,
      payload,
      userId,
      isImport,
      historicalRecord ? historicalRecord.id : null,
    );

    this.logger.log(
      `Fuel Flow To Load Baseline Successfully Imported.  Record Id: ${createdFuelFlowToLoadBaseline.id}`,
    );
  }

  async getFuelFlowToLoadBaselineByTestSumIds(
    testSumIds: string[],
  ): Promise<FuelFlowToLoadBaselineDTO[]> {
    const results = await this.repository.find({
      where: { testSumId: In(testSumIds) },
    });

    return this.map.many(results);
  }

  async export(testSumIds: string[]): Promise<FuelFlowToLoadBaselineDTO[]> {
    return this.getFuelFlowToLoadBaselineByTestSumIds(testSumIds);
  }
}
