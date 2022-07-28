import { ApiProperty } from '@nestjs/swagger';
import { IsInRange } from '@us-epa-camd/easey-common/pipes';
import { IsNotEmpty, ValidationArguments } from 'class-validator';
import { IsNotNegative } from '../pipes/is-not-negative.pipe';

const KEY = 'Linearity Injection';
const MIN_MINUTE = 0;
const MAX_MINUTE = 59;
const MIN_HOUR = 0;
const MAX_HOUR = 23;

export class LinearityInjectionBaseDTO {
  @ApiProperty({
    description: 'injectionDate. ADD TO PROPERTY METADATA',
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return `You did not provide [${args.property}], which is required for [${KEY}].`;
    },
  })
  injectionDate: Date;

  @ApiProperty({
    description: 'injectionHour. ADD TO PROPERTY METADATA',
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return `You did not provide [${args.property}], which is required for [${KEY}].`;
    },
  })
  @IsInRange(MIN_HOUR, MAX_HOUR, {
    message: (args: ValidationArguments) =>
      `The value [${args.value}] in the field [injectionHour] for [${KEY}] is not within the range of valid values from [${MIN_HOUR}] to [${MAX_HOUR}].`,
  })
  injectionHour: number;

  @ApiProperty({
    description: 'injectionMinute. ADD TO PROPERTY METADATA',
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return `You did not provide [${args.property}], which is required for [${KEY}].`;
    },
  })
  @IsInRange(MIN_MINUTE, MAX_MINUTE, {
    message: (args: ValidationArguments) =>
      `The value [${args.value}] in the field [injectionMinute] for [${KEY}] is not within the range of valid values from [${MIN_MINUTE}] to [${MAX_MINUTE}].`,
  })
  injectionMinute: number;

  @ApiProperty({
    description: 'measuredValue. ADD TO PROPERTY METADATA',
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return `You did not provide [${args.property}], which is required for [${KEY}].`;
    },
  })
  measuredValue: number;

  @ApiProperty({
    description: 'referenceValue. ADD TO PROPERTY METADATA',
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return `You did not provide [${args.property}], which is required for [${KEY}].`;
    },
  })
  @IsNotNegative({
    message: (args: ValidationArguments) => {
      return `The value [${args.value}] in the field [${args.property}] for [${KEY}] is not within the range of valid values. This value must be greater than or equal to zero.`;
    },
  })
  referenceValue: number;
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
