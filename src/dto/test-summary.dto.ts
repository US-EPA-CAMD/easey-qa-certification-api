import { ValidationArguments } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import {
  IsInRange,
  IsValidDate, 
  IsIsoFormat,
  IsInDateRange,
} from '@us-epa-camd/easey-common/pipes';

import {
  ErrorMessages,
  propertyMetadata,
} from '@us-epa-camd/easey-common/constants';

import { RataDTO, RataImportDTO } from './rata.dto';
import { HgSummaryDTO, HgSummaryImportDTO } from './hg-summary.dto';
import { ProtocolGasDTO, ProtocolGasImportDTO } from './protocol-gas.dto';
import { AirEmissionTestDTO, AirEmissionTestImportDTO } from './air-emission-test.dto';
import { UnitDefaultTestDTO, UnitDefaultTestImportDTO } from './unit-default-test.dto';
import { LinearitySummaryDTO, LinearitySummaryImportDTO } from './linearity-summary.dto';
import { FlowToLoadCheckDTO, FlowToLoadCheckImportDTO  } from './flow-to-load-check.dto';
import { CycleTimeSummaryDTO, CycleTimeSummaryImportDTO } from './cycle-time-summary.dto';
import { TestQualificationDTO, TestQualificationImportDTO } from './test-qualification.dto';
import { FuelFlowToLoadTestDTO, FuelFlowToLoadTestImportDTO } from './fuel-flow-to-load-test.dto';
import { FlowToLoadReferenceDTO, FlowToLoadReferenceImportDTO } from './flow-to-load-reference.dto';
import { CalibrationInjectionDTO, CalibrationInjectionImportDTO } from './calibration-injection.dto';
import { TransmitterTransducerDTO, TransmitterTransducerImportDTO } from './transmitter-transducer.dto';
import { FuelFlowmeterAccuracyDTO, FuelFlowmeterAccuracyImportDTO } from './fuel-flowmeter-accuracy.dto';
import { FuelFlowToLoadBaselineDTO, FuelFlowToLoadBaselineImportDTO } from './fuel-flow-to-load-baseline.dto';
import { OnlineOfflineCalibrationDTO, OnlineOfflineCalibrationImportDTO } from './online-offline-calibration.dto';
import { AppECorrelationTestSummaryDTO, AppECorrelationTestSummaryImportDTO } from './app-e-correlation-test-summary.dto';

import { RequireOne } from '../pipes/require-one.pipe';
import { IsValidCode } from '../pipes/is-valid-code.pipe';
import { TestTypeCode } from '../entities/test-type-code.entity';
import { SpanScaleCode } from '../entities/span-scale-code.entity';
import { TestReasonCode } from '../entities/test-reason-code.entity';
import { TestResultCode } from '../entities/test-result-code.entity';
import { InjectionProtocolCode } from '../entities/injection-protocol-code.entity';

export class TestSummaryBaseDTO {
  @ApiProperty({
    description: 'Stack Pipe Identifier. ADD TO PROPERTY METADATA',
  })
  @RequireOne('unitId', {
    message: 'A Unit or Stack Pipe identifier (NOT both) must be provided for each Test Summary.'
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
    message: 'Invalid Test Result Code',
  })
  testResultCode?: string;

  @ApiProperty({
    description: propertyMetadata.beginDate.description,
  })
  @IsValidDate({
    message: ErrorMessages.DateValidity(),
  })
  @IsIsoFormat({
    message: ErrorMessages.SingleFormat('beginDate', 'YYYY-MM-DD format'),
  })
  // @IsInDateRange([new Date('1993-01-01'), 'currentDate'], false, true, false, {
  //   message: (args: ValidationArguments) => {
  //     return `BeginDate must be greater than or equal to 1993 and less than or equal to current quarter in ${new Date().getFullYear()}. You reported an invalid year of [${args.value}] in Test Summary record for Unit/Stack [${(args.object)['unitId'] ? (args.object)['unitId'] : (args.object)['stackPipeId']}], Test Type Code [${(args.object)['testTypeCode']}], and Test Number [${(args.object)['testNumber']}]`;
  //   }
  // })
  beginDate?: Date;

  @ApiProperty({
    description: 'Begin Hour. ADD TO PROPERTY METADATA',
  })
  @IsInRange(0, 23, {
    message: 'beginHour must be a numeric number from 0 to 23'
  })
  beginHour?: number;

  @ApiProperty({
    description: 'Begin Minute. ADD TO PROPERTY METADATA',
  })
  @IsInRange(0, 59, {
    message: 'beginMinute must be a numeric number from 0 to 59'
  })
  beginMinute?: number;

  @ApiProperty({
    description: propertyMetadata.endDate.description,
  })
  @IsValidDate({
    message: ErrorMessages.DateValidity(),
  })
  @IsIsoFormat({
    message: ErrorMessages.SingleFormat('endDate', 'YYYY-MM-DD format'),
  })
  // @IsInDateRange([new Date('1993-01-01'), 'currentDate'], false, true, false, {
  //   message: (args: ValidationArguments) => {
  //     return `EndDate must be greater than or equal to 1993 and less than or equal to current quarter in ${new Date().getFullYear()}. You reported an invalid year of [${args.value}] in Test Summary record for Unit/Stack [${(args.object)['unitId'] ? (args.object)['unitId'] : (args.object)['stackPipeId']}], Test Type Code [${(args.object)['testTypeCode']}], and Test Number [${(args.object)['testNumber']}]`;
  //   }
  // })
  endDate?: Date;

  @ApiProperty({
    description: 'End Hour. ADD TO PROPERTY METADATA',
  })
  @IsInRange(0, 23, {
    message: 'endHour must be a numeric number from 0 to 23'
  })
  endHour?: number;

  @ApiProperty({
    description: 'End Minute. ADD TO PROPERTY METADATA',
  })
  @IsInRange(0, 59, {
    message: 'endMinute must be a numeric number from 0 to 59'
  })
  endMinute?: number;

  @ApiProperty({
    description: 'Grace Period Indicator. ADD TO PROPERTY METADATA',
  })
  @IsInRange(0, 1, {
    message: 'gracePeriodIndicator must be a numeric number from 0 to 1'
  })
  gracePeriodIndicator?: number;

  @ApiProperty({
    description: propertyMetadata.year.description,
  })
  @IsInRange(1993, new Date().getFullYear(), {
    message: (args: ValidationArguments) => {
      return `Year must be greater than or equal to 1993 and less than or equal to ${new Date().getFullYear()}. You reported an invalid year of [${args.value}] in Test Summary record for Unit/Stack [${(args.object)['unitId'] ? (args.object)['unitId'] : (args.object)['stackPipeId']}], Test Type Code [${(args.object)['testTypeCode']}], and Test Number [${(args.object)['testNumber']}]`;
    }
  })
  year?: number;

  @ApiProperty({
    description: propertyMetadata.quarter.description,
  })
  @IsInRange(1, 4, {
    message: 'quarter must be a numeric number from 1 to 4'
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
    message: 'Invalid Injection Protocol Code',
  })
  injectionProtocolCode?: string;
}

export class TestSummaryRecordDTO extends TestSummaryBaseDTO {
  id: string;
  locationId: string;
  calculatedGracePeriodIndicator: number;
  calculatedTestResultCode: string;
  reportPeriodId: number;
  calculatedSpanValue: number;
  userId: string;
  addDate: string;
  updateDate: string;
  evalStatusCode: string;
}

export class TestSummaryImportDTO extends TestSummaryBaseDTO {
  calibrationInjectionData: CalibrationInjectionImportDTO[];
  linearitySummaryData: LinearitySummaryImportDTO[];
  rataData: RataImportDTO[];
  flowToLoadReferenceData: FlowToLoadReferenceImportDTO[];
  flowToLoadCheckData: FlowToLoadCheckImportDTO[];
  cycleTimeSummaryData: CycleTimeSummaryImportDTO[];
  onlineOfflineCalibrationData: OnlineOfflineCalibrationImportDTO[];
  fuelFlowmeterAccuracyData: FuelFlowmeterAccuracyImportDTO[];
  transmitterTransducerData: TransmitterTransducerImportDTO[];
  fuelFlowToLoadBaselineData: FuelFlowToLoadBaselineImportDTO[];
  fuelFlowToLoadTestData: FuelFlowToLoadTestImportDTO[];
  appECorrelationTestSummaryData: AppECorrelationTestSummaryImportDTO[];
  unitDefaultTestData: UnitDefaultTestImportDTO[];
  hgSummaryData: HgSummaryImportDTO[];
  testQualificationData: TestQualificationImportDTO[];
  protocolGasData: ProtocolGasImportDTO[];
  airEmissionTestData: AirEmissionTestImportDTO[];
}

export class TestSummaryDTO extends TestSummaryRecordDTO {
  calibrationInjectionData: CalibrationInjectionDTO[];
  linearitySummaryData: LinearitySummaryDTO[];
  rataData: RataDTO[];
  flowToLoadReferenceData: FlowToLoadReferenceDTO[];
  flowToLoadCheckData: FlowToLoadCheckDTO[];
  cycleTimeSummaryData: CycleTimeSummaryDTO[];
  onlineOfflineCalibrationData: OnlineOfflineCalibrationDTO[];
  fuelFlowmeterAccuracyData: FuelFlowmeterAccuracyDTO[];
  transmitterTransducerData: TransmitterTransducerDTO[];
  fuelFlowToLoadBaselineData: FuelFlowToLoadBaselineDTO[];
  fuelFlowToLoadTestData: FuelFlowToLoadTestDTO[];
  appECorrelationTestSummaryData: AppECorrelationTestSummaryDTO[];
  unitDefaultTestData: UnitDefaultTestDTO[];
  hgSummaryData: HgSummaryDTO[];
  testQualificationData: TestQualificationDTO[];
  protocolGasData: ProtocolGasDTO[];
  airEmissionTestData: AirEmissionTestDTO[];
}
