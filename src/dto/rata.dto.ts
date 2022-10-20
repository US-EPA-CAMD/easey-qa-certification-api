import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  ValidateNested,
  ValidationArguments,
} from 'class-validator';
import { RataSummaryDTO, RataSummaryImportDTO } from './rata-summary.dto';

const KEY = 'RATA';

export class RataBaseDTO {
  @ApiProperty({
    description: 'NumberOfLoadLevels. ADD TO PROPERTY METADATA',
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return `[RATA-102-A] You did not provide [${args.property}], which is required for [${KEY}].`;
    },
  })
  numberOfLoadLevels: number;

  @ApiProperty({
    description: 'relativeAccuracy. ADD TO PROPERTY METADATA',
  })
  relativeAccuracy: number;

  @ApiProperty({
    description: 'rataFrequencyCode. ADD TO PROPERTY METADATA',
  })
  rataFrequencyCode: string;

  @ApiProperty({
    description: 'overallBiasAdjustmentFactor. ADD TO PROPERTY METADATA',
  })
  overallBiasAdjustmentFactor: number;
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
  @ValidateNested({ each: true })
  @Type(() => RataSummaryDTO)
  rataSummaryData: RataSummaryDTO[];
}
