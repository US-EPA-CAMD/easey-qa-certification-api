import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { currentDateTime } from '@us-epa-camd/easey-common/utilities/functions';
import { In } from 'typeorm';
import { v4 as uuid } from 'uuid';

import { AppECorrelationTestRunWorkspaceService } from '../app-e-correlation-test-run-workspace/app-e-correlation-test-run-workspace.service';
import { AppendixETestSummaryRepository } from '../app-e-correlation-test-summary/app-e-correlation-test-summary.repository';
import {
  AppECorrelationTestSummaryBaseDTO,
  AppECorrelationTestSummaryDTO,
  AppECorrelationTestSummaryImportDTO,
  AppECorrelationTestSummaryRecordDTO,
} from '../dto/app-e-correlation-test-summary.dto';
import { AppECorrelationTestSummary } from '../entities/app-e-correlation-test-summary.entity';
import { AppECorrelationTestSummaryMap } from '../maps/app-e-correlation-summary.map';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { AppendixETestSummaryWorkspaceRepository } from './app-e-correlation-test-summary-workspace.repository';

@Injectable()
export class AppECorrelationTestSummaryWorkspaceService {
  constructor(
    @Inject(forwardRef(() => TestSummaryWorkspaceService))
    private readonly testSummaryService: TestSummaryWorkspaceService,
    private readonly repository: AppendixETestSummaryWorkspaceRepository,
    private readonly map: AppECorrelationTestSummaryMap,
    @Inject(forwardRef(() => AppECorrelationTestRunWorkspaceService))
    private readonly appECorrelationTestRunService: AppECorrelationTestRunWorkspaceService,
    private readonly historicalRepo: AppendixETestSummaryRepository,
    @Inject(forwardRef(() => AppECorrelationTestRunWorkspaceService))
    private readonly appECorrTestRunService: AppECorrelationTestRunWorkspaceService,
    private readonly logger: Logger,
  ) {}

  async getAppECorrelations(
    testSumId: string,
  ): Promise<AppECorrelationTestSummaryRecordDTO[]> {
    const records = await this.repository.find({ where: { testSumId } });

    return this.map.many(records);
  }

  async getAppECorrelation(
    id: string,
  ): Promise<AppECorrelationTestSummaryRecordDTO> {
    const result = await this.repository.findOneBy({ id });

    if (!result) {
      throw new EaseyException(
        new Error(
          `Appendix E Correlation Test Summary Workspace record not found with Record Id [${id}].`,
        ),
        HttpStatus.NOT_FOUND,
      );
    }

    return this.map.one(result);
  }

  async createAppECorrelation(
    testSumId: string,
    payload: AppECorrelationTestSummaryBaseDTO,
    userId: string,
    isImport: boolean = false,
    historicalRecordId?: string,
  ): Promise<AppECorrelationTestSummaryRecordDTO> {
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
    const dto = await this.map.one(entity);
    delete dto.appendixECorrelationTestRunData;
    return dto;
  }

  async editAppECorrelation(
    testSumId: string,
    id: string,
    payload: AppECorrelationTestSummaryBaseDTO,
    userId: string,
    isImport: boolean = false,
  ): Promise<AppECorrelationTestSummaryRecordDTO> {
    const timestamp = currentDateTime();

    const entity = await this.repository.findOneBy({ id });

    if (!entity) {
      throw new EaseyException(
        new Error(
          `Appendix E Correlation Test Summary Workspace record not found with Record Id [${id}].`,
        ),
        HttpStatus.NOT_FOUND,
      );
    }

    entity.operatingLevelForRun = payload.operatingLevelForRun;
    entity.meanReferenceValue = payload.meanReferenceValue;
    entity.averageHourlyHeatInputRate = payload.averageHourlyHeatInputRate;
    entity.fFactor = payload.fFactor;
    entity.userId = userId;
    entity.updateDate = timestamp;

    await this.repository.save(entity);

    await this.testSummaryService.resetToNeedsEvaluation(
      testSumId,
      userId,
      isImport,
    );

    return this.getAppECorrelation(id);
  }

  async import(
    locationId: string,
    testSumId: string,
    payload: AppECorrelationTestSummaryImportDTO,
    userId: string,
    isHistoricalRecord: boolean,
  ) {
    const isImport = true;
    const promises = [];
    let historicalRecord: AppECorrelationTestSummary;

    if (isHistoricalRecord) {
      historicalRecord = await this.historicalRepo.findOneBy({
        testSumId: testSumId,
        operatingLevelForRun: payload.operatingLevelForRun,
      });
    }

    const createdAppECorrelation = await this.createAppECorrelation(
      testSumId,
      payload,
      userId,
      isImport,
      historicalRecord ? historicalRecord.id : null,
    );

    this.logger.log(
      `Appendix E Correlation Test Summary Successfully Imported.  Record Id: ${createdAppECorrelation.id}`,
    );

    if (payload.appendixECorrelationTestRunData?.length > 0) {
      for (const testRun of payload.appendixECorrelationTestRunData) {
        promises.push(
          this.appECorrTestRunService.import(
            locationId,
            testSumId,
            createdAppECorrelation.id,
            testRun,
            userId,
            isHistoricalRecord,
          ),
        );
      }
    }

    await Promise.all(promises);
  }

  async deleteAppECorrelation(
    testSumId: string,
    id: string,
    userId: string,
    isImport: boolean = false,
  ): Promise<void> {
    try {
      await this.repository.delete({
        id,
        testSumId,
      });
    } catch (e) {
      throw new EaseyException(
        new Error(
          `Error deleting Appendix E Correlation Test Summary with record Id [${id}]`,
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    await this.testSummaryService.resetToNeedsEvaluation(
      testSumId,
      userId,
      isImport,
    );
  }

  async getAppECorrelationsByTestSumIds(
    testSumIds: string[],
  ): Promise<AppECorrelationTestSummaryDTO[]> {
    const results = await this.repository.find({
      where: { testSumId: In(testSumIds) },
    });
    return this.map.many(results);
  }

  async export(testSumIds: string[]): Promise<AppECorrelationTestSummaryDTO[]> {
    const appECorrelationTests = await this.getAppECorrelationsByTestSumIds(
      testSumIds,
    );

    const testRuns = await this.appECorrelationTestRunService.export(
      appECorrelationTests.map(i => i.id),
    );

    appECorrelationTests.forEach(s => {
      s.appendixECorrelationTestRunData = testRuns.filter(
        i => i.appECorrTestSumId === s.id,
      );
    });
    return appECorrelationTests;
  }
}
