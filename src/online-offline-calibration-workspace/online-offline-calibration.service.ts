import {forwardRef, HttpStatus, Inject, Injectable} from '@nestjs/common';
import {EaseyException} from '@us-epa-camd/easey-common/exceptions';
import {Logger} from '@us-epa-camd/easey-common/logger';
import {currentDateTime} from '@us-epa-camd/easey-common/utilities/functions';
import {EntityManager, In} from 'typeorm';
import {v4 as uuid} from 'uuid';

import {
  OnlineOfflineCalibrationBaseDTO,
  OnlineOfflineCalibrationDTO,
  OnlineOfflineCalibrationImportDTO,
  OnlineOfflineCalibrationRecordDTO,
} from '../dto/online-offline-calibration.dto';
import {OnlineOfflineCalibration} from '../entities/online-offline-calibration.entity';
import {OnlineOfflineCalibrationMap} from '../maps/online-offline-calibration.map';
import {OnlineOfflineCalibrationRepository} from '../online-offline-calibration/online-offline-calibration.repository';
import {TestSummaryWorkspaceService} from '../test-summary-workspace/test-summary.service';
import {OnlineOfflineCalibrationWorkspaceRepository} from './online-offline-calibration.repository';

@Injectable()
export class OnlineOfflineCalibrationWorkspaceService {
  constructor(
    private readonly logger: Logger,
    private readonly map: OnlineOfflineCalibrationMap,
    private readonly repository: OnlineOfflineCalibrationWorkspaceRepository,
    @Inject(forwardRef(() => TestSummaryWorkspaceService))
    private readonly testSummaryService: TestSummaryWorkspaceService,
    private readonly historicalRepo: OnlineOfflineCalibrationRepository,
  ) {
  }

  async getOnlineOfflineCalibrations(
    testSumId: string,
  ): Promise<OnlineOfflineCalibrationDTO[]> {
    const records = await this.repository.find({
      where: {testSumId},
    });

    return this.map.many(records);
  }

  async getOnlineOfflineCalibration(
    id: string,
  ): Promise<OnlineOfflineCalibrationDTO> {
    const result = await this.repository.findOneBy({id});

    if (!result) {
      throw new EaseyException(
        new Error(
          `Online Offline Calibration record not found with Record Id [${id}].`,
        ),
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
    trx?: EntityManager,
  ): Promise<OnlineOfflineCalibrationRecordDTO> {
    const timestamp = currentDateTime();
    const repository = trx ? trx.getRepository(OnlineOfflineCalibration) : this.repository;

    let entity = repository.create({
      ...payload,
      id: historicalRecordId ? historicalRecordId : uuid(),
      testSumId,
      userId,
      addDate: timestamp,
      updateDate: timestamp,
    });

    await repository.save(entity);
    entity = await repository.findOneBy({id: entity.id});
    await this.testSummaryService.resetToNeedsEvaluation(
      testSumId,
      userId,
      isImport,
      trx,
    );

    const dto = await this.map.one(entity);
    return dto;
  }

  async deleteOnlineOfflineCalibration(
    testSumId: string,
    id: string,
    userId: string,
    isImport: boolean = false,
    trx?: EntityManager,
  ): Promise<void> {
    try {
      const repository = trx ? trx.getRepository(OnlineOfflineCalibration) : this.repository;
      await repository.delete({
        id,
        testSumId,
      });
    } catch (e) {
      throw new EaseyException(
        new Error(
          `Error deleting Online Offline Calibration with record Id [${id}]`,
        ),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    await this.testSummaryService.resetToNeedsEvaluation(
      testSumId,
      userId,
      isImport,
      trx,
    );
  }

  async updateOnlineOfflineCalibration(
    testSumId: string,
    id: string,
    payload: OnlineOfflineCalibrationBaseDTO,
    userId: string,
    isImport: boolean = false,
    trx?: EntityManager,
  ): Promise<OnlineOfflineCalibrationDTO> {
    const timestamp = currentDateTime();
    const repository = trx ? trx.getRepository(OnlineOfflineCalibration) : this.repository;

    const entity = await repository.findOneBy({id});

    if (!entity) {
      throw new EaseyException(
        new Error(
          `Online Offline Calibration record not found with Record Id [${id}].`,
        ),
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

    await repository.save(entity);

    await this.testSummaryService.resetToNeedsEvaluation(
      testSumId,
      userId,
      isImport,
      trx,
    );

    return this.getOnlineOfflineCalibration(id);
  }

  async onlineOfflineCalibrationByTestSumIds(
    testSumIds: string[],
  ): Promise<OnlineOfflineCalibrationDTO[]> {
    const results = await this.repository.find({
      where: {testSumId: In(testSumIds)},
    });

    return this.map.many(results);
  }

  async import(
    testSumId: string,
    payload: OnlineOfflineCalibrationImportDTO,
    userId: string,
    isHistoricalRecord: boolean,
    trx?: EntityManager,
  ) {
    const isImport = true;
    let historicalRecord: OnlineOfflineCalibration;

    if (isHistoricalRecord) {
      historicalRecord = await this.historicalRepo.findOneBy({
        testSumId,
      });
    }

    const createdOnlineOfflineCalibration = await this.createOnlineOfflineCalibration(
      testSumId,
      payload,
      userId,
      isImport,
      historicalRecord ? historicalRecord.id : null,
      trx,
    );

    this.logger.log(
      `Online Offline Calibration successfully imported. Record Id: ${createdOnlineOfflineCalibration.id}`,
    );
  }

  async export(
    testSumIds: string[],
  ): Promise<OnlineOfflineCalibrationRecordDTO[]> {
    return this.onlineOfflineCalibrationByTestSumIds(testSumIds);
  }
}
