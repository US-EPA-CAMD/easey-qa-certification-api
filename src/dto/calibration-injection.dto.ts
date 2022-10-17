const KEY = 'Calibration Injection';

export class CalibrationInjectionBaseDTO {
  onLineOffLineIndicator: number;
  upscaleGasLevelCode: string;
  zeroInjectionDate: Date;
  zeroInjectionHour: number;
  zeroInjectionMinute: number;
  upscaleInjectionDate: Date;
  upscaleInjectionHour: number;
  upscaleInjectionMinute: number;
  zeroMeasuredValue: number;
  upscaleMeasuredValue: number;
  zeroAPSIndicator: number;
  upscaleAPSIndicator: number;
  zeroCalibrationError: number;
  upscaleCalibrationError: number;
  zeroReferenceValue: number;
  upscaleReferenceValue: number;
}

export class CalibrationInjectionRecordDTO extends CalibrationInjectionBaseDTO {
  id: string;
  testSumId: string;
  calculatedZeroCalibrationError: number;
  calculatedZeroAPSIndicator: number;
  calculatedUpscaleCalibrationError: number;
  calculatedUpscaleAPSIndicator: number;
  userId: string;
  addDate: string;
  updateDate: string;
}

export class CalibrationInjectionImportDTO extends CalibrationInjectionBaseDTO {}

export class CalibrationInjectionDTO extends CalibrationInjectionRecordDTO {}
