import {
  ValidateIf,
  ValidationArguments,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
  MaxLength,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import {
  IsInRange,
  IsValidCode,
  IsIsoFormat,
  MatchesRegEx,
} from '@us-epa-camd/easey-common/pipes';

import { propertyMetadata } from '@us-epa-camd/easey-common/constants';

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
import { IsInDateRange } from '../pipes/is-in-date-range.pipe';
import { TestTypeCode } from '../entities/test-type-code.entity';
import { SpanScaleCode } from '../entities/span-scale-code.entity';
import { TestReasonCode } from '../entities/test-reason-code.entity';
import { TestResultCode } from '../entities/test-result-code.entity';
import { InjectionProtocolCode } from '../entities/injection-protocol-code.entity';
import {
  BEGIN_DATE_TEST_TYPE_CODES,
  VALID_CODES_FOR_COMPONENT_ID_VALIDATION,
  VALID_CODES_FOR_SPAN_SCALE_CODE_VALIDATION,
  VALID_CODES_FOR_TEST_REASON_CODE_VALIDATION,
  VALID_TEST_TYPE_CODES_FOR_TEST_RESULT_CODE,
  VALID_CODES_FOR_MON_SYS_ID_VALIDATION,
  YEAR_QUARTER_TEST_TYPE_CODES,
  GRACE_PERIOD_IND_TEST_TYPE_CODES,
  MISC_TEST_TYPE_CODES,
  VALID_CODES_FOR_END_DATE_VALIDATION,
} from '../utilities/constants';
import { dataDictionary, getMetadata, MetadataKeys } from '../data-dictionary';
import { TestTypeCodes } from '../enums/test-type-code.enum';
import { Type } from 'class-transformer';
import { currentDateTime } from '@us-epa-camd/easey-common/utilities/functions';

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
    description: 'Test Type Code. ADD TO PROPERTY METADATA',
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('TEST-12-A', {
        fieldname: args.property,
        key: KEY,
      });
    },
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
      let resultCode;
      switch (args.object['testTypeCode']) {
        case TestTypeCodes.APPE:
          resultCode = 'APPE-47-A';
          break;
        case TestTypeCodes.RATA:
          resultCode = 'RATA-117-A';
          break;
        case TestTypeCodes.F2LCHK:
          resultCode = 'F2LCHK-19-A';
          break;
        case TestTypeCodes.F2LREF:
          resultCode = 'F2LREF-15-A';
          break;
        case TestTypeCodes.FF2LBAS:
          resultCode = 'FF2LBAS-19-A';
          break;
        case TestTypeCodes.FF2LTST:
          resultCode = 'FF2LTST-13-A';
          break;
        default:
          return CheckCatalogService.formatMessage(
            `You did not provide [fieldname], which is required for [key].`,
            {
              fieldname: args.property,
              key: KEY,
            },
          );
      }
      return CheckCatalogService.formatResultMessage(resultCode, {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @ValidateIf(o =>
    VALID_CODES_FOR_MON_SYS_ID_VALIDATION.includes(o.testTypeCode),
  )
  @IsString()
  @MatchesRegEx('^[A-Z0-9]{1,3}$', {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be 1 to 3 characters and only consist of upper case letters, numbers for [${KEY}].`;
    },
  })
  monitoringSystemId?: string;

  @ApiProperty({
    description: propertyMetadata.componentDTOComponentId.description,
  })
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      let resultCode;
      switch (args.object['testTypeCode']) {
        case TestTypeCodes.CYCLE:
          resultCode = 'CYCLE-22-A';
          break;
        case TestTypeCodes.SEVENDAY:
          resultCode = 'SEVNDAY-30-A';
          break;
        case TestTypeCodes.LINE:
          resultCode = 'LINEAR-35-A';
          break;
        case TestTypeCodes.ONOFF:
          resultCode = 'ONOFF-37-A';
          break;
        case TestTypeCodes.FFACCTT:
          resultCode = 'FFACCTT-12-A';
          break;
        case TestTypeCodes.FFACC:
          resultCode = 'FFACC-12-A';
          break;
        default:
          return CheckCatalogService.formatMessage(
            `You did not provide [fieldname], which is required for [key].`,
            {
              fieldname: args.property,
              key: KEY,
            },
          );
      }
      return CheckCatalogService.formatResultMessage(resultCode, {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @ValidateIf(o =>
    VALID_CODES_FOR_COMPONENT_ID_VALIDATION.includes(o.testTypeCode),
  )
  @IsString()
  @MatchesRegEx('^[A-Z0-9]{1,3}$', {
    message: (args: ValidationArguments) => {
      return `The value of [${args.value}] for [${args.property}] must be 1 to 3 characters and only consist of upper case letters, numbers for [${KEY}].`;
    },
  })
  componentId: string;

  @ApiProperty({
    description: propertyMetadata.monitorSpanDTOSpanScaleCode.description,
  })
  @IsOptional()
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
    message: (args: ValidationArguments) => {
      let resultCode;
      switch (args.object['testTypeCode']) {
        case TestTypeCodes.RATA:
          resultCode = 'TEST-13-A';
          break;
        default:
          return CheckCatalogService.formatMessage(
            `You did not provide [fieldname], which is required for [key].`,
            {
              fieldname: args.property,
              key: KEY,
            },
          );
      }
      return CheckCatalogService.formatResultMessage(resultCode, {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsString()
  @MaxLength(18, {
    message: (args: ValidationArguments) => {
      return `The value for [${args.value}] in the Component record [${args.property}] must not exceed 18 characters for [${KEY}].`;
    },
  })
  testNumber: string;

  @ApiProperty({
    description: 'Test Reason Code. ADD TO PROPERTY METADATA',
  })
  @IsOptional()
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      let resultCode;
      switch (true) {
        case TestTypeCodes.SEVENDAY === args.object['testTypeCode']:
          resultCode = 'SEVNDAY-3-A';
          break;
        case TestTypeCodes.CYCLE === args.object['testTypeCode']:
          resultCode = 'CYCLE-4-A';
          break;
        case TestTypeCodes.LINE === args.object['testTypeCode']:
          resultCode = 'LINEAR-9-A';
          break;
        case TestTypeCodes.ONOFF === args.object['testTypeCode']:
          resultCode = 'ONOFF-3-A';
          break;
        case TestTypeCodes.RATA === args.object['testTypeCode']:
          resultCode = 'RATA-4-A';
          break;
        case MISC_TEST_TYPE_CODES.includes(args.object['testTypeCode']):
          resultCode = 'TEST-17-A';
          break;
        default:
          return CheckCatalogService.formatMessage(
            'You did not provide [fieldname], which is required for [key].',
            {
              fieldname: args.property,
              key: KEY,
            },
          );
      }
      return CheckCatalogService.formatResultMessage(resultCode, {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsValidCode(TestReasonCode, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatMessage(
        `You reported the value [value], which is not in the list of valid values, in the field [fieldname] for [key].`,
        {
          value: args.value,
          fieldname: args.property,
          key: KEY,
        },
      );
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
  @MaxLength(100, {
    message: (args: ValidationArguments) => {
      return `The value for [${args.value}] in the Component record [${args.property}] must not exceed 100 characters for [${KEY}].`;
    },
  })
  testDescription?: string;

  @ApiProperty({
    description: 'Test Result Code. ADD TO PROPERTY METADATA',
  })
  @IsOptional()
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      let resultCode;
      switch (args.object['testTypeCode']) {
        case TestTypeCodes.SEVENDAY:
          resultCode = 'SEVNDAY-28-A';
          break;
        case TestTypeCodes.LINE:
          resultCode = 'LINEAR-10-A';
          break;
        default:
          return CheckCatalogService.formatResultMessage('TEST-12-A', {
            fieldname: args.property,
            key: KEY,
          });
      }
      return CheckCatalogService.formatResultMessage(resultCode, {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsValidCode(TestResultCode, {
    message: (args: ValidationArguments) => {
      let resultCode;
      switch (args.object['testTypeCode']) {
        case TestTypeCodes.SEVENDAY:
          resultCode = 'SEVNDAY-28-B';
          break;
        case TestTypeCodes.LINE:
          resultCode = 'LINEAR-10-B';
          break;
        case TestTypeCodes.ONOFF:
          resultCode = 'ONOFF-39-B';
          break;
        default:
          return CheckCatalogService.formatMessage(
            `You reported the value [value], which is not in the list of valid values, in the field [fieldname] for [key].`,
            {
              value: args.value,
              fieldname: args.property,
              key: KEY,
            },
          );
      }
      return CheckCatalogService.formatResultMessage(resultCode, {
        value: args.value,
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @ValidateIf(o =>
    VALID_TEST_TYPE_CODES_FOR_TEST_RESULT_CODE.includes(o.testTypeCode),
  )
  testResultCode?: string;

  @ApiProperty(getMetadata(dataDictionary.beginDate, MetadataKeys.TEST_SUMMARY))
  @ValidateIf(o => BEGIN_DATE_TEST_TYPE_CODES.includes(o.testTypeCode))
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage(`TEST-1-A`, {
        fieldname: args.property,
        key: KEY,
      });
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
  @IsInDateRange(MIN_DATE, currentDateTime().toISOString(), {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage(`TEST-1-B`, {
        date: args.value,
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  beginDate?: Date;

  @ApiProperty({
    description: 'Begin Hour. ADD TO PROPERTY METADATA',
  })
  @ValidateIf(o => BEGIN_DATE_TEST_TYPE_CODES.includes(o.testTypeCode))
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage(`TEST-2-A`, {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsInRange(MIN_HOUR, MAX_HOUR, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage(`TEST-2-B`, {
        value: args.value,
        fieldname: args.property,
        key: KEY,
        minvalue: MIN_HOUR,
        maxvalue: MAX_HOUR,
      });
    },
  })
  beginHour?: number;

  @ApiProperty({
    description: 'Begin Minute. ADD TO PROPERTY METADATA',
  })
  @IsInRange(MIN_MINUTE, MAX_MINUTE, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage(`TEST-3-C`, {
        value: args.value,
        fieldname: args.property,
        key: KEY,
        minvalue: MIN_MINUTE,
        maxvalue: MAX_MINUTE,
      });
    },
  })
  beginMinute?: number;

  @ApiProperty({
    description: propertyMetadata.endDate.description,
  })
  @ValidateIf(o => VALID_CODES_FOR_END_DATE_VALIDATION.includes(o.testTypeCode))
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage(`TEST-4-A`, {
        fieldname: args.property,
        key: KEY,
      });
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
  @IsInDateRange(MIN_DATE, currentDateTime().toISOString(), {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage(`TEST-4-B`, {
        date: args.value,
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  endDate?: Date;

  @ApiProperty({
    description: 'End Hour. ADD TO PROPERTY METADATA',
  })
  @ValidateIf(o => VALID_CODES_FOR_END_DATE_VALIDATION.includes(o.testTypeCode))
  @IsNotEmpty({
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage(`TEST-5-A`, {
        fieldname: args.property,
        key: KEY,
      });
    },
  })
  @IsInRange(MIN_HOUR, MAX_HOUR, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage(`TEST-5-B`, {
        value: args.value,
        fieldname: args.property,
        key: KEY,
        minvalue: MIN_HOUR,
        maxvalue: MAX_HOUR,
      });
    },
  })
  endHour?: number;

  @ApiProperty({
    description: 'End Minute. ADD TO PROPERTY METADATA',
  })
  @IsOptional()
  @IsInRange(MIN_MINUTE, MAX_MINUTE, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage(`TEST-6-C`, {
        value: args.value,
        fieldname: args.property,
        key: KEY,
        minvalue: MIN_MINUTE,
        maxvalue: MAX_MINUTE,
      });
    },
  })
  endMinute?: number;

  @ApiProperty({
    description: 'Grace Period Indicator. ADD TO PROPERTY METADATA',
  })
  @IsOptional()
  @IsInRange(0, 1, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatMessage(
        `Grace Period Indicator must be an integer from 0 or 1. You reported an invalid value of [${
          args.value
        }] in Test Summary record for Unit/Stack [${
          args.object['unitId']
            ? args.object['unitId']
            : args.object['stackPipeId']
        }], Test Type Code [${args.object['testTypeCode']}], and Test Number [${
          args.object['testNumber']
        }]`,
      );
    },
  })
  @ValidateIf(o => GRACE_PERIOD_IND_TEST_TYPE_CODES.includes(o.testTypeCode))
  gracePeriodIndicator?: number;

  @ApiProperty({
    description: propertyMetadata.year.description,
  })
  @IsOptional()
  @IsInRange(1993, currentDateTime().getFullYear(), {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatResultMessage('IMPORT-34-A', {
        locationID: args.object['unitId']
          ? args.object['unitId']
          : args.object['stackPipeId'],
        testTypeCode: args.object['testTypeCode'],
        testNumber: args.object['testNumber'],
      });
    },
  })
  @ValidateIf(o => YEAR_QUARTER_TEST_TYPE_CODES.includes(o.testTypeCode))
  year?: number;

  @ApiProperty({
    description: propertyMetadata.quarter.description,
  })
  @IsOptional()
  @IsInRange(1, 4, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatMessage(
        `You reported an invalid quarter of [value] in Test Summary record for location [locationID], Test Type Code [testTypeCode], and Test Number [testNumber]. Quarter must be a numeric number from 1 to 4.`,
        {
          value: args.value,
          locationID: args.object['unitId']
            ? args.object['unitId']
            : args.object['stackPipeId'],
          testTypeCode: args.object['testTypeCode'],
          testNumber: args.object['testNumber'],
        },
      );
    },
  })
  @ValidateIf(o => YEAR_QUARTER_TEST_TYPE_CODES.includes(o.testTypeCode))
  quarter?: number;

  @ApiProperty({
    description: 'Test Comment. ADD TO PROPERTY METADATA',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000, {
    message: (args: ValidationArguments) => {
      return `The value for [${args.value}] in the Component record [${args.property}] must not exceed 1000 characters for [${KEY}].`;
    },
  })
  testComment?: string;

  @ApiProperty({
    description: 'Injection Protocol Code. ADD TO PROPERTY METADATA',
  })
  @IsOptional()
  @IsValidCode(InjectionProtocolCode, {
    message: (args: ValidationArguments) => {
      return CheckCatalogService.formatMessage(
        `You reported an invalid Injection Protocol Code of [${
          args.value
        }] in Test Summary record for Unit/Stack [${
          args.object['unitId']
            ? args.object['unitId']
            : args.object['stackPipeId']
        }], Test Type Code [${args.object['testTypeCode']}], and Test Number [${
          args.object['testNumber']
        }]`,
      );
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
  appendixECorrelationTestSummaryData: AppECorrelationTestSummaryImportDTO[];

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
  appendixECorrelationTestSummaryData: AppECorrelationTestSummaryDTO[];
  unitDefaultTestData: UnitDefaultTestDTO[];
  hgSummaryData: HgSummaryDTO[];
  testQualificationData: TestQualificationDTO[];
  protocolGasData: ProtocolGasDTO[];
  airEmissionTestingData: AirEmissionTestingDTO[];
}
