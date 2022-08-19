import { ApiProperty } from '@nestjs/swagger';
import { ValidationArguments } from 'class-validator';
import { ApsCode } from '../entities/workspace/aps-code.entity';
import { ReferenceMethodCode } from '../entities/workspace/reference-method-code.entity';
import { OperatingLevelCode } from '../entities/workspace/operating-level-code.entity';
import { IsValidCode } from '../pipes/is-valid-code.pipe';
import { DbLookup } from '../pipes/db-lookup.pipe';
import { FindOneOptions } from 'typeorm';

const KEY = 'RATA Summary';

export class RataSummaryBaseDTO {
  @ApiProperty({
    description: 'operatingLevelCode. ADD TO PROPERTY METADATA',
  })
  @IsValidCode(OperatingLevelCode, {
    message: (args: ValidationArguments) => {
      return `You reported the value [${args.value}], which is not in the list of valid values, in the field [${args.property}] for [${KEY}].`;
    },
  })
  operatingLevelCode: string;

  @ApiProperty({
    description: 'averageGrossUnitLoad. ADD TO PROPERTY METADATA',
  })
  averageGrossUnitLoad: number;

  @ApiProperty({
    description: 'referenceMethodCode. ADD TO PROPERTY METADATA',
  })
  @DbLookup(
    ReferenceMethodCode,
    (args: ValidationArguments): FindOneOptions<ReferenceMethodCode> => {
      return { where: { referenceMethodCode: args.value } };
    },
    {
      message: (args: ValidationArguments) => {
        return `You reported the value [${args.value}], which is not in the list of valid values, in the field [${args.property}] for [${KEY}].`;
      },
    },
  )
  referenceMethodCode: string;

  @ApiProperty({
    description: 'meanCEMValue. ADD TO PROPERTY METADATA',
  })
  meanCEMValue: number;

  @ApiProperty({
    description: 'meanRATAReferenceValue. ADD TO PROPERTY METADATA',
  })
  meanRATAReferenceValue: number;

  @ApiProperty({
    description: 'meanDifference. ADD TO PROPERTY METADATA',
  })
  meanDifference: number;

  @ApiProperty({
    description: 'standardDeviationDifference. ADD TO PROPERTY METADATA',
  })
  standardDeviationDifference: number;

  @ApiProperty({
    description: 'confidenceCoefficient. ADD TO PROPERTY METADATA',
  })
  confidenceCoefficient: number;

  @ApiProperty({
    description: 'tValue. ADD TO PROPERTY METADATA',
  })
  tValue: number;

  @ApiProperty({
    description: 'apsIndicator. ADD TO PROPERTY METADATA',
  })
  apsIndicator: number;

  @ApiProperty({
    description: 'apsCode. ADD TO PROPERTY METADATA',
  })
  @IsValidCode(ApsCode, {
    message: (args: ValidationArguments) => {
      return `You reported the value [${args.value}], which is not in the list of valid values, in the field [${args.property}] for [${KEY}].`;
    },
  })
  apsCode: string;

  @ApiProperty({
    description: 'relativeAccuracy. ADD TO PROPERTY METADATA',
  })
  relativeAccuracy: number;

  @ApiProperty({
    description: 'biasAdjustmentFactor. ADD TO PROPERTY METADATA',
  })
  biasAdjustmentFactor: number;

  @ApiProperty({
    description: 'co2OrO2ReferenceMethodCode. ADD TO PROPERTY METADATA',
  })
  @DbLookup(
    ReferenceMethodCode,
    (args: ValidationArguments): FindOneOptions<ReferenceMethodCode> => {
      return { where: { referenceMethodCode: args.value } };
    },
    {
      message: (args: ValidationArguments) => {
        return `You reported the value [${args.value}], which is not in the list of valid values, in the field [${args.property}] for [${KEY}].`;
      },
    },
  )
  co2OrO2ReferenceMethodCode: string;

  @ApiProperty({
    description: 'stackDiameter. ADD TO PROPERTY METADATA',
  })
  stackDiameter: number;

  @ApiProperty({
    description: 'stackArea. ADD TO PROPERTY METADATA',
  })
  stackArea: number;

  @ApiProperty({
    description: 'numberOfTraversePoints. ADD TO PROPERTY METADATA',
  })
  numberOfTraversePoints: number;

  @ApiProperty({
    description: 'calculatedWAF. ADD TO PROPERTY METADATA',
  })
  calculatedWAF: number;

  @ApiProperty({
    description: 'defaultWAF. ADD TO PROPERTY METADATA',
  })
  defaultWAF: number;
}

export class RataSummaryRecordDTO extends RataSummaryBaseDTO {
  id: string;
  rataId: string;
  calculatedAverageGrossUnitLoad: number;
  calculatedMeanCEMValue: number;
  calculatedMeanRATAReferenceValue: number;
  calculatedMeanDifference: number;
  calculatedStandardDeviationDifference: number;
  calculatedConfidenceCoefficient: number;
  calculatedTValue: number;
  calculatedApsIndicator: number;
  calculatedRelativeAccuracy: number;
  calculatedBiasAdjustmentFactor: number;
  calculatedStackArea: number;
  calculatedCalculatedWAF: number;
  userId: string;
  addDate: string;
  updateDate: string;
}

export class RataSummaryImportDTO extends RataSummaryBaseDTO {}

export class RataSummaryDTO extends RataSummaryRecordDTO {}
