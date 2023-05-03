import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';

import { currentDateTime } from '@us-epa-camd/easey-common/utilities/functions';
import {
  OnlineOfflineCalibrationDTO,
  OnlineOfflineCalibrationBaseDTO,
  OnlineOfflineCalibrationRecordDTO,
  OnlineOfflineCalibrationImportDTO,
} from '../dto/online-offline-calibration.dto';
import { OnlineOfflineCalibrationWorkspaceRepository } from './online-offline-calibration.repository';
import { OnlineOfflineCalibrationMap } from '../maps/online-offline-calibration.map';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { OnlineOfflineCalibration } from '../entities/online-offline-calibration.entity';
import { OnlineOfflineCalibrationRepository } from '../online-offline-calibration/online-offline-calibration.repository';

@Injectable()
export class OnlineOfflineCalibrationWorkspaceService {
  constructor(
    private readonly logger: Logger,
    private readonly map: OnlineOfflineCalibrationMap,
    @InjectRepository(OnlineOfflineCalibrationWorkspaceRepository)
    private readonly repository: OnlineOfflineCalibrationWorkspaceRepository,
    @Inject(forwardRef(() => TestSummaryWorkspaceService))
    private readonly testSummaryService: TestSummaryWorkspaceService,
    @InjectRepository(OnlineOfflineCalibrationRepository)
    private readonly historicalRepo: OnlineOfflineCalibrationRepository,
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
    const timestamp = currentDateTime();

    const entity = await this.repository.findOne(id);

    if (!entity) {
      throw new LoggingException(
        `Online Offline Calibration record not found with Record Id [${id}].`,
        HttpStatus.NOT_FOUND,
      );
    }

    entity.offlineUpscaleAPSIndicator = payload.offlineUpscaleAPSIndicator;
    entity.offlineZeroAPSIndicator = payload.offlineZeroAPSIndicator;
    entity.onlineUpscaleAPSIndicator = payload.onlineUpscaleAPSIndicator;
    entity.onlineZeroAPSIndicator = payload.onlineZeroAPSIndicator;
    entity.offlineUpscaleCalibrationError =
      payload.offlineUpscaleCalibrationError;
    entity.offlineUpscaleInjectionDate = payload.offlineUpscaleInjectionDate;
    entity.offlineUpscaleInjectionHour = payload.offlineUpscaleInjectionHour;
    entity.offlineUpscaleMeasuredValue = payload.offlineUpscaleMeasuredValue;
    entity.offlineUpscaleReferenceValue = payload.offlineUpscaleReferenceValue;
    entity.offlineZeroCalibrationError = payload.offlineZeroCalibrationError;
    entity.offlineZeroInjectionDate = payload.offlineZeroInjectionDate;
    entity.offlineZeroInjectionHour = payload.offlineZeroInjectionHour;
    entity.offlineZeroMeasuredValue = payload.offlineZeroMeasuredValue;
    entity.offlineZeroReferenceValue = payload.offlineZeroReferenceValue;
    entity.onlineUpscaleCalibrationError =
      payload.onlineUpscaleCalibrationError;
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

  async onlineOfflineCalibrationByTestSumIds(
    testSumIds: string[],
  ): Promise<OnlineOfflineCalibrationDTO[]> {
    const results = await this.repository.find({
      where: { testSumId: In(testSumIds) },
    });

    return this.map.many(results);
  }

  async import(
    testSumId: string,
    payload: OnlineOfflineCalibrationImportDTO,
    userId: string,
    isHistoricalRecord: boolean,
  ) {
    const isImport = true;
    let historicalRecord: OnlineOfflineCalibration;

    if (isHistoricalRecord) {
      historicalRecord = await this.historicalRepo.findOne({
        testSumId,
      });
    }

    const createdOnlineOfflineCalibration = await this.createOnlineOfflineCalibration(
      testSumId,
      payload,
      userId,
      isImport,
      historicalRecord ? historicalRecord.id : null,
    );

    this.logger.info(
      `Online Offline Calibration successfully imported. Record Id: ${createdOnlineOfflineCalibration.id}`,
    );
  }

  async export(
    testSumIds: string[],
  ): Promise<OnlineOfflineCalibrationRecordDTO[]> {
    return this.onlineOfflineCalibrationByTestSumIds(testSumIds);
  }
}
