import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import {
  IsOrisCode,
  IsValidDate,
  IsIsoFormat,
} from '@us-epa-camd/easey-common/pipes';

import {
  ErrorMessages,
  propertyMetadata,
} from '@us-epa-camd/easey-common/constants';

import { OneOrMore } from '../pipes/one-or-more.pipe';
import { IsValidCode } from '../pipes/is-valid-code.pipe';
import { IsInDateRange } from '../pipes/is-in-date-range';
import { TestTypeCodes } from '../enums/test-type-code.enum';
import { TestTypeCode } from './../entities/test-type-code.entity';

const MIN_DATE = '1993-01-01';
const DATE_FORMAT = 'YYYY-MM-DD';

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
    description:
      'Unique identifier for each stack/pipe at a facility. Required if no unitId provided. ADD TO PROPERTY METADATA',
  })
  @OneOrMore('unitIds', {
    message: 'At least one Unit or Stack Pipe identifier is required',
  })
  @Transform(({ value }) => value.split('|').map((item: string) => item.trim()))
  stackPipeIds?: string[];

  @ApiProperty({
    isArray: true,
    description:
      'The Test Summary ID is a unique identifier of a test summary record',
  })
  @Transform(({ value }) => value.split('|').map((item: string) => item.trim()))
  testSummaryIds?: string[];

  @ApiProperty({
    enum: TestTypeCodes,
    description: 'Test Type Code. ADD TO PROPERTY METADATA',
  })
  @IsValidCode(TestTypeCode, {
    message: 'Invalid Test Type Code',
  })
  testTypeCode?: string;

  @ApiProperty({
    description: propertyMetadata.beginDate.description,
  })
  @IsValidDate({
    message: `Begin Date must be a valid date in the format of ${DATE_FORMAT}.`,
  })
  @IsIsoFormat({
    message: `Begin Date must be a valid date in the format of ${DATE_FORMAT}.`,
  })
  @IsInDateRange('1993-01-01', null, {
    message: `Begin Date must be greater than or equal to ${MIN_DATE} and less than or equal to the current date.`,
  })
  beginDate?: Date;

  @ApiProperty({
    description: propertyMetadata.beginDate.description,
  })
  @IsValidDate({
    message: `End Date must be a valid date in the format of ${DATE_FORMAT}.`,
  })
  @IsIsoFormat({
    message: `End Date must be a valid date in the format of ${DATE_FORMAT}.`,
  })
  @IsInDateRange('1993-01-01', null, {
    message: `End Date must be greater than or equal to ${MIN_DATE} and less than or equal to the current date.`,
  })
  endDate?: Date;
}
