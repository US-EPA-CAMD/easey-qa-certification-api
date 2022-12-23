import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { currentDateTime } from '../utilities/functions';
import { v4 as uuid } from 'uuid';
import { HgInjectionBaseDTO, HgInjectionDTO } from 'src/dto/hg-injection.dto';
import { HgInjectionWorkspaceRepository } from './hg-injection-workspace.repository';
import { HgInjectionMap } from 'src/maps/hg-injection.map';

@Injectable()
export class HgInjectionWorkspaceService {
  constructor(
    private readonly map: HgInjectionMap,
    @Inject(forwardRef(() => TestSummaryWorkspaceService))
    private readonly testSummaryService: TestSummaryWorkspaceService,
    @InjectRepository(HgInjectionWorkspaceRepository)
    private readonly repository: HgInjectionWorkspaceRepository,
  ) {}

  async createHgInjection(
    testSumId: string,
    payload: HgInjectionBaseDTO,
    userId: string,
    isImport: boolean = false,
    historicalRecordId?: string,
  ): Promise<HgInjectionDTO> {
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
}
