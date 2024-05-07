import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { currentDateTime } from '@us-epa-camd/easey-common/utilities/functions';
import { In } from 'typeorm';
import { v4 as uuid } from 'uuid';

import {
  FlowToLoadCheckBaseDTO,
  FlowToLoadCheckDTO,
  FlowToLoadCheckImportDTO,
  FlowToLoadCheckRecordDTO,
} from '../dto/flow-to-load-check.dto';
import { FlowToLoadCheck } from '../entities/flow-to-load-check.entity';
import { FlowToLoadCheckRepository } from '../flow-to-load-check/flow-to-load-check.repository';
import { FlowToLoadCheckMap } from '../maps/flow-to-load-check.map';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { FlowToLoadCheckWorkspaceRepository } from './flow-to-load-check-workspace.repository';

@Injectable()
export class FlowToLoadCheckWorkspaceService {
  constructor(
    private readonly map: FlowToLoadCheckMap,
    @Inject(forwardRef(() => TestSummaryWorkspaceService))
    private readonly testSummaryService: TestSummaryWorkspaceService,
    private readonly repository: FlowToLoadCheckWorkspaceRepository,
    private readonly historicalRepo: FlowToLoadCheckRepository,
    private readonly logger: Logger,
  ) {}

  async getFlowToLoadChecks(
    testSumId: string,
  ): Promise<FlowToLoadCheckRecordDTO[]> {
    const records = await this.repository.find({ where: { testSumId } });

    return this.map.many(records);
  }

  async getFlowToLoadCheck(id: string): Promise<FlowToLoadCheckRecordDTO> {
    const result = await this.repository.findOneBy({ id });

    if (!result) {
      throw new EaseyException(
        new Error(
          `Flow to Load Check Workspace record not found with Record Id [${id}].`,
        ),
        HttpStatus.NOT_FOUND,
      );
    }

    return this.map.one(result);
  }

  async createFlowToLoadCheck(
    testSumId: string,
    payload: FlowToLoadCheckBaseDTO,
    userId: string,
    isImport: boolean = false,
    historicalRecordId?: string,
  ): Promise<FlowToLoadCheckRecordDTO> {
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

  async editFlowToLoadCheck(
    testSumId: string,
    id: string,
    payload: FlowToLoadCheckBaseDTO,
    userId: string,
    isImport: boolean = false,
  ): Promise<FlowToLoadCheckDTO> {
    const timestamp = currentDateTime();

    const entity = await this.repository.findOneBy({ id });

    if (!entity) {
      throw new EaseyException(
        new Error(
          `Flow to Load Check Workspace record not found with Record Id [${id}].`,
        ),
        HttpStatus.NOT_FOUND,
      );
    }

    entity.testBasisCode = payload.testBasisCode;
    entity.biasAdjustedIndicator = payload.biasAdjustedIndicator;
    entity.averageAbsolutePercentDifference =
      payload.averageAbsolutePercentDifference;
    entity.numberOfHours = payload.numberOfHours;
    entity.numberOfHoursExcludedForFuel = payload.numberOfHoursExcludedForFuel;
    entity.numberOfHoursExcludedRamping = payload.numberOfHoursExcludedRamping;
    entity.numberOfHoursExcludedBypass = payload.numberOfHoursExcludedBypass;
    entity.numberOfHoursExcludedPreRATA = payload.numberOfHoursExcludedPreRATA;
    entity.numberOfHoursExcludedTest = payload.numberOfHoursExcludedTest;
    entity.numberOfHoursExcMainBypass = payload.numberOfHoursExcludedMainBypass;
    entity.operatingLevelCode = payload.operatingLevelCode;
    entity.userId = userId;
    entity.updateDate = timestamp;

    await this.repository.save(entity);

    await this.testSummaryService.resetToNeedsEvaluation(
      testSumId,
      userId,
      isImport,
    );

    return this.getFlowToLoadCheck(id);
  }

  async deleteFlowToLoadCheck(
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
        new Error(`Error deleting Flow To Load Check record Id [${id}]`),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    await this.testSummaryService.resetToNeedsEvaluation(
      testSumId,
      userId,
      isImport,
    );
  }

  async getFlowToLoadChecksByTestSumIds(
    testSumIds: string[],
  ): Promise<FlowToLoadCheckDTO[]> {
    const results = await this.repository.find({
      where: { testSumId: In(testSumIds) },
    });
    return this.map.many(results);
  }

  async export(testSumIds: string[]): Promise<FlowToLoadCheckDTO[]> {
    return this.getFlowToLoadChecksByTestSumIds(testSumIds);
  }

  async import(
    testSumId: string,
    payload: FlowToLoadCheckImportDTO,
    userId: string,
    isHistoricalRecord: boolean,
  ) {
    const isImport = true;
    let historicalRecord: FlowToLoadCheck;

    if (isHistoricalRecord) {
      historicalRecord = await this.historicalRepo.findOneBy({
        testSumId: testSumId,
        testBasisCode: payload.testBasisCode,
      });
    }

    const createdFlowToLoadCheck = await this.createFlowToLoadCheck(
      testSumId,
      payload,
      userId,
      isImport,
      historicalRecord ? historicalRecord.id : null,
    );

    this.logger.log(
      `Flow To Load Check Successfully Imported.  Record Id: ${createdFlowToLoadCheck.id}`,
    );
  }
}
