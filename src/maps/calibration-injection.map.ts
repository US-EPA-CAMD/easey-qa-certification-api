import { Injectable } from '@nestjs/common';

import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { CalibrationInjectionDTO } from '../dto/calibration-injection.dto';
import { CalibrationInjection } from '../entities/calibration-injection.entity';

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

      onlineOfflineIndicator: entity.onlineOfflineIndicator,
      upscaleGasLevelCode: entity.upscaleGasLevelCode,
      zeroInjectionDate: entity.zeroInjectionDate,
      zeroInjectionHour: entity.zeroInjectionHour,
      zeroInjectionMinute: entity.zeroInjectionMinute,
      upscaleInjectionDate: entity.upscaleInjectionDate,
      upscaleInjectionHour: entity.upscaleInjectionHour,
      upscaleInjectionMinute: entity.upscaleInjectionMinute,
      zeroMeasuredValue: entity.zeroMeasuredValue,
      upscaleMeasuredValue: entity.upscaleMeasuredValue,
      zeroAPSIndicator: entity.zeroAPSIndicator,
      calculatedZeroAPSIndicator: entity.calculatedZeroAPSIndicator,
      upscaleAPSIndicator: entity.upscaleAPSIndicator,
      calculatedUpscaleAPSIndicator: entity.calculatedUpscaleAPSIndicator,
      zeroCalibrationError: entity.zeroCalibrationError,
      calculatedZeroCalibrationError: entity.calculatedZeroCalibrationError,
      upscaleCalibrationError: entity.upscaleCalibrationError,
      calculatedUpscaleCalibrationError:
        entity.calculatedUpscaleCalibrationError,
      zeroReferenceValue: entity.zeroReferenceValue,
      upscaleReferenceValue: entity.upscaleReferenceValue,

      userId: entity.userId,
      addDate: entity.addDate ? entity.addDate.toISOString() : null,
      updateDate: entity.updateDate ? entity.updateDate.toISOString() : null,
    };
  }
}
