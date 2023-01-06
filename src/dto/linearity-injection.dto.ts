import { ApiProperty } from '@nestjs/swagger';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
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
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('LINEAR-19-A', {
        type: args.value,
        key: KEY,
      });
    },
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
  measuredValue: number;

  @ApiProperty({
    description: 'referenceValue. ADD TO PROPERTY METADATA',
  })
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
