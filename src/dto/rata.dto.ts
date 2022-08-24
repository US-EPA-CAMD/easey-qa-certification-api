import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, ValidationArguments } from 'class-validator';
import { RataFrequencyCode } from '../entities/workspace/rata-frequency-code.entity';
import { IsValidCode } from '../pipes/is-valid-code.pipe';
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
  // @IsValidCode(RataFrequencyCode, {
  //   message: (args: ValidationArguments) => {
  //     return `You reported the value [${args.value}], which is not in the list of valid values, in the field [${args.property}] for [${KEY}].`;
  //   },
  // })
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
  rataSummaryData: RataSummaryImportDTO[];
}

export class RataDTO extends RataRecordDTO {
  rataSummaryData: RataSummaryDTO[];
}
