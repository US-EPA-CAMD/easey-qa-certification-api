import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { ValidationArguments } from 'class-validator';

import { IsValidDate, IsIsoFormat } from '@us-epa-camd/easey-common/pipes';
import { FindOneOptions, In } from 'typeorm';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';

import { IsInDateRange } from '../pipes/is-in-date-range.pipe';
import { IsValidCodes } from '../pipes/is-valid-codes.pipe';

import { TestTypeCode } from '../entities/test-type-code.entity';
import { TestTypeCodes } from '../enums/test-type-code.enum';
import { SystemTypeCode } from '../entities/system-type-code.entity';
import { SystemTypeCodes } from '../enums/system-type-code.enum';
import { dataDictionary, getMetadata, MetadataKeys } from '../data-dictionary';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';

const MIN_DATE = '1993-01-01';
const DATE_FORMAT = 'YYYY-MM-DD';
const KEY = 'Test Summary Params';

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
        return `You reported the value of [${args.value}] for [${args.property}], all or some of the codes are not in the list of valid values.`;
      },
    },
  )
  testTypeCodes?: string[];

  @ApiProperty({
    isArray: true,
    enum: SystemTypeCodes,
    //description: propertyMetadata.systemTypeCode.description,
  })
  @Transform(({ value }) => value.split('|').map((item: string) => item.trim()))
  @IsValidCodes(
    SystemTypeCode,
    (args: ValidationArguments): FindOneOptions<SystemTypeCode> => {
      return { where: { systemTypeCode: In(args.value) } };
    },
    {
      message: (args: ValidationArguments) => {
        return `The database does not contain any System Type Codewith ${args.value}`;
      },
    },
  )
  systemTypeCodes?: string[];

  @ApiProperty({
    description: getMetadata(
      dataDictionary.beginDate,
      MetadataKeys.TEST_SUMMARY,
    ).description,
  })
  @IsValidDate({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatMessage(
        `Begin Date must be a valid date in the format of ${DATE_FORMAT}. You reported an invalid date of [value]`,
        {
          value: args.value,
        },
      );
    },
  })
  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatMessage(
        `You reported [fieldname] which must be a valid ISO date format of ${DATE_FORMAT} for [key].`,
        {
          fieldname: args.property,
          key: KEY,
        },
      );
    },
  })
  @IsInDateRange(MIN_DATE, null, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatMessage(
        `Begin Date must be greater than or equal to ${MIN_DATE} and less than or equal to the current date.`,
      );
    },
  })
  beginDate?: Date;

  @ApiProperty({
    description: propertyMetadata.endDate.description,
  })
  @IsValidDate({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatMessage(
        `End Date must be a valid date in the format of ${DATE_FORMAT}. You reported an invalid date of [value]`,
        {
          value: args.value,
        },
      );
    },
  })
  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatMessage(
        `You reported [fieldname] which must be a valid ISO date format of ${DATE_FORMAT} for [key].`,
        {
          fieldname: args.property,
          key: KEY,
        },
      );
    },
  })
  @IsInDateRange(MIN_DATE, null, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatMessage(
        `End Date must be greater than or equal to ${MIN_DATE} and less than or equal to the current date.`,
      );
    },
  })
  endDate?: Date;
}
