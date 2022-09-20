import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';

import { currentDateTime } from '../utilities/functions';
import { RataTraverseMap } from '../maps/rata-traverse.map';
import { RataTraverseBaseDTO } from '../dto/rata-traverse-data.dto';
import { RataTraverseWorkpsaceRepository } from './rata-traverse-workspace.repository';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';

@Injectable()
export class RataTraverseWorkspaceService {
  constructor(
    @InjectRepository(RataTraverseWorkpsaceRepository)
    private readonly repository: RataTraverseWorkpsaceRepository,
    private readonly map: RataTraverseMap,
    @Inject(forwardRef(() => TestSummaryWorkspaceService))
    private readonly testSummaryService: TestSummaryWorkspaceService,
  ) {}

  async createRataTraverse(
    testSumId: string,
    rataRunId: string,
    payload: RataTraverseBaseDTO,
    userId: string,
    isImport: boolean = false,
  ): Promise<RataTraverseBaseDTO> {
    const timestamp = currentDateTime();

    let entity = this.repository.create({
      ...payload,
      id: uuid(),
      flowRataRunId: rataRunId,
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
