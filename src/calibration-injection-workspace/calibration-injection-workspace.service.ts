import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { currentDateTime } from '@us-epa-camd/easey-common/utilities/functions';
import { In, IsNull } from 'typeorm';
import { v4 as uuid } from 'uuid';

import { CalibrationInjectionRepository } from '../calibration-injection/calibration-injection.repository';
import {
  CalibrationInjectionBaseDTO,
  CalibrationInjectionDTO,
  CalibrationInjectionImportDTO,
} from '../dto/calibration-injection.dto';
import { CalibrationInjection } from '../entities/calibration-injection.entity';
import { CalibrationInjectionMap } from '../maps/calibration-injection.map';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { CalibrationInjectionWorkspaceRepository } from './calibration-injection-workspace.repository';

@Injectable()
export class CalibrationInjectionWorkspaceService {
  constructor(
    private readonly logger: Logger,
    private readonly map: CalibrationInjectionMap,
    @Inject(forwardRef(() => TestSummaryWorkspaceService))
    private readonly testSummaryService: TestSummaryWorkspaceService,
    private readonly repository: CalibrationInjectionWorkspaceRepository,
    private readonly historicalRepository: CalibrationInjectionRepository,
  ) {}

  async getCalibrationInjections(
    testSumId: string,
  ): Promise<CalibrationInjectionDTO[]> {
    const records = await this.repository.find({ where: { testSumId } });

    return this.map.many(records);
  }

  async getCalibrationInjection(
    id: string,
    testSumId: string,
  ): Promise<CalibrationInjectionDTO> {
    const result = await this.repository.findOneBy({
      id,
      testSumId,
    });

    if (!result) {
      throw new EaseyException(
        new Error(
          `Calibration Injection record not found with Record Id [${id}].`,
        ),
        HttpStatus.NOT_FOUND,
      );
    }

    return this.map.one(result);
  }

  async createCalibrationInjection(
    testSumId: string,
    payload: CalibrationInjectionBaseDTO,
    userId: string,
    isImport: boolean = false,
    historicalRecordId?: string,
  ): Promise<CalibrationInjectionDTO> {
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
    return this.map.one(entity);
  }

  async updateCalibrationInjection(
    testSumId: string,
    id: string,
    payload: CalibrationInjectionBaseDTO,
    userId: string,
    isImport: boolean = false,
  ): Promise<CalibrationInjectionDTO> {
    const entity = await this.repository.findOneBy({
      id,
      testSumId,
    });

    if (!entity) {
      throw new EaseyException(
        new Error(
          `Calibration Injection record not found with Record Id [${id}].`,
        ),
        HttpStatus.NOT_FOUND,
      );
    }

    entity.onlineOfflineIndicator = payload.onlineOfflineIndicator;
    entity.upscaleGasLevelCode = payload.upscaleGasLevelCode;
    entity.zeroInjectionDate = payload.zeroInjectionDate;
    entity.zeroInjectionHour = payload.zeroInjectionHour;
    entity.zeroInjectionMinute = payload.zeroInjectionMinute;
    entity.upscaleInjectionDate = payload.upscaleInjectionDate;
    entity.upscaleInjectionHour = payload.upscaleInjectionHour;
    entity.upscaleInjectionMinute = payload.upscaleInjectionMinute;
    entity.zeroMeasuredValue = payload.zeroMeasuredValue;
    entity.upscaleMeasuredValue = payload.upscaleMeasuredValue;
    entity.zeroAPSIndicator = payload.zeroAPSIndicator;
    entity.upscaleAPSIndicator = payload.upscaleAPSIndicator;
    entity.zeroCalibrationError = payload.zeroCalibrationError;
    entity.upscaleCalibrationError = payload.upscaleCalibrationError;
    entity.zeroReferenceValue = payload.zeroReferenceValue;
    entity.upscaleReferenceValue = payload.upscaleReferenceValue;

    const timestamp = currentDateTime();
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

  async deleteCalibrationInjection(
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
        new Error(`Error deleting Calibration Injection record [${id}]`),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    await this.testSummaryService.resetToNeedsEvaluation(
      testSumId,
      userId,
      isImport,
    );
  }

  async getCalibrationInjectionByTestSumIds(
    testSumIds: string[],
  ): Promise<CalibrationInjectionDTO[]> {
    const results = await this.repository.find({
      where: { testSumId: In(testSumIds) },
    });
    return this.map.many(results);
  }

  async export(testSumIds: string[]): Promise<CalibrationInjectionDTO[]> {
    const calInjs = await this.getCalibrationInjectionByTestSumIds(testSumIds);
    return calInjs;
  }

  async import(
    testSumId: string,
    payload: CalibrationInjectionImportDTO,
    userId: string,
    isHistoricalRecord?: boolean,
  ) {
    const isImport = true;
    let historicalRecord: CalibrationInjection;

    if (isHistoricalRecord) {
      historicalRecord = await this.historicalRepository.findOneBy({
        testSumId: testSumId,
        upscaleGasLevelCode: payload.upscaleGasLevelCode ?? IsNull(),
        zeroInjectionDate: payload.zeroInjectionDate ?? IsNull(),
        zeroInjectionHour: payload.zeroInjectionHour ?? IsNull(),
        zeroInjectionMinute: payload.zeroInjectionMinute ?? IsNull(),
        upscaleInjectionDate: payload.upscaleInjectionDate ?? IsNull(),
        upscaleInjectionHour: payload.upscaleInjectionHour ?? IsNull(),
        upscaleInjectionMinute: payload.upscaleInjectionMinute ?? IsNull(),
      });
    }

    const createdCalibrationInjection = await this.createCalibrationInjection(
      testSumId,
      payload,
      userId,
      isImport,
      historicalRecord ? historicalRecord.id : null,
    );

    this.logger.log(
      `Calibration Injection Successfully Imported. Record Id: ${createdCalibrationInjection.id}`,
    );

    return null;
  }
}
