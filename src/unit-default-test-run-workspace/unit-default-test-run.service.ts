import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { currentDateTime } from '@us-epa-camd/easey-common/utilities/functions';
import { EntityManager, In } from 'typeorm';
import { v4 as uuid } from 'uuid';

import {
  UnitDefaultTestRunBaseDTO,
  UnitDefaultTestRunDTO,
  UnitDefaultTestRunImportDTO,
  UnitDefaultTestRunRecordDTO,
} from '../dto/unit-default-test-run.dto';
import { UnitDefaultTestRun } from '../entities/unit-default-test-run.entity';
import { UnitDefaultTestRunMap } from '../maps/unit-default-test-run.map';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { UnitDefaultTestRunRepository } from '../unit-default-test-run/unit-default-test-run.repository';
import { UnitDefaultTestRunWorkspaceRepository } from './unit-default-test-run.repository';

@Injectable()
export class UnitDefaultTestRunWorkspaceService {
  constructor(
    private readonly map: UnitDefaultTestRunMap,
    @Inject(forwardRef(() => TestSummaryWorkspaceService))
    private readonly testSummaryService: TestSummaryWorkspaceService,
    private readonly repository: UnitDefaultTestRunWorkspaceRepository,
    private readonly historicalRepository: UnitDefaultTestRunRepository,
    private readonly logger: Logger,
  ) {}

  async getUnitDefaultTestRuns(
    unitDefaultTestSumId: string,
  ): Promise<UnitDefaultTestRunRecordDTO[]> {
    const records = await this.repository.find({
      where: { unitDefaultTestSumId },
    });

    return this.map.many(records);
  }

  async getUnitDefaultTestRun(
    id: string,
    unitDefaultTestSumId: string,
  ): Promise<UnitDefaultTestRunRecordDTO> {
    const result = await this.repository.findOneBy({
      id,
      unitDefaultTestSumId,
    });

    if (!result) {
      throw new EaseyException(
        new Error(
          `Unit Default Test Run record not found with Record Id [${id}].`,
        ),
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
    trx?: EntityManager,
  ): Promise<UnitDefaultTestRunRecordDTO> {
    const timestamp = currentDateTime();

    const repo = trx ? trx.getRepository(UnitDefaultTestRun) : this.repository;

    let entity = repo.create({
      ...payload,
      id: historicalRecordId ? historicalRecordId : uuid(),
      unitDefaultTestSumId,
      userId,
      addDate: timestamp,
      updateDate: timestamp,
    });

    await repo.save(entity);
    entity = await repo.findOneBy({ id: entity.id });

    await this.testSummaryService.resetToNeedsEvaluation(
      testSumId,
      userId,
      isImport,
      trx,
    );
    return this.map.one(entity);
  }

  async updateUnitDefaultTestRun(
    testSumId: string,
    id: string,
    payload: UnitDefaultTestRunBaseDTO,
    userId: string,
    isImport: boolean = false,
    trx?: EntityManager,
  ): Promise<UnitDefaultTestRunRecordDTO> {
    const timestamp = currentDateTime();
    const repo = trx ? trx.getRepository(UnitDefaultTestRun) : this.repository;

    const entity = await repo.findOneBy({ id });

    if (!entity) {
      throw new EaseyException(
        new Error(
          `Unit Default Test Run record not found with Record Id [${id}].`,
        ),
        HttpStatus.NOT_FOUND,
      );
    }

    entity.operatingLevelForRun = payload.operatingLevelForRun;
    entity.runNumber = payload.runNumber;
    entity.beginDate = payload.beginDate;
    entity.beginHour = payload.beginHour;
    entity.beginMinute = payload.beginMinute;
    entity.endDate = payload.endDate;
    entity.endHour = payload.endHour;
    entity.endMinute = payload.endMinute;
    entity.responseTime = payload.responseTime;
    entity.referenceValue = payload.referenceValue;
    entity.runUsedIndicator = payload.runUsedIndicator;
    entity.userId = userId;
    entity.updateDate = timestamp;

    await repo.save(entity);

    await this.testSummaryService.resetToNeedsEvaluation(
      testSumId,
      userId,
      isImport,
      trx,
    );

    return this.map.one(entity);
  }

  async deleteUnitDefaultTestRun(
    testSumId: string,
    id: string,
    userId: string,
    isImport: boolean = false,
    trx?: EntityManager,
  ): Promise<void> {
    try {
      const repo = trx ? trx.getRepository(UnitDefaultTestRun) : this.repository;
      await repo.delete({ id });
    } catch (e) {
      throw new EaseyException(
        new Error(
          `Error deleting Unit Default Test Run with record id [${id}]`,
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    await this.testSummaryService.resetToNeedsEvaluation(
      testSumId,
      userId,
      isImport,
      trx,
    );
  }

  async getUnitDefaultTestRunByUnitDefaultTestSumIds(
    unitDefaultTestSumIds: string[],
  ): Promise<UnitDefaultTestRunDTO[]> {
    const results = await this.repository.find({
      where: { unitDefaultTestSumId: In(unitDefaultTestSumIds) },
    });
    return this.map.many(results);
  }

  async export(
    unitDefaultTestSumIds: string[],
  ): Promise<UnitDefaultTestRunDTO[]> {
    return this.getUnitDefaultTestRunByUnitDefaultTestSumIds(
      unitDefaultTestSumIds,
    );
  }

  async import(
    testSumId: string,
    unitDefaultTestSumId: string,
    payload: UnitDefaultTestRunImportDTO,
    userId: string,
    isHistoricalRecord?: boolean,
    trx?: EntityManager,
  ) {
    const isImport = true;
    let historicalRecord: UnitDefaultTestRun;

    if (isHistoricalRecord) {
      historicalRecord = await this.historicalRepository.findOneBy({
        unitDefaultTestSumId,
        operatingLevelForRun: payload.operatingLevelForRun,
        runNumber: payload.runNumber,
      });
    }

    const createdUnitDefaultTestRun = await this.createUnitDefaultTestRun(
      testSumId,
      unitDefaultTestSumId,
      payload,
      userId,
      isImport,
      historicalRecord ? historicalRecord.id : null,
      trx,
    );

    this.logger.log(
      `Unit Default Test Run successfully imported. Record Id: ${createdUnitDefaultTestRun.id}`,
    );

    return null;
  }
}
