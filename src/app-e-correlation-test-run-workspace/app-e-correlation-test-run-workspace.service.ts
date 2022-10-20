import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AppECorrelationTestRunBaseDTO,
  AppECorrelationTestRunDTO,
  AppECorrelationTestRunRecordDTO,
} from '../dto/app-e-correlation-test-run.dto';
import { AppECorrelationTestRunMap } from '../maps/app-e-correlation-test-run.map';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { AppECorrelationTestRunWorkspaceRepository } from './app-e-correlation-test-run-workspace.repository';
import { currentDateTime } from '../utilities/functions';
import { v4 as uuid } from 'uuid';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { In } from 'typeorm';
import { AppEHeatInputFromGasWorkspaceService } from '../app-e-heat-input-from-gas-workspace/app-e-heat-input-from-gas-workspace.service';
import { AppEHeatInputFromOilWorkspaceService } from '../app-e-heat-input-from-oil-workspace/app-e-heat-input-from-oil.service';

@Injectable()
export class AppECorrelationTestRunWorkspaceService {
  constructor(
    @Inject(forwardRef(() => TestSummaryWorkspaceService))
    private readonly testSummaryService: TestSummaryWorkspaceService,
    @InjectRepository(AppECorrelationTestRunWorkspaceRepository)
    private readonly repository: AppECorrelationTestRunWorkspaceRepository,
    private readonly map: AppECorrelationTestRunMap,
    @Inject(forwardRef(() => AppEHeatInputFromGasWorkspaceService))
    private readonly appEHeatInputFromGasService: AppEHeatInputFromGasWorkspaceService,
    @Inject(forwardRef(() => AppEHeatInputFromOilWorkspaceService))
    private readonly appEHeatInputFromOilService: AppEHeatInputFromOilWorkspaceService,
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
  ): Promise<AppECorrelationTestRunRecordDTO> {
    const timestamp = currentDateTime();

    let entity = this.repository.create({
      ...payload,
      id: uuid(),
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

  async getAppECorrelationTestRunsByAppECorrelationTestSumId(
    appECorrTestSumIds: string[],
  ): Promise<AppECorrelationTestRunDTO[]> {
    const results = await this.repository.find({
      where: { appECorrTestSumId: In(appECorrTestSumIds) },
    });
    return this.map.many(results);
  }

  async export(
    appECorrTestSumIds: string[],
  ): Promise<AppECorrelationTestRunDTO[]> {
    const appECorrelationTestRuns = await this.getAppECorrelationTestRunsByAppECorrelationTestSumId(
      appECorrTestSumIds,
    );

    const hIGas = await this.appEHeatInputFromGasService.export(
      appECorrelationTestRuns.map(i => i.id),
    );
    const hIOil = await this.appEHeatInputFromOilService.export(
      appECorrelationTestRuns.map(i => i.id),
    );

    appECorrelationTestRuns.forEach(s => {
      s.appEHeatInputFromGasData = hIGas.filter(
        i => i.appECorrTestRunId === s.id,
      );
      s.appEHeatInputFromOilData = hIOil.filter(
        i => i.appECorrTestRunId === s.id,
      );
    });
    return appECorrelationTestRuns;
  }
}
