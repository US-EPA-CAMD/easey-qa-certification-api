import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { ValidationArguments } from 'class-validator';

import { IsValidDate, IsIsoFormat } from '@us-epa-camd/easey-common/pipes';
import { FindOneOptions, In } from 'typeorm';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';

import { IsInDateRange } from '../pipes/is-in-date-range.pipe';
import { IsValidCodes } from '../pipes/is-valid-codes.pipe';

import { TestTypeCode } from './../entities/test-type-code.entity';
import { TestTypeCodes } from '../enums/test-type-code.enum';
import { dataDictionary, getMetadata, MetadataKeys } from '../data-dictionary';

const MIN_DATE = '1993-01-01';
const DATE_FORMAT = 'YYYY-MM-DD';

export class TestSummaryParamsDTO {
  @ApiProperty({
    isArray: true,
    enum: TestTypeCodes,
    description: propertyMetadata.testTypeCode.description,
  })
  @Transform(({ value }) => value.split('|').map((item: string) => item.trim()))
  @IsValidCodes(
    TestTypeCode,
    (args: ValidationArguments): FindOneOptions<TestTypeCode> => {
      return { where: { testTypeCode: In(args.value) } };
    },
    {
      message: (args: ValidationArguments) => {
        return `The database does not contain any Test Type Code with ${args.value}`;
      },
    },
  )
  testTypeCodes?: string[];

  @ApiProperty({
    description: getMetadata(
      dataDictionary.beginDate,
      MetadataKeys.TEST_SUMMARY,
    ).description,
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
    description: propertyMetadata.endDate.description,
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
