import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';

import { currentDateTime } from '../utilities/functions';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { RataTraverseMap } from '../maps/rata-traverse.map';
import { RataTraverseWorkspaceRepository } from './rata-traverse-workspace.repository';
import { RataTraverseBaseDTO } from '../dto/rata-traverse.dto';

@Injectable()
export class RataTraverseWorkspaceService {
  constructor(
    @InjectRepository(RataTraverseWorkspaceRepository)
    private readonly repository: RataTraverseWorkspaceRepository,
    private readonly map: RataTraverseMap,
    @Inject(forwardRef(() => TestSummaryWorkspaceService))
    private readonly testSummaryService: TestSummaryWorkspaceService,
  ) {}

  async createRataTraverse(
    testSumId: string,
    flowRataRunId: string,
    payload: RataTraverseBaseDTO,
    userId: string,
    isImport: boolean = false,
  ): Promise<RataTraverseBaseDTO> {
    const timestamp = currentDateTime();

    let entity = this.repository.create({
      ...payload,
      id: uuid(),
      flowRataRunId,
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
