import { ApiProperty } from '@nestjs/swagger';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
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
      return CheckCatalogService.formatResultMessage('RATA-102-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsNumber()
  numberOfLoadLevels: number;

  @ApiProperty({
    description: 'relativeAccuracy. ADD TO PROPERTY METADATA',
  })
  @IsNumber()
  relativeAccuracy: number;

  @ApiProperty({
    description: 'rataFrequencyCode. ADD TO PROPERTY METADATA',
  })
  @IsString()
  rataFrequencyCode: string;

  @ApiProperty({
    description: 'overallBiasAdjustmentFactor. ADD TO PROPERTY METADATA',
  })
  @IsNumber()
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
  rataSummaryData: RataSummaryDTO[];
}
