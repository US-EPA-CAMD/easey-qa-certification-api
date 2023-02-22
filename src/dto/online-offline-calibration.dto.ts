import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { IsIsoFormat } from '@us-epa-camd/easey-common/pipes';
import { ValidationArguments } from 'class-validator';

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

  onlineZeroInjectionHour: number;
  onlineZeroCalibrationError: number;
  onlineZeroAPSIndicator: number;
  onlineZeroMeasuredValue: number;
  onlineZeroReferenceValue: number;
  onlineUpscaleCalibrationError: number;
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
  onlineUpscaleInjectionHour: number;
  onlineUpscaleMeasuredValue: number;
  onlineUpscaleReferenceValue: number;
  offlineZeroCalibrationError: number;
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
  offlineZeroInjectionHour: number;
  offlineZeroMeasuredValue: number;
  offlineZeroReferenceValue: number;
  offlineUpscaleCalibrationError: number;
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
