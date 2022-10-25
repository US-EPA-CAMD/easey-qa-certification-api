import { ApiProperty } from '@nestjs/swagger';
import { ApsCode } from '../entities/workspace/aps-code.entity';
import { ReferenceMethodCode } from '../entities/workspace/reference-method-code.entity';
import { OperatingLevelCode } from '../entities/workspace/operating-level-code.entity';
import { IsValidCode } from '../pipes/is-valid-code.pipe';
import {
  IsNotEmpty,
  Min,
  ValidateNested,
  ValidationArguments,
} from 'class-validator';
import { RataRunDTO, RataRunImportDTO } from './rata-run.dto';
import { dataDictionary, getMetadata, MetadataKeys } from '../data-dictionary';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { Type } from 'class-transformer';

const KEY = 'RATA Summary';

export class RataSummaryBaseDTO {
  @ApiProperty({
    description: 'operatingLevelCode. ADD TO PROPERTY METADATA',
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return `RATA-112-A: You did not provide [${args.property}], which is required for [${KEY}].`;
    },
  })
  @IsValidCode(OperatingLevelCode, {
    message: (args: ValidationArguments) => {
      return `RATA-112-B: You reported a [${args.property}] that is not in the list of valid values.`;
    },
  })
  operatingLevelCode: string;

  @ApiProperty(
    getMetadata(dataDictionary.averageGrossUnitLoad, MetadataKeys.RATA_SUMMARY),
  )
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return `RATA-23-A: You did not provide [${args.property}], which is required for [${KEY}].`;
    },
  })
  @Min(1, {
    message: (args: ValidationArguments) => {
      return `RATA-23-B: You defined an invalid [${args.property}] for [${KEY}]. This value must be greater than zero and less than 20,000.`;
    },
  })
  averageGrossUnitLoad: number;

  @ApiProperty({
    description: 'referenceMethodCode. ADD TO PROPERTY METADATA',
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('RATA-16-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsValidCode(ReferenceMethodCode, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('RATA-16-B', {
        value: args.value,
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  referenceMethodCode: string;

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
    description: 'meanRATAReferenceValue. ADD TO PROPERTY METADATA',
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return `RATA-18-A: You did not provide [${args.property}], which is required for [${KEY}].`;
    },
  })
  @Min(1, {
    message: (args: ValidationArguments) => {
      return `RATA-18-B: You defined an invalid [${args.property}] for [${KEY}]. This value must be greater than zero and less than 20,000.`;
    },
  })
  meanRATAReferenceValue: number;

  @ApiProperty({
    description: 'meanDifference. ADD TO PROPERTY METADATA',
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return `RATA-19-A: You did not provide [${args.property}], which is required for [${KEY}].`;
    },
  })
  meanDifference: number;

  @ApiProperty({
    description: 'standardDeviationDifference. ADD TO PROPERTY METADATA',
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return `RATA-20-A: You did not provide [${args.property}], which is required for [${KEY}].`;
    },
  })
  standardDeviationDifference: number;

  @ApiProperty({
    description: 'confidenceCoefficient. ADD TO PROPERTY METADATA',
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return `RATA-21-A: You did not provide [${args.property}], which is required for [${KEY}].`;
    },
  })
  confidenceCoefficient: number;

  @ApiProperty({
    description: 'tValue. ADD TO PROPERTY METADATA',
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return `RATA-22-A: You have not reported the required value in the field [${args.property}] for [${KEY}].`;
    },
  })
  tValue: number;

  @ApiProperty(
    getMetadata(dataDictionary.apsIndicator, MetadataKeys.RATA_SUMMARY),
  )
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return `RATA-123-A: You did not provide [${args.property}], which is required for [${KEY}].`;
    },
  })
  apsIndicator: number;

  @ApiProperty(getMetadata(dataDictionary.apsCode, MetadataKeys.RATA_SUMMARY))
  @IsValidCode(ApsCode, {
    message: (args: ValidationArguments) => {
      return `You reported the value [${args.value}], which is not in the list of valid values, in the field [${args.property}] for [${KEY}].`;
    },
  })
  apsCode: string;

  @ApiProperty({
    description: 'relativeAccuracy. ADD TO PROPERTY METADATA',
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return `RATA-24-A: You did not provide [${args.property}], which is required for [${KEY}].`;
    },
  })
  @Min(0, {
    message: (args: ValidationArguments) => {
      return `RATA-24-B: The value [${args.value}] in the field [${args.property}] for [${KEY}] is not within the range of valid values. This value must be greater than or equal to zero.`;
    },
  })
  relativeAccuracy: number;

  @ApiProperty({
    description: 'biasAdjustmentFactor. ADD TO PROPERTY METADATA',
  })
  biasAdjustmentFactor: number;

  @ApiProperty({
    description: 'co2OrO2ReferenceMethodCode. ADD TO PROPERTY METADATA',
  })
  @IsValidCode(ReferenceMethodCode, {
    message: (args: ValidationArguments) => {
      return `You reported the value [${args.value}], which is not in the list of valid values, in the field [${args.property}] for [${KEY}].`;
    },
  })
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

export class RataSummaryImportDTO extends RataSummaryBaseDTO {
  @ValidateNested({ each: true })
  @Type(() => RataRunImportDTO)
  rataRunData: RataRunImportDTO[];
}
export class RataSummaryDTO extends RataSummaryRecordDTO {
  @ValidateNested({ each: true })
  @Type(() => RataRunDTO)
  rataRunData: RataRunDTO[];
}
