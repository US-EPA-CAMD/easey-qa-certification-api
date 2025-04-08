import { ApiProperty } from '@nestjs/swagger';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { propertyMetadata } from '@us-epa-camd/easey-common/constants';
import {
  IsInRange,
  IsValidCode,
  IsValidDate,
} from '@us-epa-camd/easey-common/pipes';
import { currentDateTime } from '@us-epa-camd/easey-common/utilities/functions';
import {
  IsArray,
  IsInt,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  ValidationArguments,
} from 'class-validator';

import { MatsAveragingGroupCode } from '../entities/mats-averaging-group-code.entity';
import { MatsPollutantCode } from '../entities/mats-pollutant-code.entity';
import { MatsReportTypeCode } from '../entities/mats-report-type-code.entity';
import { MatsStatusCode } from '../entities/mats-status-code.entity';
import { MatsTestMethodCode } from '../entities/mats-test-method-code.entity';
import { MonitorPlan } from '../entities/monitor-plan.entity';
import { MonitorLocation } from '../entities/monitor-location.entity';
import { DoesNotContainUnreadableCharacters } from '../pipes/does-not-contain-unreadable-characters.pipe';
import { IsOptionalIf } from '../pipes/is-optional-if.pipe';

const DATE_FORMAT = 'YYYY-MM-DD';
const KEY = 'MATS Data Submission';

export class MatsDataSubmissionBaseDTO {
  @ApiProperty({
    description:
      propertyMetadata.matsDataSubmissionDTO.averagingGroupCode.description,
    example: propertyMetadata.matsDataSubmissionDTO.averagingGroupCode.example,
    name:
      propertyMetadata.matsDataSubmissionDTO.averagingGroupCode.fieldLabels
        .value,
  })
  @IsValidCode(MatsAveragingGroupCode)
  @IsString()
  @IsOptionalIf(o => ['ACA', 'SVA', 'EMPM'].includes(o.reportTypeCode))
  averagingGroupCode?: string;

  @ApiProperty({
    description: propertyMetadata.facilityId.description,
    example: propertyMetadata.facilityId.example,
    name: propertyMetadata.facilityId.fieldLabels.value,
  })
  @IsInt()
  facilityId: number;

  @ApiProperty({
    description: propertyMetadata.matsDataSubmissionDTO.locationId.description,
    example: propertyMetadata.matsDataSubmissionDTO.locationId.example,
    name: propertyMetadata.matsDataSubmissionDTO.locationId.fieldLabels.value,
  })
  @IsValidCode(MonitorLocation)
  @IsString()
  locationId: string;

  @ApiProperty({
    description:
      propertyMetadata.matsDataSubmissionDTO.monitorPlanId.description,
    example: propertyMetadata.matsDataSubmissionDTO.monitorPlanId.example,
    name:
      propertyMetadata.matsDataSubmissionDTO.monitorPlanId.fieldLabels.value,
  })
  @IsValidCode(MonitorPlan)
  @IsString()
  monitorPlanId: string;

  @ApiProperty({
    description:
      propertyMetadata.matsDataSubmissionDTO.originalSubmissionId.description,
    example:
      propertyMetadata.matsDataSubmissionDTO.originalSubmissionId.example,
    name:
      propertyMetadata.matsDataSubmissionDTO.originalSubmissionId.fieldLabels
        .value,
  })
  @IsNumber()
  @IsOptional()
  originalSubmissionId?: number;

  @ApiProperty({
    description:
      propertyMetadata.matsDataSubmissionDTO.pollutantCodes.description,
    example: propertyMetadata.matsDataSubmissionDTO.pollutantCodes.example,
    name:
      propertyMetadata.matsDataSubmissionDTO.pollutantCodes.fieldLabels.value,
    isArray: true,
    type: String,
  })
  @IsValidCode(MatsPollutantCode, { each: true })
  @IsString({ each: true })
  @IsArray()
  @IsOptionalIf(o => ['NOTIFY', 'CR'].includes(o.reportTypeCode))
  pollutantCodes: string[];

  @ApiProperty({
    description: propertyMetadata.quarter.description,
    example: propertyMetadata.quarter.example,
    name: propertyMetadata.quarter.fieldLabels.value,
  })
  @IsInRange(1, 4, {
    message: (args: ValidationArguments) => {
      return `Quarter must be a number from 1 to 4. You reported an invalid quarter of [${args.value}] in [${KEY}] for [${args.property}]`;
    },
  })
  @IsInt()
  @IsOptionalIf(o =>
    [
      'LEED',
      'LEEQ',
      'PST',
      'PS11',
      'RATA',
      'RCA',
      'RRA',
      'NOTIFY',
      'ACA',
      'SVA',
    ].includes(o.reportTypeCode),
  )
  quarter?: number;

  @ApiProperty({
    description:
      propertyMetadata.matsDataSubmissionDTO.reportTypeCode.description,
    example: propertyMetadata.matsDataSubmissionDTO.reportTypeCode.example,
    name:
      propertyMetadata.matsDataSubmissionDTO.reportTypeCode.fieldLabels.value,
  })
  @IsValidCode(MatsReportTypeCode)
  @IsString()
  reportTypeCode: string;

  @ApiProperty({
    description: propertyMetadata.matsDataSubmissionDTO.statusCode.description,
    example: propertyMetadata.matsDataSubmissionDTO.statusCode.example,
    name: propertyMetadata.matsDataSubmissionDTO.statusCode.fieldLabels.value,
  })
  @IsValidCode(MatsStatusCode)
  @IsString()
  statusCode: string;

  @ApiProperty({
    description: propertyMetadata.matsDataSubmissionDTO.testComment.description,
    example: propertyMetadata.matsDataSubmissionDTO.testComment.example,
    name: propertyMetadata.matsDataSubmissionDTO.testComment.fieldLabels.value,
  })
  @DoesNotContainUnreadableCharacters()
  @IsString()
  @IsOptional()
  testComment?: string;

  @ApiProperty({
    description: propertyMetadata.matsDataSubmissionDTO.testDate.description,
    example: propertyMetadata.matsDataSubmissionDTO.testDate.example,
    name: propertyMetadata.matsDataSubmissionDTO.testDate.fieldLabels.value,
  })
  @IsValidDate({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatMessage(
        `[${args.property}] must be a valid date in the format of ${DATE_FORMAT}. You reported an invalid date of [${args.value}]`,
      );
    },
  })
  @IsOptionalIf(o =>
    [
      'LEED',
      'LEEQ',
      'PST',
      'PS11',
      'RATA',
      'RCA',
      'RRA',
      'NOTIFY',
      'CR',
      'EMPM',
    ].includes(o.reportTypeCode),
  )
  testDate?: Date;

  @ApiProperty({
    description:
      propertyMetadata.matsDataSubmissionDTO.testMethodCodes.description,
    example: propertyMetadata.matsDataSubmissionDTO.testMethodCodes.example,
    name:
      propertyMetadata.matsDataSubmissionDTO.testMethodCodes.fieldLabels.value,
    isArray: true,
    type: String,
  })
  @IsValidCode(MatsTestMethodCode, { each: true })
  @IsString({ each: true })
  @IsArray()
  @IsOptionalIf(o =>
    ['NOTIFY', 'CR', 'ACA', 'SVA', 'EMPM'].includes(o.reportTypeCode),
  )
  testMethodCodes: string[];

  @ApiProperty({
    description: propertyMetadata.matsDataSubmissionDTO.testNumber.description,
    example: propertyMetadata.matsDataSubmissionDTO.testNumber.example,
    name: propertyMetadata.matsDataSubmissionDTO.testNumber.fieldLabels.value,
  })
  @IsNumberString()
  @IsOptionalIf(o => ['NOTIFY', 'CR', 'EMPM'].includes(o.reportTypeCode))
  testNumber?: string;

  @ApiProperty({
    description: propertyMetadata.year.description,
    example: propertyMetadata.year.example,
    name: propertyMetadata.year.fieldLabels.value,
  })
  @IsInRange(1993, currentDateTime().getFullYear(), {
    message: (args: ValidationArguments) => {
      return `Year must be greater than or equal to 1993 and less than or equal to ${currentDateTime().getFullYear()}. You reported an invalid year of [${
        args.value
      }] in [${KEY}] for [${args.property}]`;
    },
  })
  @IsInt()
  @IsOptionalIf(o =>
    [
      'LEED',
      'LEEQ',
      'PST',
      'PS11',
      'RATA',
      'RCA',
      'RRA',
      'NOTIFY',
      'ACA',
      'SVA',
    ].includes(o.reportTypeCode),
  )
  year?: number;
}

export class MatsDataSubmissionDTO extends MatsDataSubmissionBaseDTO {
  @ApiProperty({
    description: propertyMetadata.matsDataSubmissionDTO.id.description,
    example: propertyMetadata.matsDataSubmissionDTO.id.example,
    name: propertyMetadata.matsDataSubmissionDTO.id.fieldLabels.value,
  })
  id: number;

  @ApiProperty({
    description: propertyMetadata.matsDataSubmissionDTO.addDate.description,
    example: propertyMetadata.matsDataSubmissionDTO.addDate.example,
    name: propertyMetadata.matsDataSubmissionDTO.addDate.fieldLabels.value,
  })
  addDate: string;

  @ApiProperty({
    description: propertyMetadata.matsDataSubmissionDTO.updateDate.description,
    example: propertyMetadata.matsDataSubmissionDTO.updateDate.example,
    name: propertyMetadata.matsDataSubmissionDTO.updateDate.fieldLabels.value,
  })
  updateDate: string;

  @ApiProperty({
    description: propertyMetadata.matsDataSubmissionDTO.userId.description,
    example: propertyMetadata.matsDataSubmissionDTO.userId.example,
    name: propertyMetadata.matsDataSubmissionDTO.userId.fieldLabels.value,
  })
  userId: string;
}
