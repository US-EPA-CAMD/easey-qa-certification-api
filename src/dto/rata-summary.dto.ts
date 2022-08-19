import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Min, ValidationArguments } from 'class-validator';
import { RataRunImportDTO } from './rata-run.dto';

const KEY = 'RATA Summary';

export class RataSummaryBaseDTO {
  @ApiProperty({
    description: 'relativeAccuracy. ADD TO PROPERTY METADATA',
  })
  relativeAccuracy: number;

  @ApiProperty({
    description: 'biasAdjustmentFactor. ADD TO PROPERTY METADATA',
  })
  biasAdjustmentFactor: number;

  @ApiProperty({
    description: 'meanCEMValue. ADD TO PROPERTY METADATA',
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return `RATA-17: You did not provide [${args.property}], which is required for [${KEY}].`;
    },
  })
  meanCEMValue: number;

  @ApiProperty({
    description: 'meanRataReferenceValue. ADD TO PROPERTY METADATA',
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return `RATA-18: You did not provide [${args.property}], which is required for [${KEY}].`;
    },
  })
  @Min(1, {
    message: (args: ValidationArguments) => {
      return `RATA-18: You defined an invalid [${args.property}] for [${KEY}]. This value must be greater than zero and
      less than 20,000.`;
    },
  })
  meanRataReferenceValue: number;

  @ApiProperty({
    description: 'operatingLevelCode. ADD TO PROPERTY METADATA',
  })
  operatingLevelCode: string;

  @ApiProperty({
    description: 'meanDifference. ADD TO PROPERTY METADATA',
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return `RATA-19: You did not provide [${args.property}], which is required for [${KEY}].`;
    },
  })
  meanDifference: number;

  @ApiProperty({
    description: 'defaultWaf. ADD TO PROPERTY METADATA',
  })
  defaultWaf: number;

  @ApiProperty({
    description: 'averageGrossUnitLoad. ADD TO PROPERTY METADATA',
  })
  averageGrossUnitLoad: number;

  @ApiProperty({
    description: 'apsIndicator. ADD TO PROPERTY METADATA',
  })
  apsIndicator: number;

  @ApiProperty({
    description: 'standardDeviationDifference. ADD TO PROPERTY METADATA',
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return `RATA-20: You did not provide [${args.property}], which is required for [${KEY}].`;
    },
  })
  standardDeviationDifference: number;

  @ApiProperty({
    description: 'confidenceCoefficent. ADD TO PROPERTY METADATA',
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return `RATA-21: You did not provide [${args.property}], which is required for [${KEY}].`;
    },
  })
  confidenceCoefficent: number;

  @ApiProperty({
    description: 'co2OrO2ReferenceMethodCode. ADD TO PROPERTY METADATA',
  })
  co2OrO2ReferenceMethodCode: string;

  @ApiProperty({
    description: 'referenceMethodCode. ADD TO PROPERTY METADATA',
  })
  referenceMethodCode: string;

  @ApiProperty({
    description: 'tValue. ADD TO PROPERTY METADATA',
  })
  tValue: number;

  @ApiProperty({
    description: 'stackDiameter. ADD TO PROPERTY METADATA',
  })
  stackDiameter: number;

  @ApiProperty({
    description: 'stackArea. ADD TO PROPERTY METADATA',
  })
  stackArea: number;

  @ApiProperty({
    description: 'calculatedWaf. ADD TO PROPERTY METADATA',
  })
  calculatedWaf: number;

  @ApiProperty({
    description: 'numberOfTraversePoints. ADD TO PROPERTY METADATA',
  })
  numberOfTraversePoints: number;

  @ApiProperty({
    description: 'apsCode. ADD TO PROPERTY METADATA',
  })
  apsCode: string;
}

export class RataSummaryRecordDTO extends RataSummaryBaseDTO {
  id: string;
  rataId: string;
  calculatedRelativeAccuracy: number;
  calculatedBiasAdjustmentFactor: number;
  calculatedMeanCEMValue: number;
  calculatedMeanRataReferenceValue: number;
  calculatedMeanDifference: number;
  calculatedAverageGrossUnitLoad: number;
  calculatedApsIndicator: number;
  calculatedStandardDeviationDifference: number;
  calculatedConfidenceCoefficent: number;
  calculatedTValue: number;
  calculatedStackArea: number;
  calculatedCalculatedWaf: number;
  userId: string;
  addDate: string;
  updateDate: string;
}

export class RataSummaryImportDTO extends RataSummaryBaseDTO {
  rataRunData: RataRunImportDTO[];
}
export class RataSummaryDTO extends RataSummaryBaseDTO {
  rataRunData: RataRunImportDTO[];
}
