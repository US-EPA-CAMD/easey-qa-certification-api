import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';

import { Logger } from '@us-epa-camd/easey-common/logger';

import { currentDateTime } from '../utilities/functions';
import {
  UnitDefaultTestRunBaseDTO,
  UnitDefaultTestRunDTO,
} from '../dto/unit-default-test-run.dto';
import { UnitDefaultTestRunMap } from '../maps/unit-default-test-run.map';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { UnitDefaultTestRunWorkspaceRepository } from './unit-default-test-run.repository';

@Injectable()
export class UnitDefaultTestRunWorkspaceService {
  constructor(
    private readonly map: UnitDefaultTestRunMap,
    @Inject(forwardRef(() => TestSummaryWorkspaceService))
    private readonly testSummaryService: TestSummaryWorkspaceService,
    @InjectRepository(UnitDefaultTestRunWorkspaceRepository)
    private readonly repository: UnitDefaultTestRunWorkspaceRepository,
    private readonly logger: Logger,
  ) {}

  async createUnitDefaultTestRun(
    testSumId: string,
    unitDefaultTestSumId: string,
    payload: UnitDefaultTestRunBaseDTO,
    userId: string,
    isImport: boolean = false,
    historicalRecordId?: string,
  ): Promise<UnitDefaultTestRunDTO> {
    const timestamp = currentDateTime();

    let entity = this.repository.create({
      ...payload,
      id: historicalRecordId ? historicalRecordId : uuid(),
      unitDefaultTestSumId,
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