import { In } from 'typeorm';
import { v4 as uuid } from 'uuid';

import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Logger } from '@us-epa-camd/easey-common/logger';
import { currentDateTime } from '../utilities/functions';
import {
  OnlineOfflineCalibrationDTO,
  OnlineOfflineCalibrationBaseDTO,
  OnlineOfflineCalibrationRecordDTO,
} from '../dto/online-offline-calibration.dto';
import { OnlineOfflineCalibrationWorkspaceRepository } from './online-offline-calibration.repository';
import { OnlineOfflineCalibrationMap } from '../maps/online-offline-calibration.map';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { ProtocolGasBaseDTO, ProtocolGasDTO } from '../dto/protocol-gas.dto';

@Injectable()
export class OnlineOfflineCalibrationWorkspaceService {
  constructor(
    private readonly logger: Logger,
    private readonly map: OnlineOfflineCalibrationMap,
    @InjectRepository(OnlineOfflineCalibrationWorkspaceRepository)
    private readonly repository: OnlineOfflineCalibrationWorkspaceRepository,
    @Inject(forwardRef(() => TestSummaryWorkspaceService))
    private readonly testSummaryService: TestSummaryWorkspaceService,
  ) {}

  async getOnlineOfflineCalibrations(
    testSumId: string,
  ): Promise<OnlineOfflineCalibrationDTO[]> {
    const records = await this.repository.find({
      where: { testSumId },
    });

    return this.map.many(records);
  }

  async getOnlineOfflineCalibration(
    id: string,
  ): Promise<OnlineOfflineCalibrationDTO> {
    const result = await this.repository.findOne(id);

    if (!result) {
      throw new LoggingException(
        `Online Offline Calibration record not found with Record Id [${id}].`,
        HttpStatus.NOT_FOUND,
      );
    }

    return this.map.one(result);
  }

  async createOnlineOfflineCalibration(
    testSumId: string,
    payload: OnlineOfflineCalibrationBaseDTO,
    userId: string,
    isImport: boolean = false,
    historicalRecordId?: string,
  ): Promise<OnlineOfflineCalibrationRecordDTO> {
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

    const dto = await this.map.one(entity);
    return dto;
  }

  async deleteOnlineOfflineCalibration(
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
      throw new LoggingException(
        `Error deleting Online Offline Calibration with record Id [${id}]`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  
    await this.testSummaryService.resetToNeedsEvaluation(
      testSumId,
      userId,
      isImport,
    );

  }


  async updateOnlineOfflineCalibration(
    testSumId: string,
    id: string,
    payload: OnlineOfflineCalibrationBaseDTO,
    userId: string,
    isImport: boolean = false,
  ): Promise<OnlineOfflineCalibrationDTO> {
    const timestamp = currentDateTime().toLocaleString();

    const entity = await this.getOnlineOfflineCalibration(id);

    entity.offlineUpscaleAPSIndicator = payload.offlineUpscaleAPSIndicator;
    entity.offlineZeroAPSIndicator = payload.offlineZeroAPSIndicator;
    entity.onlineUpscaleAPSIndicator = payload.onlineUpscaleAPSIndicator;
    entity.onlineZeroAPSIndicator = payload.onlineZeroAPSIndicator;
    entity.offlineUpscaleCalibrationError = payload.offlineUpscaleCalibrationError;
    entity.offlineUpscaleInjectionDate = payload.offlineUpscaleInjectionDate;
    entity.offlineUpscaleInjectionHour = payload.offlineUpscaleInjectionHour;
    entity.offlineUpscaleMeasuredValue = payload.offlineUpscaleMeasuredValue;
    entity.offlineUpscaleReferenceValue = payload.offlineUpscaleReferenceValue;
    entity.offlineZeroCalibrationError = payload.offlineZeroCalibrationError;
    entity.offlineZeroInjectionDate = payload.offlineZeroInjectionDate;
    entity.offlineZeroInjectionHour = payload.offlineZeroInjectionHour;
    entity.offlineZeroMeasuredValue = payload.offlineZeroMeasuredValue;
    entity.offlineZeroReferenceValue = payload.offlineZeroReferenceValue;
    entity.onlineUpscaleCalibrationError = payload.onlineUpscaleCalibrationError;
    entity.onlineUpscaleInjectionDate = payload.onlineUpscaleInjectionDate;
    entity.onlineUpscaleInjectionHour = payload.onlineUpscaleInjectionHour;
    entity.onlineUpscaleMeasuredValue = payload.onlineUpscaleMeasuredValue;
    entity.onlineUpscaleReferenceValue = payload.onlineUpscaleReferenceValue;
    entity.onlineZeroCalibrationError = payload.onlineZeroCalibrationError;
    entity.onlineZeroInjectionDate = payload.onlineZeroInjectionDate;
    entity.onlineZeroInjectionHour = payload.onlineZeroInjectionHour;
    entity.onlineZeroMeasuredValue = payload.onlineZeroMeasuredValue;
    entity.onlineZeroReferenceValue = payload.onlineZeroReferenceValue;
    entity.upscaleGasLevelCode = payload.upscaleGasLevelCode;

    entity.userId = userId;
    entity.updateDate = timestamp;

    await this.repository.save(entity);

    await this.testSummaryService.resetToNeedsEvaluation(
      testSumId,
      userId,
      isImport,
    );

    return this.getOnlineOfflineCalibration(id);
  }
}
