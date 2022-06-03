import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import { TestTypeCodes } from '../enums/test-type-code.enum';
import { IsTestTypeCode } from '../pipes/is-test-type-code.pipe';

export class TestSummaryParamsDTO {
  @ApiProperty({
    enum: TestTypeCodes,
    description: 'Test Type Code. ADD TO PROPERTY METADATA',
  })
  @IsTestTypeCode({
    each: true,
    message: 'Invalid Test Type Code',
  })
  @Transform(({ value }) => value.split('|').map((item: string) => item.trim()))
  testTypeCode?: string[];
}
