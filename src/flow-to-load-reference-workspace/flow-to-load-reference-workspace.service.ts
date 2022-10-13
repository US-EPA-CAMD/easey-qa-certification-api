import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';
import { currentDateTime } from '../utilities/functions';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { FlowToLoadReferenceMap } from '../maps/flow-to-load-reference.map';
import { FlowToLoadReferenceWorkspaceRepository } from './flow-to-load-reference-workspace.repository';
import {
  FlowToLoadReferenceBaseDTO,
  FlowToLoadReferenceDTO,
  FlowToLoadReferenceRecordDTO,
} from '../dto/flow-to-load-reference.dto';
import { In } from 'typeorm';

@Injectable()
export class FlowToLoadReferenceWorkspaceService {
  constructor(
    private readonly map: FlowToLoadReferenceMap,
    @Inject(forwardRef(() => TestSummaryWorkspaceService))
    private readonly testSummaryService: TestSummaryWorkspaceService,
    @InjectRepository(FlowToLoadReferenceWorkspaceRepository)
    private readonly repository: FlowToLoadReferenceWorkspaceRepository,
  ) {}

  async createFlowToLoadReference(
    testSumId: string,
    payload: FlowToLoadReferenceBaseDTO,
    userId: string,
    isImport: boolean = false,
  ): Promise<FlowToLoadReferenceRecordDTO> {
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

  async getFlowToLoadReferenceBySumIds(
    testSumIds: string[],
  ): Promise<FlowToLoadReferenceDTO[]> {
    const results = await this.repository.find({
      where: { testSumId: In(testSumIds) },
    });
    return this.map.many(results);
  }

  async export(testSumIds: string[]): Promise<FlowToLoadReferenceDTO[]> {
    return this.getFlowToLoadReferenceBySumIds(testSumIds);
  }
}
