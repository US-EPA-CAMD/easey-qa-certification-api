import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';
import { currentDateTime } from '../utilities/functions';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { FlowToLoadCheckMap } from '../maps/flow-to-load-check.map';
import { FlowToLoadCheckWorkspaceRepository } from './flow-to-load-check-workspace.repository';
import {
  FlowToLoadCheckBaseDTO,
  FlowToLoadCheckDTO,
  FlowToLoadCheckImportDTO,
  FlowToLoadCheckRecordDTO,
} from '../dto/flow-to-load-check.dto';
import { FlowToLoadCheck } from '../entities/flow-to-load-check.entity';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { FlowToLoadCheckRepository } from '../flow-to-load-check/flow-to-load-check.repository';
import { In } from 'typeorm';

@Injectable()
export class FlowToLoadCheckWorkspaceService {
  constructor(
    private readonly map: FlowToLoadCheckMap,
    @Inject(forwardRef(() => TestSummaryWorkspaceService))
    private readonly testSummaryService: TestSummaryWorkspaceService,
    @InjectRepository(FlowToLoadCheckWorkspaceRepository)
    private readonly repository: FlowToLoadCheckWorkspaceRepository,
    @InjectRepository(FlowToLoadCheckRepository)
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
    const result = await this.repository.findOne(id);

    if (!result) {
      throw new LoggingException(
        `Appendix E Correlation Test Summary Workspace record not found with Record Id [${id}].`,
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
    entity = await this.repository.findOne(entity.id);
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
    const timestamp = currentDateTime().toLocaleString();

    const entity = await this.getFlowToLoadCheck(id);

    entity.testBasisCode = payload.testBasisCode;
    entity.biasAdjustedIndicator = payload.biasAdjustedIndicator;
    entity.averageAbsolutePercentDifference =
      payload.averageAbsolutePercentDifference;
    entity.numberOfHours = payload.numberOfHours;
    entity.numberOfHoursExcludedForFuel = payload.numberOfHoursExcludedForFuel;
    entity.numberOfHoursExcludedForRamping =
      payload.numberOfHoursExcludedForRamping;
    entity.numberOfHoursExcludedForBypass =
      payload.numberOfHoursExcludedForBypass;
    entity.numberOfHoursExcludedPreRata = payload.numberOfHoursExcludedPreRata;
    entity.numberOfHoursExcludedTest = payload.numberOfHoursExcludedTest;
    entity.numberOfHoursExcludedForMainAndBypass =
      payload.numberOfHoursExcludedForMainAndBypass;
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
      throw new LoggingException(
        `Error deleting Flow To Load Check record Id [${id}]`,
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
}
