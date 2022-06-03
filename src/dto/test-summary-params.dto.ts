import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import { IsValidCode } from '../pipes/is-valid-code.pipe';
import { TestTypeCodes } from '../enums/test-type-code.enum';
import { TestTypeCode } from './../entities/test-type-code.entity';

export class TestSummaryParamsDTO {
  @ApiProperty({
    enum: TestTypeCodes,
    description: 'Test Type Code. ADD TO PROPERTY METADATA',
  })
  @IsValidCode(TestTypeCode, {
    each: true,
    message: 'Invalid Test Type Code',
  })
  @Transform(({ value }) => value.split('|').map((item: string) => item.trim()))
  testTypeCode?: string[];
}
