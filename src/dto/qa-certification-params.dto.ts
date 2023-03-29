import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import { IsOrisCode, IsIsoFormat } from '@us-epa-camd/easey-common/pipes';

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
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';

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

  @ApiProperty({
    isArray: true,
    description: propertyMetadata.qaCertificationEventId.description,
  })
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
    description: getMetadata(
      dataDictionary.qaTestExtensionExemptionId,
      MetadataKeys.TEST_EXTENSION_EXEMPTION,
    ).description,
  })
  @Transform(({ value }) => value.split('|').map((item: string) => item.trim()))
  qaTestExtensionExemptionIds?: string[];

  @ApiProperty({
    description: getMetadata(dataDictionary.beginDate, MetadataKeys.DEFAULT)
      .description,
  })
  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatMessage(
        `You reported [fieldname] which must be a valid ISO date format of ${DATE_FORMAT}.`,
        {
          fieldname: args.property,
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
  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatMessage(
        `You reported [fieldname] which must be a valid ISO date format of ${DATE_FORMAT}.`,
        {
          fieldname: args.property,
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
