import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  UnitDefaultTestBaseDTO,
  UnitDefaultTestDTO,
} from 'src/dto/unit-default-test.dto';
import { UnitDefaultTestMap } from 'src/maps/unit-default-test.map';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { UnitDefaultTestWorkspaceRepository } from './unit-default-test-workspace.repository';
import { currentDateTime } from '../utilities/functions';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UnitDefaultTestWorkspaceService {
  constructor(
    private readonly map: UnitDefaultTestMap,
    @Inject(forwardRef(() => TestSummaryWorkspaceService))
    private readonly testSummaryService: TestSummaryWorkspaceService,
    @InjectRepository(UnitDefaultTestWorkspaceRepository)
    private readonly repository: UnitDefaultTestWorkspaceRepository,
  ) {}

  async createUnitDefaultTest(
    testSumId: string,
    payload: UnitDefaultTestBaseDTO,
    userId: string,
    isImport: boolean = false,
    historicalRecordId?: string,
  ): Promise<UnitDefaultTestDTO> {
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
