export class OnlineOfflineCalibrationBaseDTO {
  onlineZeroInjectionDate: string;
  onlineZeroInjectionHour: number;
  onlineZeroCalibrationError: number;
  calculatedOnlineZeroCalibrationError: number;
  onlineZeroMeasuredValue: number;
  onlineZeroReferenceValue: number;
  onlineUpscaleCalibrationError: number;
  calculatedOnlineUpscaleCalibrationError: number;
  onlineUpscaleInjectionDate: string;
  onlineUpscaleInjectionHour: number;
  onlineUpscaleMeasuredValue: number;
  onlineUpscaleReferenceValue: number;
  offlineZeroCalibrationError: number;
  calculatedOfflineZeroCalibrationError: number;
  offlineZeroInjectionDate: string;
  offlineZeroInjectionHour: number;
  offlineZeroMeasuredValue: number;
  offlineZeroReferenceValue: number;
  offlineUpscaleCalibrationError: number;
  calculatedOfflineUpscaleCalibrationError: number;
  offlineUpscaleInjectionDate: string;
  offlineUpscaleInjectionHour: number;
  offlineUpscaleMeasuredValue: number;
  offlineUpscaleReferenceValue: number;
  upscaleGasLevelCode: string;
}

export class OnlineOfflineCalibrationRecordDTO extends OnlineOfflineCalibrationBaseDTO {
  id: string;
  testSumId: string;
  userId: string;
  addDate: string;
  updateDate: string;
}

export class OnlineOfflineCalibrationImportDTO extends OnlineOfflineCalibrationBaseDTO {}

export class OnlineOfflineCalibrationDTO extends OnlineOfflineCalibrationRecordDTO {}
