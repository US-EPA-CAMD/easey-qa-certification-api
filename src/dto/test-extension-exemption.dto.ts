import { ApiProperty } from '@nestjs/swagger';
import { RequireOne } from '../pipes/require-one.pipe';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import { IsInRange } from '@us-epa-camd/easey-common/pipes';
import { ValidateIf, ValidationArguments } from 'class-validator';
import { YEAR_QUARTER_TEST_TYPE_CODES } from '../utilities/constants';
import { IsValidCode } from '../pipes/is-valid-code.pipe';
import { SpanScaleCode } from '../entities/span-scale-code.entity';

const KEY = 'Test Extension Exemption';

export class TestExtensionExemptionBaseDTO {
  @ApiProperty({
    description: 'Stack Pipe Identifier. ADD TO PROPERTY METADATA',
  })
  @RequireOne('unitId', {
    message:
      'A Unit or Stack Pipe identifier (NOT both) must be provided for each Test Summary.',
  })
  stackPipeId?: string;

  @ApiProperty({
    description: propertyMetadata.unitId.description,
  })
  unitId?: string;

  @ApiProperty({
    description: propertyMetadata.year.description,
  })
  @IsInRange(1993, new Date().getFullYear(), {
    message: (args: ValidationArguments) => {
      return `Year must be greater than or equal to 1993 and less than or equal to ${new Date().getFullYear()}. You reported an invalid year of [${
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
  @ValidateIf(o => YEAR_QUARTER_TEST_TYPE_CODES.includes(o.testTypeCode))
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
  @ValidateIf(o => YEAR_QUARTER_TEST_TYPE_CODES.includes(o.testTypeCode))
  quarter: number;

  @ApiProperty({
    description: propertyMetadata.monitorSystemDTOId.description,
  })
  monitoringSystemID?: string;

  @ApiProperty({
    description: propertyMetadata.componentDTOComponentId.description,
  })
  componentID?: string;

  hoursUsed?: number;

  @ApiProperty({
    description: propertyMetadata.monitorSpanDTOSpanScaleCode.description,
  })
  @IsValidCode(SpanScaleCode, {
    message: (args: ValidationArguments) => {
      return `You reported an invalid Span Scale Code of [${
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
  spanScaleCode?: string;

  fuelCode?: string;
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
}

export class TestExtensionExemptionImportDTO extends TestExtensionExemptionBaseDTO {}

export class TestExtensionExemptionDTO extends TestExtensionExemptionRecordDTO {}
