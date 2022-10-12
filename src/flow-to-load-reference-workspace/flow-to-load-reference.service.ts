import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';
import { currentDateTime } from '../utilities/functions';
import {

import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { FlowToLoadReferenceWorkspaceRepository } from './flow-to-load-reference.repository';
import { FlowToLoadReferenceBaseDTO, FlowToLoadReferenceRecordDTO } from 'src/dto/flow-to-load-reference.dto';

@Injectable()
export class FlowToLoadReferenceWorkspaceService {
  constructor(
    private readonly map: AeCorrelationSummaryMap, /* ADD THE CORRECT MAP HERE: FLOW TO LOAD REFERENCE */
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
}