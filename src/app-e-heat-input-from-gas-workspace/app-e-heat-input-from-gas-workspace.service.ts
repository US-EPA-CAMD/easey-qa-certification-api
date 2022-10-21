import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';

import { currentDateTime } from '../utilities/functions';
import { AppEHeatInputFromGasMap } from '../maps/app-e-heat-input-from-gas.map';
import { AppEHeatInputFromGasWorkspaceRepository } from './app-e-heat-input-from-gas-workspace.repository';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import {
  AppEHeatInputFromGasBaseDTO,
  AppEHeatInputFromGasRecordDTO,
} from '../dto/app-e-heat-input-from-gas.dto';
import { MonitorSystemRepository } from '../monitor-system/monitor-system.repository';

@Injectable()
export class AppEHeatInputFromGasWorkspaceService {
  constructor(
    private readonly map: AppEHeatInputFromGasMap,
    @Inject(forwardRef(() => TestSummaryWorkspaceService))
    private readonly testSummaryService: TestSummaryWorkspaceService,
    @InjectRepository(AppEHeatInputFromGasWorkspaceRepository)
    private readonly repository: AppEHeatInputFromGasWorkspaceRepository,
    @InjectRepository(MonitorSystemRepository)
    private readonly monSysRepository: MonitorSystemRepository,
  ) {}

  async getAppEHeatInputFromGases(
    appECorrTestRunId: string,
  ): Promise<AppEHeatInputFromGasRecordDTO[]> {
    const records = await this.repository.getAppEHeatInputFromGasByTestRunId(
      appECorrTestRunId,
    );

    return this.map.many(records);
  }

  async getAppEHeatInputFromGas(
    id: string,
  ): Promise<AppEHeatInputFromGasRecordDTO> {
    const result = await this.repository.getAppEHeatInputFromGasById(id);

    if (!result) {
      throw new LoggingException(
        `Appendix E Heat Input From Gas record not found with Record Id [${id}].`,
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
  ): Promise<AppEHeatInputFromGasRecordDTO> {
    const timestamp = currentDateTime();

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
      id: uuid(),
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
      throw new LoggingException(
        `Appendix E Heat Input From Gas record not found with Record Id [${id}].`,
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
}
