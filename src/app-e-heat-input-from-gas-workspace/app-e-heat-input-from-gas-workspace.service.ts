import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';

import { currentDateTime } from '@us-epa-camd/easey-common/utilities/functions';
import { AppEHeatInputFromGasMap } from '../maps/app-e-heat-input-from-gas.map';
import { AppEHeatInputFromGasRepository } from '../app-e-heat-input-from-gas/app-e-heat-input-from-gas.repository';
import { AppEHeatInputFromGasWorkspaceRepository } from './app-e-heat-input-from-gas-workspace.repository';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import {
  AppEHeatInputFromGasBaseDTO,
  AppEHeatInputFromGasImportDTO,
  AppEHeatInputFromGasDTO,
  AppEHeatInputFromGasRecordDTO,
} from '../dto/app-e-heat-input-from-gas.dto';
import { AppEHeatInputFromGas } from '../entities/app-e-heat-input-from-gas.entity';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { MonitorSystemWorkspaceRepository } from '../monitor-system-workspace/monitor-system-workspace.repository';

@Injectable()
export class AppEHeatInputFromGasWorkspaceService {
  constructor(
    private readonly logger: Logger,
    private readonly map: AppEHeatInputFromGasMap,
    @Inject(forwardRef(() => TestSummaryWorkspaceService))
    private readonly testSummaryService: TestSummaryWorkspaceService,
    @InjectRepository(AppEHeatInputFromGasWorkspaceRepository)
    private readonly repository: AppEHeatInputFromGasWorkspaceRepository,
    @InjectRepository(AppEHeatInputFromGasRepository)
    private readonly historicalRepo,
    @InjectRepository(MonitorSystemWorkspaceRepository)
    private readonly monSysWorkspaceRepository: MonitorSystemWorkspaceRepository,
  ) {}

  async getAppEHeatInputFromGases(
    appECorrTestRunId: string,
  ): Promise<AppEHeatInputFromGasRecordDTO[]> {
    const records = await this.repository.getAppEHeatInputFromGasesByTestRunId(
      appECorrTestRunId,
    );

    return this.map.many(records);
  }

  async getAppEHeatInputFromGas(
    id: string,
  ): Promise<AppEHeatInputFromGasRecordDTO> {
    const result = await this.repository.getAppEHeatInputFromGasById(id);

    if (!result) {
      throw new EaseyException(
        new Error(
          `Appendix E Heat Input From Gas record not found with Record Id [${id}].`,
        ),
        HttpStatus.NOT_FOUND,
      );
    }

    return this.map.one(result);
  }

  async createAppEHeatInputFromGas(
    locationId: string,
    testSumId: string,
    appECorrTestRunId: string,
    payload: AppEHeatInputFromGasBaseDTO,
    userId: string,
    isImport: boolean = false,
    historicalRecordId?: string,
  ): Promise<AppEHeatInputFromGasRecordDTO> {
    const timestamp = currentDateTime();

    const system = await this.monSysWorkspaceRepository.findOne({
      locationId: locationId,
      monitoringSystemID: payload.monitoringSystemId,
    });

    if (!system) {
      throw new EaseyException(
        new Error(
          `Monitor System Identifier is invalid for this location [${locationId}].`,
        ),
        HttpStatus.BAD_REQUEST,
      );
    }

    let entity = this.repository.create({
      id: historicalRecordId ? historicalRecordId : uuid(),
      appECorrTestRunId,
      monitoringSystemId: system.id,
      gasVolume: payload.gasVolume,
      gasGCV: payload.gasGCV,
      gasHeatInput: payload.gasHeatInput,
      userId,
      addDate: timestamp,
      updateDate: timestamp,
    });

    await this.repository.save(entity);

    entity = await this.repository.getAppEHeatInputFromGasById(entity.id);

    await this.testSummaryService.resetToNeedsEvaluation(
      testSumId,
      userId,
      isImport,
    );

    return this.map.one(entity);
  }

  async updateAppEHeatInputFromGas(
    testSumId: string,
    id: string,
    payload: AppEHeatInputFromGasBaseDTO,
    userId: string,
    isImport: boolean = false,
  ): Promise<AppEHeatInputFromGasRecordDTO> {
    const timestamp = currentDateTime();

    const entity = await this.repository.getAppEHeatInputFromGasById(id);

    if (!entity) {
      throw new EaseyException(
        new Error(
          `Appendix E Heat Input From Gas record not found with Record Id [${id}].`,
        ),
        HttpStatus.NOT_FOUND,
      );
    }

    entity.gasVolume = payload.gasVolume;
    entity.gasGCV = payload.gasGCV;
    entity.gasHeatInput = payload.gasHeatInput;
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

  async deleteAppEHeatInputFromGas(
    testSumId: string,
    id: string,
    userId: string,
    isImport: boolean = false,
  ): Promise<void> {
    try {
      await this.repository.delete({ id });
    } catch (e) {
      throw new EaseyException(
        new Error(
          `Error deleting Appendix E Heat Input From Gas record Id [${id}]`,
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

  async import(
    locationId: string,
    testSumId: string,
    appECorrTestRunId: string,
    payload: AppEHeatInputFromGasImportDTO,
    userId: string,
    isHistoricalRecord: boolean,
  ) {
    const isImport = true;
    let historicalRecord: AppEHeatInputFromGas;

    if (isHistoricalRecord) {
      historicalRecord = await this.historicalRepo.getAppEHeatInputFromGasByTestRunIdAndMonSysID(
        appECorrTestRunId,
        payload.monitoringSystemId,
      );
    }

    const createdHeatInputFromGas = await this.createAppEHeatInputFromGas(
      locationId,
      testSumId,
      appECorrTestRunId,
      payload,
      userId,
      isImport,
      isHistoricalRecord ? historicalRecord.id : null,
    );

    this.logger.log(
      `Appendix E Heat Input from Gas Successfully Imported.  Record Id: ${createdHeatInputFromGas.id}`,
    );
  }

  async getAppEHeatInputFromGasByTestRunIds(
    appECorrTestRunId: string[],
  ): Promise<AppEHeatInputFromGasDTO[]> {
    const results = await this.repository.getAppEHeatInputFromGasesByTestRunIds(
      appECorrTestRunId,
    );
    return this.map.many(results);
  }

  async export(
    appECorrTestRunId: string[],
  ): Promise<AppEHeatInputFromGasDTO[]> {
    return this.getAppEHeatInputFromGasByTestRunIds(appECorrTestRunId);
  }
}
