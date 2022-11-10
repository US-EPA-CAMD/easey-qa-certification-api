import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CycleTimeSummaryMap } from '../maps/cycle-time-summary.map';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { CycleTimeSummaryWorkspaceRepository } from './cycle-time-summary-workspace.repository';
import { currentDateTime } from '../utilities/functions';
import { v4 as uuid } from 'uuid';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import {
  CycleTimeSummaryBaseDTO,
  CycleTimeSummaryDTO,
} from '../dto/cycle-time-summary.dto';

@Injectable()
export class CycleTimeSummaryWorkspaceService {
  constructor(
    private readonly map: CycleTimeSummaryMap,
    @Inject(forwardRef(() => TestSummaryWorkspaceService))
    private readonly testSummaryService: TestSummaryWorkspaceService,
    @InjectRepository(CycleTimeSummaryWorkspaceRepository)
    private readonly repository: CycleTimeSummaryWorkspaceRepository,
  ) {}

  async getCycleTimeSummaries(
    testSumId: string,
  ): Promise<CycleTimeSummaryDTO[]> {
    const records = await this.repository.find({ where: { testSumId } });

    return this.map.many(records);
  }

  async getCycleTimeSummary(
    id: string,
    testSumId: string,
  ): Promise<CycleTimeSummaryDTO> {
    const result = await this.repository.findOne({
      id,
      testSumId,
    });

    if (!result) {
      throw new LoggingException(
        `Cycle Time Summary record not found with Record Id [${id}].`,
        HttpStatus.NOT_FOUND,
      );
    }

    return this.map.one(result);
  }

  async createCycleTimeSummary(
    testSumId: string,
    payload: CycleTimeSummaryBaseDTO,
    userId: string,
    isImport: boolean = false,
    historicalRecordId?: string,
  ): Promise<CycleTimeSummaryDTO> {
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

  async updateCycleTimeSummary(
    testSumId: string,
    id: string,
    payload: CycleTimeSummaryBaseDTO,
    userId: string,
    isImport: boolean = false,
  ): Promise<CycleTimeSummaryDTO> {
    const entity = await this.repository.findOne({
      id,
      testSumId,
    });

    if (!entity) {
      throw new LoggingException(
        `Cycle Time Summary record not found with Record Id [${id}].`,
        HttpStatus.NOT_FOUND,
      );
    }

    entity.totalTime = payload.totalTime;

    await this.repository.save(entity);

    await this.testSummaryService.resetToNeedsEvaluation(
      testSumId,
      userId,
      isImport,
    );

    return this.map.one(entity);
  }

  async deleteCycleTimeSummary(
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
        `Error deleting Cycle Time Summary record [${id}]`,
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
