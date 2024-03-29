import { ApiProperty } from '@nestjs/swagger';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { IsInRange, IsValidDate } from '@us-epa-camd/easey-common/pipes';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidationArguments,
} from 'class-validator';
import { IsNotNegative } from '../pipes/is-not-negative.pipe';

const KEY = 'Linearity Injection';
const MIN_MINUTE = 0;
const MAX_MINUTE = 59;
const MIN_HOUR = 0;
const MAX_HOUR = 23;
const DATE_FORMAT = 'YYYY-MM-DD';

export class LinearityInjectionBaseDTO {
  @ApiProperty({
    description: 'injectionDate. ADD TO PROPERTY METADATA',
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('LINEAR-19-A', {
        type: args.value,
        key: KEY,
      });
    },
  })
  @IsValidDate({
    message: (args: ValidationArguments) => {
      return `[${args.property}] must be a valid date in the format of ${DATE_FORMAT}. You reported an invalid date of [${args.value}].`;
    },
  })
  injectionDate: Date;

  @ApiProperty({
    description: 'injectionHour. ADD TO PROPERTY METADATA',
  })
  @IsOptional()
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('LINEAR-19-A', {
        type: args.value,
        key: KEY,
      });
    },
  })
  @IsInRange(MIN_HOUR, MAX_HOUR, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('LINEAR-19-A', {
        type: args.value,
        key: KEY,
      });
    },
  })
  injectionHour?: number;

  @ApiProperty({
    description: 'injectionMinute. ADD TO PROPERTY METADATA',
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('LINEAR-19-A', {
        type: args.value,
        key: KEY,
      });
    },
  })
  @IsInRange(MIN_MINUTE, MAX_MINUTE, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('LINEAR-19-A', {
        type: args.value,
        key: KEY,
      });
    },
  })
  injectionMinute: number;

  @ApiProperty({
    description: 'measuredValue. ADD TO PROPERTY METADATA',
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('LINEAR-20-A', {
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
  @IsInRange(-9999999999.999, 9999999999.999, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of -9999999999.999 and 9999999999.999 for [${KEY}].`;
    },
  })
  measuredValue?: number;

  @ApiProperty({
    description: 'referenceValue. ADD TO PROPERTY METADATA',
  })
  @IsOptional()
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('LINEAR-21-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsNotNegative({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('LINEAR-21-B', {
        value: args.value,
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
  @IsInRange(-9999999999.999, 9999999999.999, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of 0 and 9999999999.999 for [${KEY}].`;
    },
  })
  referenceValue?: number;
}

export class LinearityInjectionRecordDTO extends LinearityInjectionBaseDTO {
  id: string;
  linSumId: string;
  userId: string;
  addDate: string;
  updateDate: string;
}

export class LinearityInjectionImportDTO extends LinearityInjectionBaseDTO {}

export class LinearityInjectionDTO extends LinearityInjectionRecordDTO {}
