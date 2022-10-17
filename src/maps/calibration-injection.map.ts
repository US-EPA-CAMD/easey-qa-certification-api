import { Injectable } from '@nestjs/common';

import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { CalibrationInjectionDTO } from '../dto/calibration-injection.dto';
import { CalibrationInjection } from '../entities/calibration-injection.entty';

@Injectable()
export class CalibrationInjectionMap extends BaseMap<
  CalibrationInjection,
  CalibrationInjectionDTO
> {
  public async one(
    entity: CalibrationInjection,
  ): Promise<CalibrationInjectionDTO> {
    return {
      id: entity.id,
      testSumId: entity.testSumId,

      onLineOffLineIndicator: entity.onLineOffLineIndicator,
      zeroReferenceValue: entity.zeroReferenceValue,
      zeroCalibrationError: entity.zeroCalibrationError,
      calculatedZeroCalibrationError: entity.calculatedZeroCalibrationError,
      zeroAPSIndicator: entity.zeroAPSIndicator,
      calculatedZeroAPSIndicator: entity.calculatedZeroAPSIndicator,
      zeroInjectionDate: entity.zeroInjectionDate,
      zeroInjectionHour: entity.zeroInjectionHour,
      zeroInjectionMinute: entity.zeroInjectionMinute,
      upscaleReferenceValue: entity.upscaleReferenceValue,
      zeroMeasuredValue: entity.zeroMeasuredValue,
      upscaleGasLevelCode: entity.upscaleGasLevelCode,
      upscaleMeasuredValue: entity.upscaleMeasuredValue,
      upscaleCalibrationError: entity.upscaleCalibrationError,
      calculatedUpscaleCalibrationError:
        entity.calculatedUpscaleCalibrationError,
      upscaleAPSIndicator: entity.upscaleAPSIndicator,
      calculatedUpscaleAPSIndicator: entity.calculatedUpscaleAPSIndicator,
      upscaleInjectionDate: entity.upscaleInjectionDate,
      upscaleInjectionHour: entity.upscaleInjectionHour,
      upscaleInjectionMinute: entity.upscaleInjectionMinute,

      userId: entity.userId,
      addDate: entity.addDate ? entity.addDate.toLocaleString() : null,
      updateDate: entity.updateDate ? entity.updateDate.toLocaleString() : null,
    };
  }
}
