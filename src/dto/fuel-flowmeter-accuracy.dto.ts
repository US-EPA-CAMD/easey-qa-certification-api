import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import {
  IsInRange,
  IsIsoFormat,
  IsValidCode,
  IsValidDate,
} from '@us-epa-camd/easey-common/pipes';
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  ValidationArguments,
} from 'class-validator';
import { MAX_HOUR, MIN_HOUR } from '../utilities/constants';
import { AccuracyTestMethodCode } from '../entities/accuracy-test-method-code.entity';

const KEY = 'Fuel Flowmeter Accuracy';
const DATE_FORMAT = 'YYYY-MM-DD';
export class FuelFlowmeterAccuracyBaseDTO {
  @IsOptional()
  @IsString()
  @IsValidCode(AccuracyTestMethodCode, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatMessage(
        'You reported the value [value] for [fieldname], which is not in the list of valid values for [key].',
        {
          value: args.value,
          fieldname: args.property,
          key: KEY,
        },
      );
    },
  })
  accuracyTestMethodCode?: string;

  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 1 },
    {
      message: (args: ValidationArguments) => {
        return `The value of [${args.value}] for [${args.property}] is allowed only 1 decimal place for $[${KEY}].`;
      },
    },
  )
  @IsInRange(-9999.9, 9999.9, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of -9999.9 and 9999.9 for [${KEY}].`;
    },
  })
  lowFuelAccuracy?: number;

  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 1 },
    {
      message: (args: ValidationArguments) => {
        return `The value of [${args.value}] for [${args.property}] is allowed only 1 decimal place for $[${KEY}].`;
      },
    },
  )
  @IsInRange(-9999.9, 9999.9, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of -9999.9 and 9999.9 for [${KEY}].`;
    },
  })
  midFuelAccuracy?: number;

  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 1 },
    {
      message: (args: ValidationArguments) => {
        return `The value of [${args.value}] for [${args.property}] is allowed only 1 decimal place for $[${KEY}].`;
      },
    },
  )
  @IsInRange(-9999.9, 9999.9, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of -9999.9 and 9999.9 for [${KEY}].`;
    },
  })
  highFuelAccuracy?: number;

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
      return CheckCatalogService.formatMessage(
        `[${args.property}] must be a valid date in the format of [${DATE_FORMAT}]. You reported an invalid date of [${args.value}]`,
      );
    },
  })
  reinstallationDate?: Date;

  @IsOptional()
  @IsInt()
  @IsInRange(MIN_HOUR, MAX_HOUR, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of 0 and 23 for [${KEY}]`;
    },
  })
  reinstallationHour?: number;
}

export class FuelFlowmeterAccuracyRecordDTO extends FuelFlowmeterAccuracyBaseDTO {
  id: string;
  testSumId: string;
  userId: string;
  addDate: string;
  updateDate: string;
}

export class FuelFlowmeterAccuracyImportDTO extends FuelFlowmeterAccuracyBaseDTO {}

export class FuelFlowmeterAccuracyDTO extends FuelFlowmeterAccuracyRecordDTO {}
