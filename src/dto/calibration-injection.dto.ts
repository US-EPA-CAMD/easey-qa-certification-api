import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { IsIsoFormat } from '@us-epa-camd/easey-common/pipes';
import {
  ValidationArguments,
  IsNumber,
  IsString,
  IsOptional,
} from 'class-validator';

const KEY = 'Calibration Injection';
const DATE_FORMAT = 'YYYY-MM-DD';

export class CalibrationInjectionBaseDTO {
  @IsOptional()
  @IsNumber()
  onlineOfflineIndicator?: number;
  @IsOptional()
  @IsString()
  upscaleGasLevelCode?: string;

  @IsOptional()
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
  zeroInjectionDate?: Date;
  @IsOptional()
  @IsNumber()
  zeroInjectionHour?: number;
  @IsOptional()
  @IsNumber()
  zeroInjectionMinute?: number;

  @IsOptional()
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
  upscaleInjectionDate?: Date;
  @IsOptional()
  @IsNumber()
  upscaleInjectionHour?: number;
  @IsOptional()
  @IsNumber()
  upscaleInjectionMinute?: number;
  @IsOptional()
  @IsNumber()
  zeroMeasuredValue?: number;
  @IsOptional()
  @IsNumber()
  upscaleMeasuredValue?: number;
  @IsOptional()
  @IsNumber()
  zeroAPSIndicator?: number;
  @IsOptional()
  @IsNumber()
  upscaleAPSIndicator?: number;
  @IsOptional()
  @IsNumber()
  zeroCalibrationError?: number;
  @IsOptional()
  @IsNumber()
  upscaleCalibrationError?: number;
  @IsOptional()
  @IsNumber()
  zeroReferenceValue?: number;
  @IsOptional()
  @IsNumber()
  upscaleReferenceValue?: number;
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
