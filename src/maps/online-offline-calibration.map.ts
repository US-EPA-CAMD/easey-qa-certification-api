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
      addDate: entity.addDate.toLocaleString(),
      updateDate: entity.updateDate.toLocaleString(),

      calculatedOfflineUpscaleCalibrationError:
        entity.calculatedOfflineUpscaleCalibrationError,
      calculatedOfflineZeroCalibrationError:
        entity.calculatedOfflineZeroCalibrationError,
      calculatedOnlineUpscaleCalibrationError:
        entity.calculatedOnlineUpscaleCalibrationError,
      calculatedOnlineZeroCalibrationError:
        entity.calculatedOnlineZeroCalibrationError,
      offlineUpscaleCalibrationError: entity.offlineUpscaleCalibrationError,
      offlineUpscaleInjectionDate:
        entity.offlineUpscaleInjectionDate?.toLocaleString() ?? null,
      offlineUpscaleInjectionHour: entity.offlineUpscaleInjectionHour,
      offlineUpscaleMeasuredValue: entity.offlineUpscaleMeasuredValue,
      offlineUpscaleReferenceValue: entity.offlineUpscaleReferenceValue,
      offlineZeroCalibrationError: entity.offlineZeroCalibrationError,
      offlineZeroInjectionDate:
        entity.offlineZeroInjectionDate?.toLocaleString() ?? null,
      offlineZeroInjectionHour: entity.offlineZeroInjectionHour,
      offlineZeroMeasuredValue: entity.offlineZeroMeasuredValue,
      offlineZeroReferenceValue: entity.offlineZeroReferenceValue,
      onlineUpscaleCalibrationError: entity.onlineUpscaleCalibrationError,
      onlineUpscaleInjectionDate:
        entity.onlineUpscaleInjectionDate?.toLocaleString() ?? null,
      onlineUpscaleInjectionHour: entity.onlineUpscaleInjectionHour,
      onlineUpscaleMeasuredValue: entity.onlineUpscaleMeasuredValue,
      onlineUpscaleReferenceValue: entity.onlineUpscaleReferenceValue,
      onlineZeroCalibrationError: entity.onlineZeroCalibrationError,
      onlineZeroInjectionDate:
        entity.onlineZeroInjectionDate?.toLocaleString() ?? null,
      onlineZeroInjectionHour: entity.onlineZeroInjectionHour,
      onlineZeroMeasuredValue: entity.onlineZeroMeasuredValue,
      onlineZeroReferenceValue: entity.onlineZeroReferenceValue,
      upscaleGasLevelCode: entity.upscaleGasLevelCode,
    };
  }
}
