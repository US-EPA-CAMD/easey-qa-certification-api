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
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';

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

  async getUnitDefaultTestRuns(
    unitDefaultTestSumId: string,
  ): Promise<UnitDefaultTestRunDTO[]> {
    const records = await this.repository.find({
      where: { unitDefaultTestSumId },
    });

    return this.map.many(records);
  }

  async getUnitDefaultTestRun(
    id: string,
    unitDefaultTestSumId: string,
  ): Promise<UnitDefaultTestRunDTO> {
    const result = await this.repository.findOne({
      id,
      unitDefaultTestSumId,
    });

    if (!result) {
      throw new LoggingException(
        `Unit Default Test Run record not found with Record Id [${id}].`,
        HttpStatus.NOT_FOUND,
      );
    }

    return this.map.one(result);
  }

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

  async deleteUnitDefaultTestRun(
    testSumId: string,
    id: string,
    userId: string,
    isImport: boolean = false,
  ): Promise<void> {
    try {
      await this.repository.delete(id);
    } catch (e) {
      throw new LoggingException(
        `Error deleting Unit Default Test Run with record id [${id}]`,
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
