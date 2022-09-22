import { HttpStatus, Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';

import { currentDateTime } from '../utilities/functions';
import { FlowRataRunWorkspaceRepository } from './flow-rata-run-workspace.repository';
import { FlowRataRunMap } from '../maps/flow-rata-run.map';
import {
  FlowRataRunBaseDTO,
  FlowRataRunDTO,
  FlowRataRunRecordDTO,
} from '../dto/flow-rata-run.dto';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';

@Injectable()
export class FlowRataRunWorkspaceService {
  constructor(
    @InjectRepository(FlowRataRunWorkspaceRepository)
    private readonly repository: FlowRataRunWorkspaceRepository,
    private readonly map: FlowRataRunMap,
    @Inject(forwardRef(() => TestSummaryWorkspaceService))
    private readonly testSummaryService: TestSummaryWorkspaceService,
  ) {}

  async getFlowRataRuns(rataRunId: string): Promise<FlowRataRunDTO[]> {
    const records = await this.repository.find({ where: { rataRunId } });

    return this.map.many(records);
  }

  async getFlowRataRun(id: string): Promise<FlowRataRunDTO> {
    const result = await this.repository.findOne(id);

    if (!result) {
      throw new LoggingException(
        `Flow Rata Run record not found with Record Id [${id}].`,
        HttpStatus.NOT_FOUND,
      );
    }

    return this.map.one(result);
  }

  async createFlowRataRun(
    testSumId: string,
    rataRunId: string,
    payload: FlowRataRunBaseDTO,
    userId: string,
    isImport: boolean = false,
  ): Promise<FlowRataRunRecordDTO> {
    const timestamp = currentDateTime();

    let entity = this.repository.create({
      ...payload,
      id: uuid(),
      rataRunId,
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

  async deleteFlowRataRun(
    testSumId: string,
    id: string,
    userId: string,
    isImport: boolean = false,
  ): Promise<void> {
    try {
      await this.repository.delete(id);
    } catch (e) {
      throw new LoggingException(
        `Error deleting Flow Rata Run with record Id [${id}]`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    await this.testSummaryService.resetToNeedsEvaluation(
      testSumId,
      userId,
      isImport,
    );
  }
}
