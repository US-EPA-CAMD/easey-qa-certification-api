import { ApiProperty } from '@nestjs/swagger';
import { RequireOne } from '../pipes/require-one.pipe';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import {
  IsInRange,
  IsValidCode,
  MatchesRegEx,
} from '@us-epa-camd/easey-common/pipes';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
  ValidationArguments,
} from 'class-validator';
import { SpanScaleCode } from '../entities/span-scale-code.entity';
import { currentDateTime } from '@us-epa-camd/easey-common/utilities/functions';
import { FuelCode } from '../entities/fuel-code.entity';
import { FindOneOptions } from 'typeorm';
import { ExtensionExemptionCode } from '../entities/extension-exemption-code.entity';

const KEY = 'Test Extension Exemption';

export class TestExtensionExemptionBaseDTO {
  @ApiProperty({
    description: 'Stack Pipe Identifier. ADD TO PROPERTY METADATA',
  })
  @ValidateIf(o => !o.unitId)
  @RequireOne('unitId', {
    message:
      'A Unit or Stack Pipe identifier (NOT both) must be provided for each Test Summary.',
  })
  @IsString()
  @MatchesRegEx('^(C|c|M|m|X|x)(S|s|P|p)[A-z0-9\\-]{1,6}$', {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be 1 to 6 characters and only consist of upper and lower case letters, numbers starting with CS, MS, XS, CP, MP, XP for [${KEY}].`;
    },
  })
  stackPipeId: string;

  @ApiProperty({
    description: propertyMetadata.unitId.description,
  })
  @ValidateIf(o => !o.stackPipeId)
  @IsString()
  @MatchesRegEx('^[A-z0-9\\-\\*#]{1,6}$', {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be 1 to 6 characters and only consist of upper and lower case letters, numbers, and the special characters - (dash), * (asterisk), and # (pound) for [${KEY}].`;
    },
  })
  unitId: string;

  @ApiProperty({
    description: propertyMetadata.year.description,
  })
  @IsInRange(1993, currentDateTime().getFullYear(), {
    message: (args: ValidationArguments) => {
      return `Year must be greater than or equal to 1993 and less than or equal to ${currentDateTime().getFullYear()}. You reported an invalid year of [${
        args.value
      }] in Test Extension & Exemption record for Unit/Stack [${
        args.object['unitId']
          ? args.object['unitId']
          : args.object['stackPipeId']
      }].`;
    },
  })
  @IsInt()
  @IsNotEmpty()
  year: number;

  @ApiProperty({
    description: propertyMetadata.quarter.description,
  })
  @IsInRange(1, 4, {
    message: (args: ValidationArguments) => {
      return `Quarter must be a numeric number from 1 to 4. You reported an invalid quarter of [${
        args.value
      }] in Test Summary record for Unit/Stack [${
        args.object['unitId']
          ? args.object['unitId']
          : args.object['stackPipeId']
      }], Test Type Code [${args.object['testTypeCode']}], and Test Number [${
        args.object['testNumber']
      }]`;
    },
  })
  @IsInt()
  @IsNotEmpty()
  quarter: number;

  @ApiProperty({
    description: propertyMetadata.monitorSystemDTOId.description,
  })
  @IsNotEmpty()
  @IsString()
  @MatchesRegEx('^[A-Z0-9]{1,3}$', {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be 1 to 3 characters and only consist of upper case letters, numbers for [${KEY}].`;
    },
  })
  monitoringSystemId: string;

  @ApiProperty({
    description: propertyMetadata.componentDTOComponentId.description,
  })
  @IsNotEmpty()
  @IsString()
  @MatchesRegEx('^[A-Z0-9]{1,3}$', {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be 1 to 3 characters and only consist of upper case letters, numbers for [${KEY}].`;
    },
  })
  componentId: string;

  @IsOptional()
  @IsInt()
  @IsInRange(0, 2208, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be within the range of 0 and 2208 for [${KEY}].`;
    },
  })
  hoursUsed?: number;

  @ApiProperty({
    description: propertyMetadata.monitorSpanDTOSpanScaleCode.description,
  })
  @IsOptional()
  @IsValidCode(SpanScaleCode, {
    message: (args: ValidationArguments) => {
      return `You reported an invalid Span Scale Code of [${
        args.value
      }] in ${KEY} record for Unit/Stack [${
        args.object['unitId']
          ? args.object['unitId']
          : args.object['stackPipeId']
      }].`;
    },
  })
  spanScaleCode?: string;

  @IsOptional()
  @IsString()
  @IsValidCode(
    FuelCode,
    {
      message: (args: ValidationArguments) => {
        return `The value of [${args.value}] for [${
          args.property
        }] is invalid in ${KEY} record for Unit/Stack [${
          args.object['unitId']
            ? args.object['unitId']
            : args.object['stackPipeId']
        }].`;
      },
    },
    (args: ValidationArguments): FindOneOptions<FuelCode> => {
      return { where: { fuelGroupCode: 'GAS' } };
    },
  )
  fuelCode?: string;

  @IsString()
  @IsValidCode(ExtensionExemptionCode, {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${
        args.property
      }] is invalid in ${KEY} record for Unit/Stack [${
        args.object['unitId']
          ? args.object['unitId']
          : args.object['stackPipeId']
      }].`;
    },
  })
  extensionOrExemptionCode: string;
}

export class TestExtensionExemptionRecordDTO extends TestExtensionExemptionBaseDTO {
  id: string;
  locationId: string;
  reportPeriodId: number;
  checkSessionId: string;
  submissionId: string;
  submissionAvailabilityCode: string;
  pendingStatusCode: string;
  evalStatusCode: string;
  userId: string;
  addDate: string;
  updateDate: string;
  isSubmitted?: boolean;
  isSavedNotSubmitted?: boolean;
}

export class TestExtensionExemptionImportDTO extends TestExtensionExemptionBaseDTO {}

export class TestExtensionExemptionDTO extends TestExtensionExemptionRecordDTO {}
