const KEY = 'Calibration Injection';

export class CalibrationInjectionBaseDTO {
  onLineOffLineIndicator: number;
  zeroReferenceValue: number;
  zeroCalibrationError: number;
  zeroAPSIndicator: number;
  zeroInjectionDate: Date;
  zeroInjectionHour: number;
  zeroInjectionMinute: number;
  upscaleReferenceValue: number;
  zeroMeasuredValue: number;
  upscaleGasLevelCode: string;
  upscaleMeasuredValue: number;
  upscaleCalibrationError: number;
  upscaleAPSIndicator: number;
  upscaleInjectionDate: Date;
  upscaleInjectionHour: number;
  upscaleInjectionMinute: number;
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
