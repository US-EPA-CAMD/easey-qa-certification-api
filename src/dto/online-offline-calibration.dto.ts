import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { IsIsoFormat } from '@us-epa-camd/easey-common/pipes';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidationArguments,
} from 'class-validator';

const KEY = 'Online Offline Calibration';
const DATE_FORMAT = 'YYYY-MM-DD';

export class OnlineOfflineCalibrationBaseDTO {
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
  onlineZeroInjectionDate?: Date;

  @IsOptional()
  @IsNumber()
  onlineZeroInjectionHour?: number;
  @IsOptional()
  @IsNumber()
  onlineZeroCalibrationError?: number;
  @IsOptional()
  @IsNumber()
  onlineZeroAPSIndicator?: number;
  @IsOptional()
  @IsNumber()
  onlineZeroMeasuredValue?: number;
  @IsOptional()
  @IsNumber()
  onlineZeroReferenceValue?: number;
  @IsOptional()
  @IsNumber()
  onlineUpscaleCalibrationError?: number;
  @IsOptional()
  @IsNumber()
  onlineUpscaleAPSIndicator?: number;

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
  onlineUpscaleInjectionDate?: Date;
  @IsOptional()
  @IsNumber()
  onlineUpscaleInjectionHour?: number;
  @IsOptional()
  @IsNumber()
  onlineUpscaleMeasuredValue?: number;
  @IsOptional()
  @IsNumber()
  onlineUpscaleReferenceValue?: number;
  @IsOptional()
  @IsNumber()
  offlineZeroCalibrationError?: number;
  @IsOptional()
  @IsNumber()
  offlineZeroAPSIndicator?: number;

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
  offlineZeroInjectionDate?: Date;
  @IsOptional()
  @IsNumber()
  offlineZeroInjectionHour?: number;
  @IsOptional()
  @IsNumber()
  offlineZeroMeasuredValue?: number;
  @IsOptional()
  @IsNumber()
  offlineZeroReferenceValue?: number;
  @IsOptional()
  @IsNumber()
  offlineUpscaleCalibrationError?: number;
  @IsOptional()
  @IsNumber()
  offlineUpscaleAPSIndicator?: number;

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
  offlineUpscaleInjectionDate?: Date;
  @IsOptional()
  @IsNumber()
  offlineUpscaleInjectionHour?: number;
  @IsOptional()
  @IsNumber()
  offlineUpscaleMeasuredValue?: number;
  @IsOptional()
  @IsNumber()
  offlineUpscaleReferenceValue?: number;
  @IsOptional()
  @IsString()
  upscaleGasLevelCode?: string;
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
