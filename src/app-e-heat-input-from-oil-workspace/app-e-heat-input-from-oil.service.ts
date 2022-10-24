import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { AppEHeatInputFromOilWorkspaceRepository } from './app-e-heat-input-from-oil.repository';
import { AppEHeatInputFromOilRepository } from '../app-e-heat-input-from-oil/app-e-heat-input-from-oil.repository';
import { AppEHeatInputFromOilMap } from '../maps/app-e-heat-input-from-oil.map';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { currentDateTime } from '../utilities/functions';
import { v4 as uuid } from 'uuid';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import {
  AppEHeatInputFromOilDTO,
  AppEHeatInputFromOilBaseDTO,
  AppEHeatInputFromOilImportDTO,
  AppEHeatInputFromOilRecordDTO,
} from '../dto/app-e-heat-input-from-oil.dto';
import { AppEHeatInputFromOil } from '../entities/app-e-heat-input-from-oil.entity';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { MonitorSystemRepository } from '../monitor-system/monitor-system.repository';

@Injectable()
export class AppEHeatInputFromOilWorkspaceService {
  constructor(
    private readonly logger: Logger,
    @InjectRepository(AppEHeatInputFromOilWorkspaceRepository)
    private readonly repository: AppEHeatInputFromOilWorkspaceRepository,
    @InjectRepository(AppEHeatInputFromOilRepository)
    private readonly historicalRepo,
    private readonly map: AppEHeatInputFromOilMap,
    @Inject(forwardRef(() => TestSummaryWorkspaceService))
    private readonly testSummaryService: TestSummaryWorkspaceService,
    @InjectRepository(MonitorSystemRepository)
    private readonly monSysRepository: MonitorSystemRepository,
  ) {}

  async getAppEHeatInputFromOilRecords(
    appECorrTestRunId: string,
  ): Promise<AppEHeatInputFromOilRecordDTO[]> {
    const records = await this.repository.getAppEHeatInputFromOilsByTestRunId(
      appECorrTestRunId,
    );

    return this.map.many(records);
  }

  async getAppEHeatInputFromOilRecord(
    id: string,
  ): Promise<AppEHeatInputFromOilRecordDTO> {
    const result = await this.repository.getAppEHeatInputFromOilById(id);

    if (!result) {
      throw new LoggingException(
        `Appendix E Heat Input from Oil record not found with Record Id [${id}].`,
        HttpStatus.NOT_FOUND,
      );
    }

    return this.map.one(result);
  }

  async createAppEHeatInputFromOilRecord(
    locationId: string,
    testSumId: string,
    appECorrTestRunId: string,
    payload: AppEHeatInputFromOilBaseDTO,
    userId: string,
    isImport: boolean = false,
    historicalRecordId?: string,
  ): Promise<AppEHeatInputFromOilRecordDTO> {
    const timestamp = currentDateTime().toLocaleDateString();

    const system = await this.monSysRepository.findOne({
      locationId: locationId,
      monitoringSystemID: payload.monitoringSystemID,
    });

    if (!system) {
      throw new LoggingException(
        `Monitor System Identifier is invalid for this location [${locationId}].`,
        HttpStatus.BAD_REQUEST,
      );
    }

    let entity = this.repository.create({
      id: historicalRecordId ? historicalRecordId : uuid(),
      monitoringSystemId: system.id,
      oilMass: payload.oilMass,
      oilGCV: payload.oilGCV,
      oilGCVUnitsOfMeasureCode: payload.oilGCVUnitsOfMeasureCode,
      oilHeatInput: payload.oilHeatInput,
      oilVolume: payload.oilVolume,
      oilVolumeUnitsOfMeasureCode: payload.oilVolumeUnitsOfMeasureCode,
      oilDensity: payload.oilDensity,
      oilDensityUnitsOfMeasureCode: payload.oilDensityUnitsOfMeasureCode,
      appECorrTestRunId,
      userId,
      addDate: timestamp,
      updateDate: timestamp,
    });

    await this.repository.save(entity);
    entity = await this.repository.getAppEHeatInputFromOilById(entity.id);
    await this.testSummaryService.resetToNeedsEvaluation(
      testSumId,
      userId,
      isImport,
    );
    return this.map.one(entity);
  }

  async updateAppEHeatInputFromOilRecord(
    testSumId: string,
    id: string,
    payload: AppEHeatInputFromOilBaseDTO,
    userId: string,
    isImport: boolean = false,
  ): Promise<AppEHeatInputFromOilRecordDTO> {
    const timestamp = currentDateTime().toLocaleString();

    const entity = await this.repository.getAppEHeatInputFromOilById(id);

    if (!entity) {
      throw new LoggingException(
        `Appendix E Heat Input From Oil record not found with Record Id [${id}].`,
        HttpStatus.NOT_FOUND,
      );
    }

    entity.oilMass = payload.oilMass;
    entity.oilHeatInput = payload.oilHeatInput;
    entity.oilGCV = payload.oilGCV;
    entity.oilGCVUnitsOfMeasureCode = payload.oilGCVUnitsOfMeasureCode;
    entity.oilVolume = payload.oilVolume;
    entity.oilVolumeUnitsOfMeasureCode = payload.oilVolumeUnitsOfMeasureCode;
    entity.oilDensity = payload.oilDensity;
    entity.oilDensityUnitsOfMeasureCode = payload.oilDensityUnitsOfMeasureCode;

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

  async deleteAppEHeatInputFromOil(
    testSumId: string,
    id: string,
    userId: string,
    isImport: boolean = false,
  ): Promise<void> {
    try {
      await this.repository.delete({ id });
    } catch (e) {
      throw new LoggingException(
        `Error deleting Appendix E Heat Input From Gas record Id [${id}]`,
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
    locationId: string,
    testSumId: string,
    appECorrTestRunId: string,
    payload: AppEHeatInputFromOilImportDTO,
    userId: string,
    isHistoricalRecord: boolean,
  ) {
    const isImport = true;
    let historicalRecord: AppEHeatInputFromOil;

    if (isHistoricalRecord) {
      historicalRecord = await this.historicalRepo.findOne({
        appECorrTestRunId: appECorrTestRunId,
        monitoringSystemID: payload.monitoringSystemID,
      });
    }

    const createdHeatInputFromOil = await this.createAppEHeatInputFromOilRecord(
      locationId,
      testSumId,
      appECorrTestRunId,
      payload,
      userId,
      isImport,
      isHistoricalRecord ? historicalRecord.id : null,
    );

    this.logger.info(
      `Appendix E Heat Input from Oil Successfully Imported.  Record Id: ${createdHeatInputFromOil.id}`,
    );
  }

  async getAppEHeatInputFromOilRecordsByTestRunIds(
    appECorrTestRunIds: string[],
  ): Promise<AppEHeatInputFromOilDTO[]> {
    const results = await this.repository.getAppEHeatInputFromOilsByTestRunIds(
      appECorrTestRunIds,
    );
    return this.map.many(results);
  }

  async export(
    appECorrTestRunIds: string[],
  ): Promise<AppEHeatInputFromOilDTO[]> {
    return this.getAppEHeatInputFromOilRecordsByTestRunIds(appECorrTestRunIds);
  }
}
