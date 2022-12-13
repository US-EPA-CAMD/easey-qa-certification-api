import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  UnitDefaultTestBaseDTO,
  UnitDefaultTestDTO,
  UnitDefaultTestImportDTO,
} from '../dto/unit-default-test.dto';
import { UnitDefaultTestMap } from '../maps/unit-default-test.map';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { UnitDefaultTestWorkspaceRepository } from './unit-default-test-workspace.repository';
import { currentDateTime } from '../utilities/functions';
import { v4 as uuid } from 'uuid';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { In } from 'typeorm';
import { UnitDefaultTest } from '../entities/unit-default-test.entity';
import { UnitDefaultTestRepository } from '../unit-default-test/unit-default-test.repository';
import { Logger } from '@us-epa-camd/easey-common/logger';

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
  ) {}

  async getUnitDefaultTests(testSumId: string): Promise<UnitDefaultTestDTO[]> {
    const records = await this.repository.find({ where: { testSumId } });

    return this.map.many(records);
  }

  async getUnitDefaultTest(
    id: string,
    testSumId: string,
  ): Promise<UnitDefaultTestDTO> {
    const result = await this.repository.findOne({
      id,
      testSumId,
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
    return this.getUnitDefaultTestsByTestSumIds(testSumIds);
  }

  async import(
    testSumId: string,
    payload: UnitDefaultTestImportDTO,
    userId: string,
    isHistoricalRecord: boolean,
  ) {
    const isImport = true;
    let historicalRecord: UnitDefaultTest;

    if (isHistoricalRecord) {
      historicalRecord = await this.historicalRepo.findOne({
        testSumId: testSumId,
        NOxDefaultRate: payload.NOxDefaultRate,
      });
    }

    const createdFlowToLoadReference = await this.createUnitDefaultTest(
      testSumId,
      payload,
      userId,
      isImport,
      historicalRecord ? historicalRecord.id : null,
    );

    this.logger.info(
      `Flow To Load Reference Successfully Imported.  Record Id: ${createdFlowToLoadReference.id}`,
    );

    return null;
  }
}
