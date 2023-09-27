import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  ValidateNested,
  ValidationArguments,
} from 'class-validator';
import { Type } from 'class-transformer';

import { IsValidCode } from '../pipes/is-valid-code.pipe';
import { IsNotNegative } from '../pipes/is-not-negative.pipe';
import {
  LinearityInjectionImportDTO,
  LinearityInjectionDTO,
} from './linearity-injection.dto';
import { GasLevelCode } from '../entities/workspace/gas-level-code.entity';
import { dataDictionary, getMetadata, MetadataKeys } from '../data-dictionary';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { IsInRange } from '@us-epa-camd/easey-common/pipes';

const KEY = 'Linearity Summary';

export class LinearitySummaryBaseDTO {
  @ApiProperty({
    description: 'gasLevelCode. ADD TO PROPERTY METADATA',
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('LINEAR-15-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsValidCode(GasLevelCode, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('LINEAR-15-B', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  gasLevelCode: string;

  @ApiProperty({
    description: 'meanMeasuredValue. ADD TO PROPERTY METADATA',
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('LINEAR-16-A', {
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
  meanMeasuredValue?: number;

  @ApiProperty({
    description: 'meanReferenceValue. ADD TO PROPERTY METADATA',
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('LINEAR-17-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsNotNegative({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('LINEAR-17-B', {
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
  @IsInRange(0, 9999999999.999, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of 0 and 9999999999.999 for [${KEY}].`;
    },
  })
  meanReferenceValue?: number;

  @ApiProperty({
    description: 'percentError. ADD TO PROPERTY METADATA',
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('LINEAR-18-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsNotNegative({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('LINEAR-18-B', {
        value: args.value,
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
  @IsInRange(-9999.9, 9999.9, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of -9999.9 and 9999.9 for [${KEY}].`;
    },
  })
  percentError?: number;

  @ApiProperty(
    getMetadata(dataDictionary.apsIndicator, MetadataKeys.LINEARITY_SUMMARY),
  )
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('LINEAR-37-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsInRange(0, 1, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of 0 and 1 for [${KEY}].`;
    },
  })
  apsIndicator?: number;
}

export class LinearitySummaryRecordDTO extends LinearitySummaryBaseDTO {
  id: string;
  testSumId: string;
  calculatedMeanReferenceValue: number;
  calculatedMeanMeasuredValue: number;
  calculatedPercentError: number;
  calculatedAPSIndicator: number;
  userId: string;
  addDate: string;
  updateDate: string;
}

export class LinearitySummaryImportDTO extends LinearitySummaryBaseDTO {
  @ValidateNested({ each: true })
  @Type(() => LinearityInjectionImportDTO)
  linearityInjectionData: LinearityInjectionImportDTO[];
}

export class LinearitySummaryDTO extends LinearitySummaryRecordDTO {
  linearityInjectionData: LinearityInjectionDTO[];
}
