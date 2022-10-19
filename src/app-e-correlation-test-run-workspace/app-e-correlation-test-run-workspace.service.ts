import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AppECorrelationTestRunBaseDTO,
  AppECorrelationTestRunRecordDTO,
} from '../dto/app-e-correlation-test-run.dto';
import { AppECorrelationTestRunMap } from '../maps/app-e-correlation-test-run.map';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { AppEHeatInputFromGasWorkspaceService } from '../app-e-heat-input-from-gas-workspace/app-e-heat-input-from-gas-workspace.service';
import { AppEHeatInputFromOilWorkspaceService } from '../app-e-heat-input-from-oil-workspace/app-e-heat-input-from-oil.service';
import { AppECorrelationTestRunWorkspaceRepository } from './app-e-correlation-test-run-workspace.repository';
import { AppECorrelationTestRunRepository } from '../app-e-correlation-test-run/app-e-correlation-test-run.repository';
import { currentDateTime } from '../utilities/functions';
import { v4 as uuid } from 'uuid';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { AppECorrelationTestRunImportDTO } from '../dto/app-e-correlation-test-run.dto';
import { AppECorrelationTestRun } from '../entities/app-e-correlation-test-run.entity';
import { Logger } from '@us-epa-camd/easey-common/logger';

@Injectable()
export class AppECorrelationTestRunWorkspaceService {
  constructor(
    private readonly logger: Logger,
    private readonly map: AppECorrelationTestRunMap,
    @Inject(forwardRef(() => TestSummaryWorkspaceService))
    private readonly testSummaryService: TestSummaryWorkspaceService,
    @Inject(forwardRef(() => AppEHeatInputFromGasWorkspaceService))
    private readonly appEHeatInputFromGasService,
    @Inject(forwardRef(() => AppEHeatInputFromOilWorkspaceService))
    private readonly appEHeatInputFromOilService,
    @InjectRepository(AppECorrelationTestRunWorkspaceRepository)
    private readonly repository: AppECorrelationTestRunWorkspaceRepository,
    @InjectRepository(AppECorrelationTestRunRepository)
    private readonly historicalRepo,
  ) {}

  async getAppECorrelationTestRuns(
    appECorrTestSumId: string,
  ): Promise<AppECorrelationTestRunBaseDTO[]> {
    const records = await this.repository.find({
      where: { appECorrTestSumId },
    });

    return this.map.many(records);
  }

  async getAppECorrelationTestRun(
    id: string,
  ): Promise<AppECorrelationTestRunBaseDTO> {
    const result = await this.repository.findOne(id);

    if (!result) {
      throw new LoggingException(
        `Appendix E Correlation Test Run record not found with Record Id [${id}].`,
        HttpStatus.NOT_FOUND,
      );
    }

    return this.map.one(result);
  }

  async createAppECorrelationTestRun(
    testSumId: string,
    appECorrTestSumId: string,
    payload: AppECorrelationTestRunBaseDTO,
    userId: string,
    isImport: boolean = false,
    historicalId: string,
  ): Promise<AppECorrelationTestRunRecordDTO> {
    const timestamp = currentDateTime();

    let entity = this.repository.create({
      ...payload,
      id: historicalId ? historicalId : uuid(),
      appECorrTestSumId,
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

  async updateAppECorrelationTestRun(
    testSumId: string,
    appECorrTestSumId: string,
    id: string,
    payload: AppECorrelationTestRunBaseDTO,
    userId: string,
    isImport: boolean = false,
  ): Promise<AppECorrelationTestRunRecordDTO> {
    const timestamp = currentDateTime();
    const entity = await this.repository.findOne({
      id,
      appECorrTestSumId,
    });

    if (!entity) {
      throw new LoggingException(
        `Appendix E Correlation Test Run record not found with Record Id [${id}].`,
        HttpStatus.NOT_FOUND,
      );
    }

    entity.referenceValue = payload.referenceValue;
    entity.hourlyHeatInputRate = payload.hourlyHeatInputRate;
    entity.totalHeatInput = payload.totalHeatInput;
    entity.responseTime = payload.responseTime;

    entity.beginDate = payload.beginDate;
    entity.beginHour = payload.beginHour;
    entity.beginMinute = payload.beginMinute;

    entity.endDate = payload.endDate;
    entity.endHour = payload.endHour;
    entity.endMinute = payload.endMinute;

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

  async deleteAppECorrelationTestRun(
    testSumId: string,
    appECorrTestSumId: string,
    id: string,
    userId: string,
    isImport: boolean = false,
  ): Promise<void> {
    try {
      await this.repository.delete({ id, appECorrTestSumId });
    } catch (e) {
      throw new LoggingException(
        `Error deleting Appendix E Correlation Test Run record Id [${id}]`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    await this.testSummaryService.resetToNeedsEvaluation(
      testSumId,
      userId,
      isImport,
    );
  }

  async import(
    testSumId: string,
    appECorrTestSumId: string,
    payload: AppECorrelationTestRunImportDTO,
    userId: string,
    isHistoricalRecord?: boolean,
  ) {
    const isImport = true;
    const promises = [];
    let historicalRecord: AppECorrelationTestRun;

    if (isHistoricalRecord) {
      historicalRecord = await this.historicalRepo.findOne({
        appECorrTestSumId: appECorrTestSumId,
        runNumber: payload.runNumber,
      });
    }

    const createdTestRun = await this.createAppECorrelationTestRun(
      testSumId,
      appECorrTestSumId,
      payload,
      userId,
      isImport,
      historicalRecord ? historicalRecord.id : null,
    );

    this.logger.info(
      `Appendix E Correlation Test Run Successfully Imported. Record Id: ${createdTestRun.id}`,
    );

    if (payload.appEHeatInputFromGasData?.length > 0) {
      for (const appEHeatInputFromGas of payload.appEHeatInputFromGasData) {
        promises.push(
          new Promise(async (resolve, _reject) => {
            const innerPromises = [];
            innerPromises.push(
              this.appEHeatInputFromGasService.import(
                testSumId,
                createdTestRun.id,
                appEHeatInputFromGas,
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

    if (payload.appEHeatInputFromOilData?.length > 0) {
      for (const appEHeatInputFromOil of payload.appEHeatInputFromOilData) {
        promises.push(
          new Promise(async (resolve, _reject) => {
            const innerPromises = [];
            innerPromises.push(
              this.appEHeatInputFromOilService.import(
                testSumId,
                createdTestRun.id,
                appEHeatInputFromOil,
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
