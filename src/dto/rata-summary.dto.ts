import { ApiProperty } from '@nestjs/swagger';
import { ApsCode } from '../entities/workspace/aps-code.entity';
import { ReferenceMethodCode } from '../entities/workspace/reference-method-code.entity';
import { OperatingLevelCode } from '../entities/workspace/operating-level-code.entity';
import { IsValidCode } from '../pipes/is-valid-code.pipe';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  ValidateIf,
  ValidateNested,
  ValidationArguments,
} from 'class-validator';
import { RataRunDTO, RataRunImportDTO } from './rata-run.dto';
import { dataDictionary, getMetadata, MetadataKeys } from '../data-dictionary';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { Type } from 'class-transformer';
import { IsNotNegative } from '../pipes/is-not-negative.pipe';
import { IsInRange } from '@us-epa-camd/easey-common/pipes';

const KEY = 'RATA Summary';

export class RataSummaryBaseDTO {
  @ApiProperty({
    description: 'operatingLevelCode. ADD TO PROPERTY METADATA',
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('RATA-112-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsValidCode(OperatingLevelCode, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('RATA-112-B', {
        fieldname: args.property,
      });
    },
  })
  operatingLevelCode: string;

  @ApiProperty(
    getMetadata(dataDictionary.averageGrossUnitLoad, MetadataKeys.RATA_SUMMARY),
  )
  @IsOptional()
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('RATA-23-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsInRange(
    0,
    20000,
    {
      message: (args: ValidationArguments) => {
        return CheckCatalogService.formatResultMessage('RATA-23-B', {
          fieldname: args.property,
          key: KEY,
        });
      },
    },
    false,
    false,
  )
  averageGrossUnitLoad?: number;

  @ApiProperty({
    description: 'referenceMethodCode. ADD TO PROPERTY METADATA',
  })
  @IsOptional()
  @IsValidCode(ReferenceMethodCode, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('RATA-16-B', {
        value: args.value,
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  referenceMethodCode?: string;

  @ApiProperty({
    description: 'meanCEMValue. ADD TO PROPERTY METADATA',
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('RATA-17-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsNumber()
  meanCEMValue?: number;

  @ApiProperty({
    description: 'meanRATAReferenceValue. ADD TO PROPERTY METADATA',
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('RATA-18-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsPositive(
    {
      message: (args: ValidationArguments) => {
        return CheckCatalogService.formatResultMessage('RATA-18-B', {
          fieldname: args.property,
          key: KEY,
        });
      },
    },
  )
  meanRATAReferenceValue?: number;

  @ApiProperty({
    description: 'meanDifference. ADD TO PROPERTY METADATA',
  })
  @IsOptional()
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('RATA-19-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsNumber()
  meanDifference?: number;

  @ApiProperty({
    description: 'standardDeviationDifference. ADD TO PROPERTY METADATA',
  })
  @IsOptional()
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('RATA-20-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsNumber()
  standardDeviationDifference?: number;

  @ApiProperty({
    description: 'confidenceCoefficient. ADD TO PROPERTY METADATA',
  })
  @IsOptional()
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('RATA-21-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsNumber()
  confidenceCoefficient?: number;

  @ApiProperty({
    description: 'tValue. ADD TO PROPERTY METADATA',
  })
  @IsOptional()
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('RATA-22-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsNumber()
  tValue?: number;

  @ApiProperty(
    getMetadata(dataDictionary.apsIndicator, MetadataKeys.RATA_SUMMARY),
  )
  @IsOptional()
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('RATA-123-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsNumber()
  apsIndicator?: number;

  @ApiProperty(getMetadata(dataDictionary.apsCode, MetadataKeys.RATA_SUMMARY))
  @IsOptional()
  @IsValidCode(ApsCode, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatMessage(
        `[errorCode] - You reported the value [value], which is not in the list of valid values, in the field [fieldname] for [key].`,
        {
          errorCode: 'RATA-131-C',
          value: args.value,
          fieldname: args.property,
          key: KEY,
        },
      );
    },
  })
  apsCode?: string;

  @ApiProperty({
    description: 'relativeAccuracy. ADD TO PROPERTY METADATA',
  })
  @IsOptional()
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('RATA-24-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsNotNegative({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('RATA-24-B', {
        value: args.value,
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  relativeAccuracy?: number;

  @ApiProperty({
    description: 'biasAdjustmentFactor. ADD TO PROPERTY METADATA',
  })
  @IsOptional()
  @IsNumber()
  biasAdjustmentFactor?: number;

  @ApiProperty({
    description: 'co2OrO2ReferenceMethodCode. ADD TO PROPERTY METADATA',
  })
  @IsOptional()
  @IsValidCode(ReferenceMethodCode, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatMessage(
        'You reported the value [value], which is not in the list of valid values, in the field [fieldname] for [key].',
        {
          value: args.value,
          fieldname: args.property,
          key: KEY,
        },
      );
    },
  })
  @ValidateIf(o => o.co2OrO2ReferenceMethodCode !== null)
  co2OrO2ReferenceMethodCode?: string;

  @ApiProperty({
    description: 'stackDiameter. ADD TO PROPERTY METADATA',
  })
  @IsOptional()
  @IsNumber()
  stackDiameter?: number;

  @ApiProperty({
    description: 'stackArea. ADD TO PROPERTY METADATA',
  })
  @IsOptional()
  @IsNumber()
  stackArea?: number;

  @ApiProperty({
    description: 'numberOfTraversePoints. ADD TO PROPERTY METADATA',
  })
  @IsOptional()
  @IsNumber()
  numberOfTraversePoints?: number;

  @ApiProperty({
    description: 'calculatedWAF. ADD TO PROPERTY METADATA',
  })
  @IsOptional()
  @IsNumber()
  calculatedWAF?: number;

  @ApiProperty({
    description: 'defaultWAF. ADD TO PROPERTY METADATA',
  })
  @IsOptional()
  @IsNumber()
  defaultWAF?: number;
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
  rataRunData: RataRunDTO[];
}
