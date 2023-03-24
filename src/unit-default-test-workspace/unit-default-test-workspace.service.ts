import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';
import { In } from 'typeorm';

import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { Logger } from '@us-epa-camd/easey-common/logger';

import { currentDateTime } from '../utilities/functions';
import {
  UnitDefaultTestBaseDTO,
  UnitDefaultTestRecordDTO,
  UnitDefaultTestImportDTO,
  UnitDefaultTestDTO,
} from '../dto/unit-default-test.dto';
import { UnitDefaultTestMap } from '../maps/unit-default-test.map';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { UnitDefaultTestWorkspaceRepository } from './unit-default-test-workspace.repository';
import { UnitDefaultTest } from '../entities/unit-default-test.entity';
import { UnitDefaultTestRepository } from '../unit-default-test/unit-default-test.repository';
import { UnitDefaultTestRunWorkspaceService } from '../unit-default-test-run-workspace/unit-default-test-run.service';

@Injectable()
export class UnitDefaultTestWorkspaceService {
  constructor(
    private readonly map: UnitDefaultTestMap,
    @Inject(forwardRef(() => TestSummaryWorkspaceService))
    private readonly testSummaryService: TestSummaryWorkspaceService,
    @InjectRepository(UnitDefaultTestWorkspaceRepository)
    private readonly repository: UnitDefaultTestWorkspaceRepository,
    @InjectRepository(UnitDefaultTestRepository)
    private readonly historicalRepo: UnitDefaultTestRepository,
    private readonly logger: Logger,
    @Inject(forwardRef(() => UnitDefaultTestRunWorkspaceService))
    private readonly unitDefaultTestRunService: UnitDefaultTestRunWorkspaceService,
  ) {}

  async getUnitDefaultTests(
    testSumId: string,
  ): Promise<UnitDefaultTestRecordDTO[]> {
    const records = await this.repository.find({ where: { testSumId } });

    return this.map.many(records);
  }

  async getUnitDefaultTest(id: string): Promise<UnitDefaultTestRecordDTO> {
    const result = await this.repository.findOne({
      id,
    });

    if (!result) {
      throw new LoggingException(
        `Unit Default Test record not found with Record Id [${id}].`,
        HttpStatus.NOT_FOUND,
      );
    }

    return this.map.one(result);
  }

  async createUnitDefaultTest(
    testSumId: string,
    payload: UnitDefaultTestBaseDTO,
    userId: string,
    isImport: boolean = false,
    historicalRecordId?: string,
  ): Promise<UnitDefaultTestRecordDTO> {
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

  async updateUnitDefaultTest(
    testSumId: string,
    id: string,
    payload: UnitDefaultTestBaseDTO,
    userId: string,
    isImport: boolean = false,
  ): Promise<UnitDefaultTestRecordDTO> {
    const timestamp = currentDateTime().toLocaleString();

    const entity = await this.getUnitDefaultTest(id);

    entity.fuelCode = payload.fuelCode;
    entity.NOxDefaultRate = payload.NOxDefaultRate;
    entity.operatingConditionCode = payload.operatingConditionCode;
    entity.groupID = payload.groupID;
    entity.numberOfUnitsInGroup = payload.numberOfUnitsInGroup;
    entity.numberOfTestsForGroup = payload.numberOfTestsForGroup;
    entity.userId = userId;
    entity.updateDate = timestamp;

    await this.repository.save(entity);

    await this.testSummaryService.resetToNeedsEvaluation(
      testSumId,
      userId,
      isImport,
    );

    return this.getUnitDefaultTest(id);
  }

  async deleteUnitDefaultTest(
    testSumId: string,
    id: string,
    userId: string,
    isImport: boolean = false,
  ): Promise<void> {
    try {
      await this.repository.delete(id);
    } catch (e) {
      throw new LoggingException(
        `Error deleting Unit Default Test with record Id [${id}]`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    await this.testSummaryService.resetToNeedsEvaluation(
      testSumId,
      userId,
      isImport,
    );
  }

  async getUnitDefaultTestsByTestSumIds(
    testSumIds: string[],
  ): Promise<UnitDefaultTestDTO[]> {
    const results = await this.repository.find({
      where: { testSumId: In(testSumIds) },
    });

    return this.map.many(results);
  }

  async export(testSumIds: string[]): Promise<UnitDefaultTestDTO[]> {
    const unitDefaultTests = await this.getUnitDefaultTestsByTestSumIds(
      testSumIds,
    );

    const unitDefaultTestRuns = await this.unitDefaultTestRunService.export(
      unitDefaultTests.map(udtr => udtr.id),
    );

    unitDefaultTests.forEach(udt => {
      udt.unitDefaultTestRunData = unitDefaultTestRuns.filter(
        udtr => udtr.unitDefaultTestSumId === udt.id,
      );
    });
    return unitDefaultTests;
  }

  async import(
    testSumId: string,
    payload: UnitDefaultTestImportDTO,
    userId: string,
    isHistoricalRecord?: boolean,
  ) {
    const isImport = true;
    let historicalRecord: UnitDefaultTest;
    const promises = [];

    if (isHistoricalRecord) {
      historicalRecord = await this.historicalRepo.findOne({
        testSumId: testSumId,
        NOxDefaultRate: payload.NOxDefaultRate,
      });
    }

    const createdUnitDefaultTest = await this.createUnitDefaultTest(
      testSumId,
      payload,
      userId,
      isImport,
      historicalRecord ? historicalRecord.id : null,
    );

    this.logger.info(
      `Unit Default Successfully Imported.  Record Id: ${createdUnitDefaultTest.id}`,
    );

    if (payload.unitDefaultTestRunData?.length > 0) {
      for (const unitDefaultTestRun of payload.unitDefaultTestRunData) {
        promises.push(
          new Promise(async (resolve, _reject) => {
            const innerPromises = [];
            innerPromises.push(
              this.unitDefaultTestRunService.import(
                testSumId,
                createdUnitDefaultTest.id,
                unitDefaultTestRun,
                userId,
                isHistoricalRecord,
              ),
            );

            await Promise.all(innerPromises);
            resolve(true);
          }),
        );
      }
    }

    await Promise.all(promises);

    return null;
  }
}
