import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { IsIsoFormat } from '@us-epa-camd/easey-common/pipes';
import { ValidationArguments, IsNumber, IsString } from 'class-validator';

const KEY = 'Calibration Injection';
const DATE_FORMAT = 'YYYY-MM-DD';

export class CalibrationInjectionBaseDTO {
  @IsNumber()
  onlineOfflineIndicator: number;
  @IsString()
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
  @IsNumber()
  zeroInjectionHour: number;
  @IsNumber()
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
  @IsNumber()
  upscaleInjectionHour: number;
  @IsNumber()
  upscaleInjectionMinute: number;
  @IsNumber()
  zeroMeasuredValue: number;
  @IsNumber()
  upscaleMeasuredValue: number;
  @IsNumber()
  zeroAPSIndicator: number;
  @IsNumber()
  upscaleAPSIndicator: number;
  @IsNumber()
  zeroCalibrationError: number;
  @IsNumber()
  upscaleCalibrationError: number;
  @IsNumber()
  zeroReferenceValue: number;
  @IsNumber()
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
