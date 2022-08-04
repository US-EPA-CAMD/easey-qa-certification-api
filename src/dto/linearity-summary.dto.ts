import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, ValidationArguments } from 'class-validator';
import { IsValidCode } from '../pipes/is-valid-code.pipe';
import { IsNotNegative } from '../pipes/is-not-negative.pipe';
import {
  LinearityInjectionImportDTO,
  LinearityInjectionDTO,
} from './linearity-injection.dto';
import { GasLevelCode } from '../entities/workspace/gas-level-code.entity';

const KEY = 'Linearity Summary';

export class LinearitySummaryBaseDTO {
  @ApiProperty({
    description: 'gasLevelCode. ADD TO PROPERTY METADATA',
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return `You did not provide [${args.property}], which is required for [${KEY}].`;
    },
  })
  @IsValidCode(GasLevelCode, {
    message: (args: ValidationArguments) => {
      return `You reported an invalid gas level code of [${args.value}].`;
    },
  })
  gasLevelCode: string;

  @ApiProperty({
    description: 'meanMeasuredValue. ADD TO PROPERTY METADATA',
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return `You did not provide [${args.property}], which is required for [${KEY}].`;
    },
  })
  meanMeasuredValue: number;

  @ApiProperty({
    description: 'meanReferenceValue. ADD TO PROPERTY METADATA',
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
  meanReferenceValue: number;

  @ApiProperty({
    description: 'percentError. ADD TO PROPERTY METADATA',
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
  percentError: number;

  @ApiProperty({
    description: 'apsIndicator. ADD TO PROPERTY METADATA',
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return `You did not provide [${args.property}], which is required for [${KEY}].`;
    },
  })
  apsIndicator: number;
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
  linearityInjectionData: LinearityInjectionImportDTO[];
}

export class LinearitySummaryDTO extends LinearitySummaryRecordDTO {
  linearityInjectionData: LinearityInjectionDTO[];
}
