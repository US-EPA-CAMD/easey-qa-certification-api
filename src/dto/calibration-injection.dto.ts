import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import {
  IsInRange,
  IsIsoFormat,
  IsValidCode,
  IsValidDate,
} from '@us-epa-camd/easey-common/pipes';
import {
  ValidationArguments,
  IsNumber,
  IsString,
  IsOptional,
  IsInt,
} from 'class-validator';
import {
  MAX_HOUR,
  MAX_MINUTE,
  MIN_HOUR,
  MIN_MINUTE,
} from '../utilities/constants';
import { GasLevelCode } from '../entities/workspace/gas-level-code.entity';

const KEY = 'Calibration Injection';
const DATE_FORMAT = 'YYYY-MM-DD';

export class CalibrationInjectionBaseDTO {
  @IsOptional()
  @IsInt()
  @IsInRange(0, 1, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be 0 or 1 for [${KEY}].`;
    },
  })
  onlineOfflineIndicator?: number;

  @IsOptional()
  @IsString()
  @IsValidCode(GasLevelCode, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] is invalid for [${KEY}]`;
    },
  })
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
  @IsValidDate({
    message: (args: ValidationArguments) => {
      return `[${args.property}] must be a valid date in the format of ${DATE_FORMAT}. You reported an invalid date of [${args.value}].`;
    },
  })
  zeroInjectionDate?: Date;

  @IsOptional()
  @IsNumber()
  @IsInRange(MIN_HOUR, MAX_HOUR, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage(
        'You reported a [Fieldname] of [Hour], which is outside the range of acceptable values for this hour for [key].',
        {
          fieldname: args.property,
          hour: args.value,
          key: KEY,
        },
      );
    },
  })
  zeroInjectionHour?: number;

  @IsOptional()
  @IsNumber()
  @IsInRange(MIN_MINUTE, MAX_MINUTE, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage(
        'You reported a [fieldname] of [minute], which is outside the range of acceptable values for this minute for [key].',
        {
          fieldname: args.property,
          minute: args.value,
          key: KEY,
        },
      );
    },
  })
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
  @IsValidDate({
    message: (args: ValidationArguments) => {
      return `[${args.property}] must be a valid date in the format of ${DATE_FORMAT}. You reported an invalid date of [${args.value}].`;
    },
  })
  upscaleInjectionDate?: Date;

  @IsOptional()
  @IsNumber()
  @IsInRange(MIN_HOUR, MAX_HOUR, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage(
        'You reported a [Fieldname] of [Hour], which is outside the range of acceptable values for this hour for [key].',
        {
          fieldname: args.property,
          hour: args.value,
          key: KEY,
        },
      );
    },
  })
  upscaleInjectionHour?: number;

  @IsOptional()
  @IsNumber()
  @IsInRange(MIN_MINUTE, MAX_MINUTE, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage(
        'You reported a [fieldname] of [minute], which is outside the range of acceptable values for this minute for [key].',
        {
          fieldname: args.property,
          minute: args.value,
          key: KEY,
        },
      );
    },
  })
  upscaleInjectionMinute?: number;

  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 3 },
    {
      message: (args: ValidationArguments) => {
        return `The value of [${args.value}] for [${args.property}] is allowed only 3 decimal place for $[${KEY}].`;
      },
    },
  )
  @IsInRange(-9999999999.999, 9999999999.999, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of -9999999999.999 and 9999999999.999 for [${KEY}].`;
    },
  })
  zeroMeasuredValue?: number;

  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 3 },
    {
      message: (args: ValidationArguments) => {
        return `The value of [${args.value}] for [${args.property}] is allowed only 3 decimal place for $[${KEY}].`;
      },
    },
  )
  @IsInRange(-9999999999.999, 9999999999.999, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of -9999999999.999 and 9999999999.999 for [${KEY}].`;
    },
  })
  upscaleMeasuredValue?: number;

  @IsOptional()
  @IsInt()
  @IsInRange(0, 1, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be an integer of 0 and 1 for [${KEY}].`;
    },
  })
  zeroAPSIndicator?: number;

  @IsOptional()
  @IsInt()
  @IsInRange(0, 1, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be an integer of 0 and 1 for [${KEY}].`;
    },
  })
  upscaleAPSIndicator?: number;

  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message: (args: ValidationArguments) => {
        return `The value of [${args.value}] for [${args.property}] is allowed only 2 decimal place for $[${KEY}].`;
      },
    },
  )
  @IsInRange(-9999.99, 9999.99, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of 0 and 9999999999.999 for [${KEY}].`;
    },
  })
  zeroCalibrationError?: number;

  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message: (args: ValidationArguments) => {
        return `The value of [${args.value}] for [${args.property}] is allowed only 2 decimal place for $[${KEY}].`;
      },
    },
  )
  @IsInRange(-9999.99, 9999.99, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of -9999.999 and 9999999999.999 for [${KEY}].`;
    },
  })
  upscaleCalibrationError?: number;

  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 3 },
    {
      message: (args: ValidationArguments) => {
        return `The value of [${args.value}] for [${args.property}] is allowed only 3 decimal place for $[${KEY}].`;
      },
    },
  )
  @IsInRange(-9999999999.999, 9999999999.999, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of -9999999999.999 and 9999999999.999 for [${KEY}].`;
    },
  })
  zeroReferenceValue?: number;

  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 3 },
    {
      message: (args: ValidationArguments) => {
        return `The value of [${args.value}] for [${args.property}] is allowed only 3 decimal place for $[${KEY}].`;
      },
    },
  )
  @IsInRange(-9999999999.999, 9999999999.999, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of -9999999999.999 and 9999999999.999 for [${KEY}].`;
    },
  })
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
