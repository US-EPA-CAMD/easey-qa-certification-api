import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import {
  IsInRange,
  IsIsoFormat,
  IsValidDate,
  MatchesRegEx,
} from '@us-epa-camd/easey-common/pipes';
import {
  IsNotEmpty,
  IsNumber,
  ValidationArguments,
  IsString,
  IsOptional,
  MaxLength,
  IsInt,
} from 'class-validator';
import { PressureMeasureCode } from '../entities/workspace/pressure-measure-code.entity';
import { IsValidCode } from '../pipes/is-valid-code.pipe';
import { ProbeTypeCode } from '../entities/probe-type-code.entity';

const KEY = 'RATA Traverse';
const MIN_VEL_CAL_COEFF = 0.5;
const MAX_VEL_CAL_COEFF = 1.5;
const MIN_TSTACK_TEMP = 0;
const MAX_TSTACK_TEMP = 1000;
const DATE_FORMAT = 'YYYY-MM-DD';
export class RataTraverseBaseDTO {
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('RATA-71-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsString()
  @MaxLength(11, {
    message: (args: ValidationArguments) => {
      return `The value for [${args.value}] in the Component record [${args.property}] must not exceed 11 characters`;
    },
  })
  probeId: string;

  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('RATA-72-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsString()
  @IsValidCode(ProbeTypeCode, {
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
  probeTypeCode: string;

  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('RATA-73-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsValidCode(PressureMeasureCode, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('RATA-73-B', {
        value: args.value,
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  pressureMeasureCode: string;

  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('RATA-70-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsString()
  @MatchesRegEx('^[a-zA-Z0-9]{1,3}$', {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be 1 to 3 characters and only consist of upper and lower case letters, numbers for [${KEY}].`;
    },
  })
  methodTraversePointId: string;

  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('RATA-74-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsNumber(
    { maxDecimalPlaces: 3 },
    {
      message: (args: ValidationArguments) => {
        return `The value of [${args.value}] for [${args.property}] is allowed only 3 decimal place for $[${KEY}].`;
      },
    },
  )
  @IsInRange(
    MIN_VEL_CAL_COEFF,
    MAX_VEL_CAL_COEFF,
    {
      message: (args: ValidationArguments) => {
        return CheckCatalogService.formatResultMessage('RATA-74-B', {
          value: args.value,
          fieldname: args.property,
          key: KEY,
          minvalue: MIN_VEL_CAL_COEFF,
          maxvalue: MAX_VEL_CAL_COEFF,
        });
      },
    },
    true,
    true,
  )
  velocityCalibrationCoefficient: number;

  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('RATA-75-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatMessage(
        `The value for [fieldName] in the [key] record must be a valid ISO date format [dateFormat]`,
        {
          fieldName: args.property,
          key: KEY,
          dateFormat: DATE_FORMAT,
        },
      );
    },
  })
  @IsValidDate({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatMessage(
        `[${args.property}] must be a valid date in the format of ${DATE_FORMAT}. You reported an invalid date of [${args.value}]`,
      );
    },
  })
  lastProbeDate: Date;

  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 3 },
    {
      message: (args: ValidationArguments) => {
        return `The value of [${args.value}] for [${args.property}] is allowed only 3 decimal place for [${KEY}]`;
      },
    },
  )
  @IsInRange(-99.999, 99.999, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of -99.999 and 99.999 for [${KEY}]`;
    },
  })
  averageVelocityDifferencePressure?: number;

  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 3 },
    {
      message: (args: ValidationArguments) => {
        return `The value of [${args.value}] for [${args.property}] is allowed only 3 decimal place for [${KEY}]`;
      },
    },
  )
  @IsInRange(-99.999, 99.999, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of -99.999 and 99.999 for [${KEY}]`;
    },
  })
  averageSquareVelocityDifferencePressure?: number;

  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('RATA-77-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsNumber(
    { maxDecimalPlaces: 1 },
    {
      message: (args: ValidationArguments) => {
        return `The value of [${args.value}] for [${args.property}] is allowed only 1 decimal place for $[${KEY}].`;
      },
    },
  )
  @IsInRange(
    MIN_TSTACK_TEMP,
    MAX_TSTACK_TEMP,
    {
      message: (args: ValidationArguments) => {
        return CheckCatalogService.formatResultMessage('RATA-77-B', {
          value: args.value,
          fieldname: args.property,
          key: KEY,
          minvalue: MIN_TSTACK_TEMP,
          maxvalue: MAX_TSTACK_TEMP,
        });
      },
    },
    true,
    true,
  )
  tStackTemperature: number;

  @IsOptional()
  @IsInt()
  @IsInRange(0, 1, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be an integer of 0 and 1 for [${KEY}]`;
    },
  })
  pointUsedIndicator?: number;

  @IsOptional()
  @IsInt()
  @IsInRange(0, 99, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be an integer within the range of 0 and 99 for [${KEY}]`;
    },
  })
  numberWallEffectsPoints?: number;

  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 1 },
    {
      message: (args: ValidationArguments) => {
        return `The value of [${args.value}] for [${args.property}] is allowed only 1 decimal place for [${KEY}]`;
      },
    },
  )
  @IsInRange(-360, 360, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of -360 and 360 for [${KEY}]`;
    },
  })
  yawAngle?: number;

  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 1 },
    {
      message: (args: ValidationArguments) => {
        return `The value of [${args.value}] for [${args.property}] is allowed only 1 decimal place for [${KEY}]`;
      },
    },
  )
  @IsInRange(-360, 360, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of -360 and 360 for [${KEY}]`;
    },
  })
  pitchAngle?: number;

  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message: (args: ValidationArguments) => {
        return `The value of [${args.value}] for [${args.property}] is allowed only 2 decimal place for [${KEY}]`;
      },
    },
  )
  @IsInRange(-9999.99, 9999.99, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of -9999.99 and 9999.99 for [${KEY}]`;
    },
  })
  calculatedVelocity?: number;

  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message: (args: ValidationArguments) => {
        return `The value of [${args.value}] for [${args.property}] is allowed only 2 decimal place for [${KEY}]`;
      },
    },
  )
  @IsInRange(-9999.99, 9999.99, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of -9999.99 and 9999.99 for [${KEY}]`;
    },
  })
  replacementVelocity?: number;
}

export class RataTraverseRecordDTO extends RataTraverseBaseDTO {
  id: string;
  flowRataRunId: string;
  calculatedCalculatedVelocity: number;
  userId: string;
  addDate: string;
  updateDate: string;
}

export class RataTraverseImportDTO extends RataTraverseBaseDTO {}

export class RataTraverseDTO extends RataTraverseRecordDTO {}
