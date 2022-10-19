import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CalibrationInjectionBaseDTO,
  CalibrationInjectionDTO,
} from '../dto/calibration-injection.dto';
import { CalibrationInjectionMap } from '../maps/calibration-injection.map';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { CalibrationInjectionWorkspaceRepository } from './calibration-injection-workspace.repository';
import { currentDateTime } from '../utilities/functions';
import { v4 as uuid } from 'uuid';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';

@Injectable()
export class CalibrationInjectionWorkspaceService {
  constructor(
    private readonly map: CalibrationInjectionMap,
    @Inject(forwardRef(() => TestSummaryWorkspaceService))
    private readonly testSummaryService: TestSummaryWorkspaceService,
    @InjectRepository(CalibrationInjectionWorkspaceRepository)
    private readonly repository: CalibrationInjectionWorkspaceRepository,
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
    const result = await this.repository.findOne({
      id,
      testSumId,
    });

    if (!result) {
      throw new LoggingException(
        `Calibration Injection record not found with Record Id [${id}].`,
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
    entity = await this.repository.findOne(entity.id);
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
    const entity = await this.repository.findOne({
      id,
      testSumId,
    });

    if (!entity) {
      throw new LoggingException(
        `Calibration Injection record not found with Record Id [${id}].`,
        HttpStatus.NOT_FOUND,
      );
    }

    entity.onLineOffLineIndicator = payload.onLineOffLineIndicator;
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
      throw new LoggingException(
        `Error deleting Calibration Injection record [${id}]`,
        HttpStatus.INTERNAL_SERVER_ERROR,
        e,
      );
    }

    await this.testSummaryService.resetToNeedsEvaluation(
      testSumId,
      userId,
      isImport,
    );
  }
}
