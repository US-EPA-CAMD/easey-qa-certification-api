import { v4 as uuid } from 'uuid';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { currentDateTime } from '../utilities/functions';
import { RataBaseDTO, RataRecordDTO } from '../dto/rata.dto';
import { RataMap } from '../maps/rata.map';
import { RataWorkspaceRepository } from './rata-workspace.repository';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';

@Injectable()
export class RataWorkspaceService {
  constructor(
    private readonly map: RataMap,
    @Inject(forwardRef(() => TestSummaryWorkspaceService))
    private readonly testSummaryService: TestSummaryWorkspaceService,
    @InjectRepository(RataWorkspaceRepository)
    private readonly repository: RataWorkspaceRepository,
  ) {}

  async createRata(
    testSumId: string,
    payload: RataBaseDTO,
    userId: string,
    isImport: boolean = false,
  ): Promise<RataRecordDTO> {
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
