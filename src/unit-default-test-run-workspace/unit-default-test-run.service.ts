import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In } from 'typeorm';
import { v4 as uuid } from 'uuid';

import { Logger } from '@us-epa-camd/easey-common/logger';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';

import { currentDateTime } from '../utilities/functions';
import {
  UnitDefaultTestRunBaseDTO,
  UnitDefaultTestRunDTO,
  UnitDefaultTestRunImportDTO,
  UnitDefaultTestRunRecordDTO,
} from '../dto/unit-default-test-run.dto';
import { UnitDefaultTestRunMap } from '../maps/unit-default-test-run.map';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { UnitDefaultTestRunWorkspaceRepository } from './unit-default-test-run.repository';
import { UnitDefaultTestRun } from '../entities/unit-default-test-run.entity';
import { UnitDefaultTestRunRepository } from '../unit-default-test-run/unit-default-test-run.repository';

@Injectable()
export class UnitDefaultTestRunWorkspaceService {
  constructor(
    private readonly map: UnitDefaultTestRunMap,
    @Inject(forwardRef(() => TestSummaryWorkspaceService))
    private readonly testSummaryService: TestSummaryWorkspaceService,
    @InjectRepository(UnitDefaultTestRunWorkspaceRepository)
    private readonly repository: UnitDefaultTestRunWorkspaceRepository,
    @InjectRepository(UnitDefaultTestRunRepository)
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
  ): Promise<UnitDefaultTestRunRecordDTO> {
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

  async updateUnitDefaultTestRun(
    testSumId: string,
    id: string,
    payload: UnitDefaultTestRunBaseDTO,
    userId: string,
    isImport: boolean = false,
  ): Promise<UnitDefaultTestRunRecordDTO> {
    const timestamp = currentDateTime();
    const entity = await this.repository.findOne(id);

    if (!entity) {
      throw new LoggingException(
        `Unit Default Test Run record not found with Record Id [${id}].`,
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

    await this.repository.save(entity);

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
  ) {
    const isImport = true;
    let historicalRecord: UnitDefaultTestRun;

    if (isHistoricalRecord) {
      historicalRecord = await this.historicalRepository.findOne({
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
    );

    this.logger.info(
      `Unit Default Test Run successfully imported. Record Id: ${createdUnitDefaultTestRun.id}`,
    );

    return null;
  }
}
