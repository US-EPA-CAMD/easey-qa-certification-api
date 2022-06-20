import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import {
  ErrorMessages,
  propertyMetadata,
} from '@us-epa-camd/easey-common/constants';

import { IsOrisCode } from '@us-epa-camd/easey-common/pipes';

import { OneOrMore } from '../pipes/one-or-more.pipe';
import { IsValidCode } from '../pipes/is-valid-code.pipe';
import { TestTypeCodes } from '../enums/test-type-code.enum';
import { TestTypeCode } from '../entities/test-type-code.entity';

export class QACertificationParamsDTO {
  @ApiProperty({
    description: propertyMetadata.facilityId.description,
  })
  @IsOrisCode({
    message: ErrorMessages.UnitCharacteristics(true, 'facilityId'),
  })
  facilityId: number;

  @ApiProperty({
    isArray: true,
    description: propertyMetadata.unitId.description,
  })
  @Transform(({ value }) => value.split('|').map((item: string) => item.trim()))
  unitIds?: string[];

  @ApiProperty({
    isArray: true,
    description: 'Unique identifier for each stack/pipe at a facility. ADD TO PROPERTY METADATA',
  })
  @OneOrMore('unitIds', {
    message: 'At least one Unit or Stack Pipe identifier is required'
  })
  @Transform(({ value }) => value.split('|').map((item: string) => item.trim()))
  stackPipeIds?: string[];

  @ApiProperty({
    enum: TestTypeCodes,
    description: 'Test Type Code. ADD TO PROPERTY METADATA',
  })
  @IsValidCode(TestTypeCode, {
    message: 'Invalid Test Type Code',
  })
  testTypeCode?: string;

  @ApiProperty({
    description: 'Test Number. ADD TO PROPERTY METADATA',
  })
  testNumber?: string;
}
