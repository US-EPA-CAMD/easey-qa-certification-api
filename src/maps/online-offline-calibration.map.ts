import { Injectable } from '@nestjs/common';

import { BaseMap } from '@us-epa-camd/easey-common/maps';

import { OnlineOfflineCalibrationDTO } from '../dto/online-offline-calibration.dto';
import { OnlineOfflineCalibration } from '../entities/online-offline-calibration.entity';

@Injectable()
export class OnlineOfflineCalibrationMap extends BaseMap<
  OnlineOfflineCalibration,
  OnlineOfflineCalibrationDTO
> {
  public async one(
    entity: OnlineOfflineCalibration,
  ): Promise<OnlineOfflineCalibrationDTO> {
    return {
      id: entity.id,
      testSumId: entity.testSumId,
      userId: entity.userId,
      addDate: entity.addDate?.toISOString() ?? null,
      updateDate: entity.updateDate?.toISOString() ?? null,

      offlineUpscaleAPSIndicator: entity.offlineUpscaleAPSIndicator,
      offlineZeroAPSIndicator: entity.offlineZeroAPSIndicator,
      onlineUpscaleAPSIndicator: entity.onlineUpscaleAPSIndicator,
      onlineZeroAPSIndicator: entity.onlineZeroAPSIndicator,
      offlineUpscaleCalibrationError: entity.offlineUpscaleCalibrationError,
      offlineUpscaleInjectionDate: entity.offlineUpscaleInjectionDate,
      offlineUpscaleInjectionHour: entity.offlineUpscaleInjectionHour,
      offlineUpscaleMeasuredValue: entity.offlineUpscaleMeasuredValue,
      offlineUpscaleReferenceValue: entity.offlineUpscaleReferenceValue,
      offlineZeroCalibrationError: entity.offlineZeroCalibrationError,
      offlineZeroInjectionDate: entity.offlineZeroInjectionDate,
      offlineZeroInjectionHour: entity.offlineZeroInjectionHour,
      offlineZeroMeasuredValue: entity.offlineZeroMeasuredValue,
      offlineZeroReferenceValue: entity.offlineZeroReferenceValue,
      onlineUpscaleCalibrationError: entity.onlineUpscaleCalibrationError,
      onlineUpscaleInjectionDate: entity.onlineUpscaleInjectionDate,
      onlineUpscaleInjectionHour: entity.onlineUpscaleInjectionHour,
      onlineUpscaleMeasuredValue: entity.onlineUpscaleMeasuredValue,
      onlineUpscaleReferenceValue: entity.onlineUpscaleReferenceValue,
      onlineZeroCalibrationError: entity.onlineZeroCalibrationError,
      onlineZeroInjectionDate: entity.onlineZeroInjectionDate,
      onlineZeroInjectionHour: entity.onlineZeroInjectionHour,
      onlineZeroMeasuredValue: entity.onlineZeroMeasuredValue,
      onlineZeroReferenceValue: entity.onlineZeroReferenceValue,
      upscaleGasLevelCode: entity.upscaleGasLevelCode,
    };
  }
}
