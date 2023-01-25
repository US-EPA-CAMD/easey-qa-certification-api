import {
  ValidateIf,
  ValidationArguments,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import {
  IsInRange,
  IsValidDate,
  IsIsoFormat,
} from '@us-epa-camd/easey-common/pipes';

import {
  ErrorMessages,
  propertyMetadata,
} from '@us-epa-camd/easey-common/constants';

import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';

import { RataDTO, RataImportDTO } from './rata.dto';
import { HgSummaryDTO, HgSummaryImportDTO } from './hg-summary.dto';
import { ProtocolGasDTO, ProtocolGasImportDTO } from './protocol-gas.dto';
import {
  AirEmissionTestingDTO,
  AirEmissionTestingImportDTO,
} from './air-emission-test.dto';
import {
  UnitDefaultTestDTO,
  UnitDefaultTestImportDTO,
} from './unit-default-test.dto';
import {
  LinearitySummaryDTO,
  LinearitySummaryImportDTO,
} from './linearity-summary.dto';
import {
  FlowToLoadCheckDTO,
  FlowToLoadCheckImportDTO,
} from './flow-to-load-check.dto';
import {
  CycleTimeSummaryDTO,
  CycleTimeSummaryImportDTO,
} from './cycle-time-summary.dto';
import {
  TestQualificationDTO,
  TestQualificationImportDTO,
} from './test-qualification.dto';
import {
  FuelFlowToLoadTestDTO,
  FuelFlowToLoadTestImportDTO,
} from './fuel-flow-to-load-test.dto';
import {
  FlowToLoadReferenceDTO,
  FlowToLoadReferenceImportDTO,
} from './flow-to-load-reference.dto';
import {
  CalibrationInjectionDTO,
  CalibrationInjectionImportDTO,
} from './calibration-injection.dto';
import {
  TransmitterTransducerAccuracyDTO,
  TransmitterTransducerAccuracyImportDTO,
} from './transmitter-transducer-accuracy.dto';
import {
  FuelFlowmeterAccuracyDTO,
  FuelFlowmeterAccuracyImportDTO,
} from './fuel-flowmeter-accuracy.dto';
import {
  FuelFlowToLoadBaselineDTO,
  FuelFlowToLoadBaselineImportDTO,
} from './fuel-flow-to-load-baseline.dto';
import {
  OnlineOfflineCalibrationDTO,
  OnlineOfflineCalibrationImportDTO,
} from './online-offline-calibration.dto';
import {
  AppECorrelationTestSummaryDTO,
  AppECorrelationTestSummaryImportDTO,
} from './app-e-correlation-test-summary.dto';

import { RequireOne } from '../pipes/require-one.pipe';
import { IsValidCode } from '../pipes/is-valid-code.pipe';
import { IsInDateRange } from '../pipes/is-in-date-range.pipe';
import { TestTypeCode } from '../entities/test-type-code.entity';
import { SpanScaleCode } from '../entities/span-scale-code.entity';
import { TestReasonCode } from '../entities/test-reason-code.entity';
import { TestResultCode } from '../entities/test-result-code.entity';
import { InjectionProtocolCode } from '../entities/injection-protocol-code.entity';
import {
  BEGIN_DATE_TEST_TYPE_CODES,
  VALID_CODES_FOR_COMPONENT_ID_VALIDATION,
  VALID_CODES_FOR_END_MINUTE_VALIDATION,
  VALID_CODES_FOR_SPAN_SCALE_CODE_VALIDATION,
  VALID_CODES_FOR_TEST_REASON_CODE_VALIDATION,
  VALID_TEST_TYPE_CODES_FOR_TEST_RESULT_CODE,
  VALID_CODES_FOR_MON_SYS_ID_VALIDATION,
  YEAR_QUARTER_TEST_TYPE_CODES,
  GRACE_PERIOD_IND_TEST_TYPE_CODES,
  VALID_CODES_FOR_END_DATE_VALIDATION,
  BEGIN_MINUTE_TEST_TYPE_CODES,
} from '../utilities/constants';
import { dataDictionary, getMetadata, MetadataKeys } from '../data-dictionary';
import { TestTypeCodes } from '../enums/test-type-code.enum';
import { Type } from 'class-transformer';
import { TestResultCodes } from '../enums/test-result-code.enum';
import { ArrayContains } from 'src/pipes/array-contains.pipe';

const KEY = 'Test Summary';
const DATE_FORMAT = 'YYYY-MM-DD';
const MIN_DATE = '1993-01-01';
const MIN_HOUR = 0;
const MAX_HOUR = 23;
const MIN_MINUTE = 0;
const MAX_MINUTE = 59;

const formatTestSummaryValidationError = (
  args: ValidationArguments,
  message: string,
): string => {
  return `${message} for Test Summary record with Unit/Stack [${
    args.object['unitId'] ? args.object['unitId'] : args.object['stackPipeId']
  }], Test Type Code [${args.object['testTypeCode']}], and Test Number [${
    args.object['testNumber']
  }]`;
};

export class TestSummaryBaseDTO {
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
    description: 'Test Type Code. ADD TO PROPERTY METADATA',
  })
  @IsValidCode(TestTypeCode, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatMessage(
        'You reported an invalid Test Type Code of [testTypeCode] for Test Summary at Location [locationId] and Test Number [testNumber]',
        {
          testTypeCode: args.value,
          locationId: args.object['unitId']
            ? args.object['unitId']
            : args.object['stackPipeId'],
          testNumber: args.object['testNumber'],
        },
      );
    },
  })
  testTypeCode: string;

  @ApiProperty({
    description: propertyMetadata.monitorSystemDTOId.description,
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      switch(args.object['testTypeCode']){
        case 'APPE':
          return CheckCatalogService.formatResultMessage('APPE-47-A', {
            fieldname: args.property,
            key: KEY,
          });
      }
      return CheckCatalogService.formatResultMessage('RATA-117-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @ValidateIf(o =>
    VALID_CODES_FOR_MON_SYS_ID_VALIDATION.includes(o.testTypeCode),
  )
  monitoringSystemID?: string;

  @ApiProperty({
    description: propertyMetadata.componentDTOComponentId.description,
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      switch(args.object['testTypeCode']){
        case 'CYCLE':
          return CheckCatalogService.formatResultMessage('CYCLE-22-A', {
            fieldname: args.property,
            key: KEY,
          });
        case '7DAY':
          return CheckCatalogService.formatResultMessage('SEVNDAY-30-A', {
            fieldname: args.property,
            key: KEY,
          });
      }
      return `You did not provide [${args.property}], which is required for [${KEY}].`;
    },
  })
  @ValidateIf(o =>
    VALID_CODES_FOR_COMPONENT_ID_VALIDATION.includes(o.testTypeCode),
  )
  componentID?: string;

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
  @ValidateIf(o =>
    VALID_CODES_FOR_SPAN_SCALE_CODE_VALIDATION.includes(o.testTypeCode),
  )
  spanScaleCode?: string;

  @ApiProperty({
    description: 'Test Number. ADD TO PROPERTY METADATA',
  })
  @IsNotEmpty({
    message: `You did not provide [testNumber], which is required for [${KEY}].`,
  })
  testNumber: string;

  @ApiProperty({
    description: 'Test Reason Code. ADD TO PROPERTY METADATA',
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return `You did not provide [${args.property}], which is required for [${KEY}].`;
    },
  })
  @IsValidCode(TestReasonCode, {
    message: (args: ValidationArguments) => {
      return `You reported the value [${args.value}], which is not in the list of valid values, in the field [${args.property}] for [${KEY}].`;
    },
  })
  @ValidateIf(o =>
    VALID_CODES_FOR_TEST_REASON_CODE_VALIDATION.includes(o.testTypeCode),
  )
  testReasonCode?: string;

  @ApiProperty({
    description: 'Test Description. ADD TO PROPERTY METADATA',
  })
  @ValidateIf(o => [TestTypeCodes.OTHER].includes(o.testTypeCode))
  testDescription?: string;

  @ApiProperty({
    description: 'Test Result Code. ADD TO PROPERTY METADATA',
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      let code;
      switch(args.object['testTypeCode']){
        case '7DAY':
          code = 'SEVNDAY-28-A';
          break;
        case 'LINE':
          code = 'LINEAR-10-A';
          break;
      }
      if (code) {
        return CheckCatalogService.formatResultMessage(code, {
          fieldname: args.property,
          key: KEY,
        })
      }
      return `You did not provide [testResultCode], which is required for [${KEY}].`
    },
  })
  @IsValidCode(TestResultCode, {
    message: (args: ValidationArguments) => {
      let code
      switch(args.object['testTypeCode']){
        case '7DAY':
          code = 'SEVNDAY-28-B'
          break;
        case 'LINE':
          code = 'LINEAR-10-B';
          break;
      }
      if (code) {
        return CheckCatalogService.formatResultMessage(code, {
          fieldname: args.property,
          key: KEY
        })
      }
      return `You reported the value [${args.value}], which is not in the list of valid values, in the field [testResultCode] for [Test Summary].`;
    },
  })
  @ArrayContains([TestResultCodes.PASSED, TestResultCodes.ABORTED, TestResultCodes.PASSAPS, TestResultCodes.FAILED], {
    message: (args: ValidationArguments) => {
      let code
      switch(args.object['testTypeCode']){
        case '7DAY':
          code = 'SEVNDAY-28-C'
          break;
        case 'LINE':
          code = 'LINEAR-10-C';
          break;
      }
      return CheckCatalogService.formatResultMessage(code, {
        value: args.value,
        fieldname: args.property,
        key: KEY,
      });
    }
  })
  @ValidateIf(o =>
    VALID_TEST_TYPE_CODES_FOR_TEST_RESULT_CODE.includes(o.testTypeCode),
  )
  testResultCode?: string;

  @ApiProperty(getMetadata(dataDictionary.beginDate, MetadataKeys.TEST_SUMMARY))
  @IsNotEmpty({
    message: `You did not provide [beginDate], which is required for [${KEY}].`,
  })
  @IsValidDate({
    message: (args: ValidationArguments) => {
      return formatTestSummaryValidationError(
        args,
        `Begin Date must be a valid date in the format of ${DATE_FORMAT}. You reported an invalid date of [${args.value}]`,
      );
    },
  })
  @IsIsoFormat({
    message: (args: ValidationArguments) => {
      return formatTestSummaryValidationError(
        args,
        `Begin Date must be a valid date in the format of ${DATE_FORMAT}. You reported an improperly formatted date of [${args.value}]`,
      );
    },
  })
  @IsInDateRange(MIN_DATE, new Date(Date.now()).toISOString(), {
    message: (args: ValidationArguments) =>
      `You reported a [beginDate] of [${args.value}] which is outside the range of acceptable values for this date for [${KEY}].`,
  })
  @ValidateIf(o => BEGIN_DATE_TEST_TYPE_CODES.includes(o.testTypeCode))
  beginDate?: Date;

  @ApiProperty({
    description: 'Begin Hour. ADD TO PROPERTY METADATA',
  })
  @IsNotEmpty({
    message: `You did not provide [beginHour], which is required for [${KEY}].`,
  })
  @IsInRange(MIN_HOUR, MAX_HOUR, {
    message: (args: ValidationArguments) =>
      `The value [${args.value}] in the field [beginHour] for [${KEY}] is not within the range of valid values from [${MIN_HOUR}] to [${MAX_HOUR}].`,
  })
  @ValidateIf(o => BEGIN_DATE_TEST_TYPE_CODES.includes(o.testTypeCode))
  beginHour?: number;

  @ApiProperty({
    description: 'Begin Minute. ADD TO PROPERTY METADATA',
  })
  @IsInRange(MIN_MINUTE, MAX_MINUTE, {
    message: (args: ValidationArguments) =>
      `The value [${args.value}] in the field [beginMinute] for [${KEY}] is not within the range of valid values from [${MIN_MINUTE}] to [${MAX_MINUTE}].`,
  })
  @ValidateIf(o => BEGIN_MINUTE_TEST_TYPE_CODES.includes(o.testTypeCode))
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
  @IsInDateRange(MIN_DATE, new Date(Date.now()).toISOString(), {
    message: (args: ValidationArguments) => {
      args.object['locationId'] = args.object['unitId']
        ? args.object['unitId']
        : args.object['stackPipeId'];
      return `You reported an invalid EndDate in the Test Summary record for Location [${args.object['locationId']}], TestTypeCode [${args.object['testTypeCode']}] and TestNumber [${args.object['testNumber']}].`;
    },
  })
  @ValidateIf(o => VALID_CODES_FOR_END_DATE_VALIDATION.includes(o.testTypeCode))
  endDate?: Date;

  @ApiProperty({
    description: 'End Hour. ADD TO PROPERTY METADATA',
  })
  @IsInRange(MIN_HOUR, MAX_HOUR, {
    message: (args: ValidationArguments) =>
      `The value [${args.value}] in the field [endHour] for [${KEY}] is not within the range of valid values from [${MIN_HOUR}] to [${MAX_HOUR}].`,
  })
  @IsNotEmpty({
    message: `You did not provide [endHour], which is required for [${KEY}].`,
  })
  @ValidateIf(o => VALID_CODES_FOR_END_DATE_VALIDATION.includes(o.testTypeCode))
  endHour?: number;

  @ApiProperty({
    description: 'End Minute. ADD TO PROPERTY METADATA',
  })
  @IsInRange(MIN_MINUTE, MAX_MINUTE, {
    message: (args: ValidationArguments) =>
      `The value [${args.value}] in the field [endMinute] for [${KEY}] is not within the range of valid values from [${MIN_MINUTE}] to [${MAX_MINUTE}].`,
  })
  @ValidateIf(o =>
    VALID_CODES_FOR_END_MINUTE_VALIDATION.includes(o.testTypeCode),
  )
  endMinute?: number;

  @ApiProperty({
    description: 'Grace Period Indicator. ADD TO PROPERTY METADATA',
  })
  @IsInRange(0, 1, {
    message: (args: ValidationArguments) => {
      return `Grace Period Indicator must be a numeric number from 0 to 1. You reported an invalid value of [${
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
  @ValidateIf(o => GRACE_PERIOD_IND_TEST_TYPE_CODES.includes(o.testTypeCode))
  gracePeriodIndicator?: number;

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
  year?: number;

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
  quarter?: number;

  @ApiProperty({
    description: 'Test Comment. ADD TO PROPERTY METADATA',
  })
  @IsOptional()
  testComment?: string;

  @ApiProperty({
    description: 'Injection Protocol Code. ADD TO PROPERTY METADATA',
  })
  @IsValidCode(InjectionProtocolCode, {
    message: (args: ValidationArguments) => {
      return `You reported an invalid Injection Protocol Code of [${
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
  @ValidateIf(o =>
    [TestTypeCodes.SEVENDAY, TestTypeCodes.CYCLE].includes(o.testTypeCode),
  )
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
  @ValidateNested({ each: true })
  @Type(() => CalibrationInjectionImportDTO)
  calibrationInjectionData: CalibrationInjectionImportDTO[];

  @ValidateNested({ each: true })
  @Type(() => LinearitySummaryImportDTO)
  linearitySummaryData: LinearitySummaryImportDTO[];

  @ValidateNested({ each: true })
  @Type(() => RataImportDTO)
  rataData: RataImportDTO[];

  @ValidateNested({ each: true })
  @Type(() => FlowToLoadReferenceImportDTO)
  flowToLoadReferenceData: FlowToLoadReferenceImportDTO[];

  @ValidateNested({ each: true })
  @Type(() => FlowToLoadCheckImportDTO)
  flowToLoadCheckData: FlowToLoadCheckImportDTO[];

  @ValidateNested({ each: true })
  @Type(() => CycleTimeSummaryImportDTO)
  cycleTimeSummaryData: CycleTimeSummaryImportDTO[];

  @ValidateNested({ each: true })
  @Type(() => OnlineOfflineCalibrationImportDTO)
  onlineOfflineCalibrationData: OnlineOfflineCalibrationImportDTO[];

  @ValidateNested({ each: true })
  @Type(() => FuelFlowmeterAccuracyImportDTO)
  fuelFlowmeterAccuracyData: FuelFlowmeterAccuracyImportDTO[];

  @ValidateNested({ each: true })
  @Type(() => TransmitterTransducerAccuracyImportDTO)
  transmitterTransducerData: TransmitterTransducerAccuracyImportDTO[];

  @ValidateNested({ each: true })
  @Type(() => FuelFlowToLoadTestImportDTO)
  fuelFlowToLoadBaselineData: FuelFlowToLoadBaselineImportDTO[];

  @ValidateNested({ each: true })
  @Type(() => FuelFlowToLoadTestImportDTO)
  fuelFlowToLoadTestData: FuelFlowToLoadTestImportDTO[];

  @ValidateNested({ each: true })
  @Type(() => AppECorrelationTestSummaryImportDTO)
  appECorrelationTestSummaryData: AppECorrelationTestSummaryImportDTO[];

  @ValidateNested({ each: true })
  @Type(() => UnitDefaultTestImportDTO)
  unitDefaultTestData: UnitDefaultTestImportDTO[];

  @ValidateNested({ each: true })
  @Type(() => HgSummaryImportDTO)
  hgSummaryData: HgSummaryImportDTO[];

  @ValidateNested({ each: true })
  @Type(() => TestQualificationImportDTO)
  testQualificationData: TestQualificationImportDTO[];

  @ValidateNested({ each: true })
  @Type(() => ProtocolGasImportDTO)
  protocolGasData: ProtocolGasImportDTO[];

  @ValidateNested({ each: true })
  @Type(() => AirEmissionTestingImportDTO)
  airEmissionTestingData: AirEmissionTestingImportDTO[];
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
  transmitterTransducerData: TransmitterTransducerAccuracyDTO[];
  fuelFlowToLoadBaselineData: FuelFlowToLoadBaselineDTO[];
  fuelFlowToLoadTestData: FuelFlowToLoadTestDTO[];
  appECorrelationTestSummaryData: AppECorrelationTestSummaryDTO[];
  unitDefaultTestData: UnitDefaultTestDTO[];
  hgSummaryData: HgSummaryDTO[];
  testQualificationData: TestQualificationDTO[];
  protocolGasData: ProtocolGasDTO[];
  airEmissionTestingData: AirEmissionTestingDTO[];
}
