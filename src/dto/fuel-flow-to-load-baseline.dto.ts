import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { IsInRange, IsValidCode } from '@us-epa-camd/easey-common/pipes';
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  ValidationArguments,
} from 'class-validator';
import { unitsOfMeasureCode } from '../entities/units-of-measure-code.entity';

const KEY = 'Fuel Flow To Load Baseline';

export class FuelFlowToLoadBaselineBaseDTO {
  @IsOptional()
  @IsString()
  @MaxLength(18, {
    message: (args: ValidationArguments) => {
      return `The value for [${args.value}] in the Component record [${args.property}] must not exceed 18 characters for [${KEY}].`;
    },
  })
  accuracyTestNumber?: string;

  @IsOptional()
  @IsString()
  @MaxLength(18, {
    message: (args: ValidationArguments) => {
      return `The value for [${args.value}] in the Component record [${args.property}] must not exceed 18 characters for [${KEY}].`;
    },
  })
  peiTestNumber?: string;

  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 1 },
    {
      message: (args: ValidationArguments) => {
        return `The value of [${args.value}] for [${args.property}] is allowed only 1 decimal place for $[${KEY}].`;
      },
    },
  )
  @IsInRange(0, 999999999.9, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of 0 and 999999999.9 for [${KEY}].`;
    },
  })
  averageFuelFlowRate?: number;

  @IsOptional()
  @IsInt()
  @IsInRange(0, 999999, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of 0 and 999999 for [${KEY}].`;
    },
  })
  averageLoad?: number;

  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message: (args: ValidationArguments) => {
        return `The value of [${args.value}] for [${args.property}] is allowed only 2 decimal place for $[${KEY}].`;
      },
    },
  )
  @IsInRange(0, 9999.99, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of 0 and 9999.99 for [${KEY}].`;
    },
  })
  baselineFuelFlowToLoadRatio?: number;

  @IsOptional()
  @IsString()
  @IsValidCode(unitsOfMeasureCode, {
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
  fuelFlowToLoadUnitsOfMeasureCode?: string;

  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 1 },
    {
      message: (args: ValidationArguments) => {
        return `The value of [${args.value}] for [${args.property}] is allowed only 1 decimal place for $[${KEY}].`;
      },
    },
  )
  @IsInRange(0, 999999.9, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of 0 and 999999.9 for [${KEY}].`;
    },
  })
  averageHourlyHeatInputRate?: number;

  @IsOptional()
  @IsInt()
  @IsInRange(0, 999999, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of 0 and 999999 for [${KEY}].`;
    },
  })
  baselineGHR?: number;

  @IsOptional()
  @IsString()
  @IsValidCode(unitsOfMeasureCode, {
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
  ghrUnitsOfMeasureCode?: string;

  @IsOptional()
  @IsInt()
  @IsInRange(0, 9999, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of 0 and 9999 for [${KEY}].`;
    },
  })
  numberOfHoursExcludedCofiring?: number;

  @IsOptional()
  @IsInt()
  @IsInRange(0, 9999, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of 0 and 9999 for [${KEY}].`;
    },
  })
  numberOfHoursExcludedRamping?: number;

  @IsOptional()
  @IsInt()
  @IsInRange(0, 9999, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of 0 and 9999 for [${KEY}].`;
    },
  })
  numberOfHoursExcludedLowRange?: number;
}

export class FuelFlowToLoadBaselineRecordDTO extends FuelFlowToLoadBaselineBaseDTO {
  id: string;
  testSumId: string;
  userId: string;
  addDate: string;
  updateDate: string;
}

export class FuelFlowToLoadBaselineImportDTO extends FuelFlowToLoadBaselineBaseDTO {}

export class FuelFlowToLoadBaselineDTO extends FuelFlowToLoadBaselineRecordDTO {}
