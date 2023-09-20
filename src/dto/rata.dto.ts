import { ApiProperty } from '@nestjs/swagger';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
  ValidationArguments,
} from 'class-validator';
import { RataSummaryDTO, RataSummaryImportDTO } from './rata-summary.dto';
import { IsInRange, IsValidCode } from '@us-epa-camd/easey-common/pipes';
import { RataFrequencyCode } from '../entities/workspace/rata-frequency-code.entity';

const KEY = 'RATA';

export class RataBaseDTO {
  @ApiProperty({
    description: 'NumberOfLoadLevels. ADD TO PROPERTY METADATA',
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('RATA-102-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsInt()
  @IsInRange(0, 9, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of 0 and 9 for [${KEY}].`;
    },
  })
  numberOfLoadLevels?: number;

  @ApiProperty({
    description: 'relativeAccuracy. ADD TO PROPERTY METADATA',
  })
  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message: (args: ValidationArguments) => {
        return `The value of [${args.value}] for [${args.property}] is allowed only 2 decimal place for $[${KEY}].`;
      },
    },
  )
  @IsInRange(0, 999.99, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of 0 and 999.99 for [${KEY}].`;
    },
  })
  relativeAccuracy?: number;

  @ApiProperty({
    description: 'rataFrequencyCode. ADD TO PROPERTY METADATA',
  })
  @IsOptional()
  @IsString()
  @IsValidCode(RataFrequencyCode, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] is invalid for [${KEY}]`;
    },
  })
  rataFrequencyCode?: string;

  @ApiProperty({
    description: 'overallBiasAdjustmentFactor. ADD TO PROPERTY METADATA',
  })
  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 3 },
    {
      message: (args: ValidationArguments) => {
        return `The value of [${args.value}] for [${args.property}] is allowed only 3 decimal place for $[${KEY}].`;
      },
    },
  )
  @IsInRange(0, 99.999, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of 0 and 99.999 for [${KEY}].`;
    },
  })
  overallBiasAdjustmentFactor?: number;
}

export class RataRecordDTO extends RataBaseDTO {
  id: string;
  testSumId: string;
  calculatedRataFrequencyCode: string;
  calculatedRelativeAccuracy: number;
  calculatedOverallBiasAdjustmentFactor: number;
  calculatedNumberOfLoadLevel: number;
  userId: string;
  addDate: string;
  updateDate: string;
}

export class RataImportDTO extends RataBaseDTO {
  @ValidateNested({ each: true })
  @Type(() => RataSummaryImportDTO)
  rataSummaryData: RataSummaryImportDTO[];
}

export class RataDTO extends RataRecordDTO {
  rataSummaryData: RataSummaryDTO[];
}
