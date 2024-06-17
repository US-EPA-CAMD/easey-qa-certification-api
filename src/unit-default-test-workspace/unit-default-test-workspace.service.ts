import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { currentDateTime } from '@us-epa-camd/easey-common/utilities/functions';
import { In, IsNull } from 'typeorm';
import { v4 as uuid } from 'uuid';

import {
  UnitDefaultTestBaseDTO,
  UnitDefaultTestDTO,
  UnitDefaultTestImportDTO,
  UnitDefaultTestRecordDTO,
} from '../dto/unit-default-test.dto';
import { UnitDefaultTest } from '../entities/unit-default-test.entity';
import { UnitDefaultTestMap } from '../maps/unit-default-test.map';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { UnitDefaultTestRunWorkspaceService } from '../unit-default-test-run-workspace/unit-default-test-run.service';
import { UnitDefaultTestRepository } from '../unit-default-test/unit-default-test.repository';
import { UnitDefaultTestWorkspaceRepository } from './unit-default-test-workspace.repository';

@Injectable()
export class UnitDefaultTestWorkspaceService {
  constructor(
    private readonly map: UnitDefaultTestMap,
    @Inject(forwardRef(() => TestSummaryWorkspaceService))
    private readonly testSummaryService: TestSummaryWorkspaceService,
    private readonly repository: UnitDefaultTestWorkspaceRepository,
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
    const result = await this.repository.findOneBy({
      id,
    });

    if (!result) {
      throw new EaseyException(
        new Error(`Unit Default Test record not found with Record Id [${id}].`),
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
    entity = await this.repository.findOneBy({ id: entity.id });
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
    const timestamp = currentDateTime();

    const entity = await this.repository.findOneBy({
      id,
    });

    if (!entity) {
      throw new EaseyException(
        new Error(`Unit Default Test record not found with Record Id [${id}].`),
        HttpStatus.NOT_FOUND,
      );
    }

    entity.fuelCode = payload.fuelCode;
    entity.noxDefaultRate = payload.noxDefaultRate;
    entity.operatingConditionCode = payload.operatingConditionCode;
    entity.groupId = payload.groupId;
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
      throw new EaseyException(
        new Error(`Error deleting Unit Default Test with record Id [${id}]`),
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
      historicalRecord = await this.historicalRepo.findOneBy({
        testSumId: testSumId,
        noxDefaultRate: payload.noxDefaultRate ?? IsNull(),
      });
    }

    const createdUnitDefaultTest = await this.createUnitDefaultTest(
      testSumId,
      payload,
      userId,
      isImport,
      historicalRecord ? historicalRecord.id : null,
    );

    this.logger.log(
      `Unit Default Successfully Imported.  Record Id: ${createdUnitDefaultTest.id}`,
    );

    if (payload.unitDefaultTestRunData?.length > 0) {
      for (const unitDefaultTestRun of payload.unitDefaultTestRunData) {
        promises.push(
          this.unitDefaultTestRunService.import(
            testSumId,
            createdUnitDefaultTest.id,
            unitDefaultTestRun,
            userId,
            isHistoricalRecord,
          ),
        );
      }
    }

    await Promise.all(promises);

    return null;
  }
}
