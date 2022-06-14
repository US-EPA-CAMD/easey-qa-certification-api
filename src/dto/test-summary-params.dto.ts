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
    message: 'Invalid Test Type Code',
  })
  testTypeCode?: string;
}
