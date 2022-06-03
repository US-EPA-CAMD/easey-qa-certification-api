import { ApiProperty } from '@nestjs/swagger';

import { propertyMetadata } from '@us-epa-camd/easey-common/constants';

import { RequireOne } from '../pipes/require-one.pipe';
import { IsValidCode } from '../pipes/is-valid-code.pipe';
import { TestTypeCode } from './../entities/test-type-code.entity';
import { SpanScaleCode } from '../entities/span-scale-code.entity';
import { TestReasonCode } from './../entities/test-reason-code.entity';
import { TestResultCode } from './../entities/test-result-code.entity';
import { InjectionProtocolCode } from './../entities/injection-protocol-code.entity';

import {
  LinearitySummaryImportDTO,
  LinearitySummaryDTO
} from './linearity-summary.dto';

export class TestSummaryBaseDTO {
  @ApiProperty({
    description: 'Stack Pipe Identifier. ADD TO PROPERTY METADATA',
  })
  @RequireOne('unitId', {
    message: 'A Unit Id or Stack Pipe Id (NOT both) must be provided for each Test Summary.'
  })
  stackPipeId?: string;

  @ApiProperty({
    description: propertyMetadata.unitId.description,
  })
  unitId?: string;

  @ApiProperty({
    description: 'Test Type Code. ADD TO PROPERTY METADATA',
  })
  @IsValidCode(TestTypeCode, {
    each: true,
    message: 'Invalid Test Type Code',
  })
  testTypeCode: string;

  @ApiProperty({
    description: propertyMetadata.monitorSystemDTOId.description,
  })  
  monitoringSystemId?: string;

  @ApiProperty({
    description: propertyMetadata.componentDTOComponentId.description,
  })
  componentId?: string;

  @ApiProperty({
    description: propertyMetadata.monitorSpanDTOSpanScaleCode.description,
  })
  @IsValidCode(SpanScaleCode, {
    each: true,
    message: 'Invalid Span Scale Code',
  })
  spanScaleCode?: string;

  @ApiProperty({
    description: 'Test Number. ADD TO PROPERTY METADATA',
  })
  testNumber: string;

  @ApiProperty({
    description: 'Test Reason Code. ADD TO PROPERTY METADATA',
  })
  @IsValidCode(TestReasonCode, {
    each: true,
    message: 'Invalid Test Reason Code',
  })
  testReasonCode?: string;

  @ApiProperty({
    description: 'Test Description. ADD TO PROPERTY METADATA',
  })
  testDescription?: string;

  @ApiProperty({
    description: 'Test Result Code. ADD TO PROPERTY METADATA',
  })
  @IsValidCode(TestResultCode, {
    each: true,
    message: 'Invalid Test Result Code',
  })
  testResultCode?: string;

  @ApiProperty({
    description: propertyMetadata.beginDate.description,
  })
  beginDate?: Date;

  @ApiProperty({
    description: 'Begin Hour. ADD TO PROPERTY METADATA',
  })
  beginHour?: number;

  @ApiProperty({
    description: 'Begin Minute. ADD TO PROPERTY METADATA',
  })
  beginMinute?: number;

  @ApiProperty({
    description: propertyMetadata.endDate.description,
  })
  endDate?: Date;

  @ApiProperty({
    description: 'End Hour. ADD TO PROPERTY METADATA',
  })
  endHour?: number;

  @ApiProperty({
    description: 'End Minute. ADD TO PROPERTY METADATA',
  })
  endMinute?: number;

  @ApiProperty({
    description: 'Grace Period Indicator. ADD TO PROPERTY METADATA',
  })
  gracePeriodIndicator?: number;

  @ApiProperty({
    description: propertyMetadata.year.description,
  })
  year?: number;

  @ApiProperty({
    description: propertyMetadata.quarter.description,
  })
  quarter?: number;

  @ApiProperty({
    description: 'Test Comment. ADD TO PROPERTY METADATA',
  })
  testComment?: string;

  @ApiProperty({
    description: 'Injection Protocol Code. ADD TO PROPERTY METADATA',
  })
  @IsValidCode(InjectionProtocolCode, {
    each: true,
    message: 'Invalid Injection Protocol Code',
  })
  injectionProtocolCode?: string;
}

export class TestSummaryRecordDTO extends TestSummaryBaseDTO {
  id: string;
  calculatedGracePeriodIndicator: number;
  calculatedTestResultCode: string;
  reportPeriodId: number;
  calculatedSpanValue: number;
  userId: string;
  addDate: Date;
  updateDate: Date;
  evalStatusCode: string;
}

export class TestSummaryImportDTO extends TestSummaryBaseDTO {
  linearitySummaryData: LinearitySummaryImportDTO[];
}

export class TestSummaryDTO extends TestSummaryRecordDTO {
  linearitySummaryData: LinearitySummaryDTO[];
}