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
import { IsInDateRange } from '../pipes/is-in-date-range.pipe';
import { TestTypeCodes } from '../enums/test-type-code.enum';
import { TestTypeCode } from './../entities/test-type-code.entity';
import { IsValidCodes } from '../pipes/is-valid-codes.pipe';
import { ValidationArguments } from 'class-validator';
import { FindOneOptions, In } from 'typeorm';
import { dataDictionary, getMetadata, MetadataKeys } from '../data-dictionary';

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
    description: propertyMetadata.stackPipeId.description,
  })
  @OneOrMore('unitIds', {
    message: 'At least one Unit or Stack Pipe identifier is required',
  })
  @Transform(({ value }) => value.split('|').map((item: string) => item.trim()))
  stackPipeIds?: string[];

  @ApiProperty({
    isArray: true,
    description: propertyMetadata.testSummaryId.description,
  })
  @Transform(({ value }) => value.split('|').map((item: string) => item.trim()))
  testSummaryIds?: string[];

  // @ApiProperty({
  //   isArray: true,
  //   description: propertyMetadata.qaCertificationEventId.description,
  // })
  @Transform(({ value }) => value.split('|').map((item: string) => item.trim()))
  qaCertificationEventIds?: string[];

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
    isArray: true,
    /* Uncommenting the line below causes the following error:  TypeError: Cannot read properties of undefined (reading 'description')  */
    description: getMetadata(
      dataDictionary.qaTestExtensionExemptionId,
      MetadataKeys.TEST_EXTENSION_EXEMTION,
    ).description,
  })
  @Transform(({ value }) => value.split('|').map((item: string) => item.trim()))
  qaTestExtensionExemptionIds?: string[];

  @ApiProperty({
    description: getMetadata(dataDictionary.beginDate, MetadataKeys.DEFAULT)
      .description,
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
