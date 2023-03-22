import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { IsIsoFormat } from '@us-epa-camd/easey-common/pipes';
import { ValidationArguments } from 'class-validator';

const KEY = 'Calibration Injection';
const DATE_FORMAT = 'YYYY-MM-DD';

export class CalibrationInjectionBaseDTO {
  onLineOffLineIndicator: number;
  upscaleGasLevelCode: string;

  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatMessage(
        `You reported [fieldname] which must be a valid ISO date format of ${DATE_FORMAT} for [key].`,
        {
          fieldname: args.property,
          key: KEY,
        },
      );
    },
  })
  zeroInjectionDate: Date;
  zeroInjectionHour: number;
  zeroInjectionMinute: number;

  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatMessage(
        `You reported [fieldname] which must be a valid ISO date format of ${DATE_FORMAT} for [key].`,
        {
          fieldname: args.property,
          key: KEY,
        },
      );
    },
  })
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
