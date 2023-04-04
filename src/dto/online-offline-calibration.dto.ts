import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { IsIsoFormat } from '@us-epa-camd/easey-common/pipes';
import { IsNumber, IsString, ValidationArguments } from 'class-validator';

const KEY = 'Online Offline Calibration';
const DATE_FORMAT = 'YYYY-MM-DD';

export class OnlineOfflineCalibrationBaseDTO {
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
  onlineZeroInjectionDate: string;

  @IsNumber()
  onlineZeroInjectionHour: number;
  @IsNumber()
  onlineZeroCalibrationError: number;
  @IsNumber()
  onlineZeroAPSIndicator: number;
  @IsNumber()
  onlineZeroMeasuredValue: number;
  @IsNumber()
  onlineZeroReferenceValue: number;
  @IsNumber()
  onlineUpscaleCalibrationError: number;
  @IsNumber()
  onlineUpscaleAPSIndicator: number;

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
  onlineUpscaleInjectionDate: string;
  @IsNumber()
  onlineUpscaleInjectionHour: number;
  @IsNumber()
  onlineUpscaleMeasuredValue: number;
  @IsNumber()
  onlineUpscaleReferenceValue: number;
  @IsNumber()
  offlineZeroCalibrationError: number;
  @IsNumber()
  offlineZeroAPSIndicator: number;

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
  offlineZeroInjectionDate: string;
  @IsNumber()
  offlineZeroInjectionHour: number;
  @IsNumber()
  offlineZeroMeasuredValue: number;
  @IsNumber()
  offlineZeroReferenceValue: number;
  @IsNumber()
  offlineUpscaleCalibrationError: number;
  @IsNumber()
  offlineUpscaleAPSIndicator: number;

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
  offlineUpscaleInjectionDate: string;
  @IsNumber()
  offlineUpscaleInjectionHour: number;
  @IsNumber()
  offlineUpscaleMeasuredValue: number;
  @IsNumber()
  offlineUpscaleReferenceValue: number;
  @IsString()
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
