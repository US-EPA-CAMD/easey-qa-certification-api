import { ValidateIf, ValidationArguments, IsNotEmpty } from 'class-validator';
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

import { TestTypeCodes } from '../enums/test-type-code.enum';

import { RataDTO, RataImportDTO } from './rata.dto';
import { HgSummaryDTO, HgSummaryImportDTO } from './hg-summary.dto';
import { ProtocolGasDTO, ProtocolGasImportDTO } from './protocol-gas.dto';
import {
  AirEmissionTestDTO,
  AirEmissionTestImportDTO,
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
  TransmitterTransducerDTO,
  TransmitterTransducerImportDTO,
} from './transmitter-transducer.dto';
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
import { IsInDateRange } from '../pipes/is-in-date-range';
import { TestTypeCode } from '../entities/test-type-code.entity';
import { SpanScaleCode } from '../entities/span-scale-code.entity';
import { TestReasonCode } from '../entities/test-reason-code.entity';
import { TestResultCode } from '../entities/test-result-code.entity';
import { InjectionProtocolCode } from '../entities/injection-protocol-code.entity';

const MIN_DATE = '1993-01-01';
const MIN_HOUR = 0;
const MAX_HOUR = 23;
const KEY = 'General Test'
const DATE_FORMAT = 'YYYY-MM-DD';
const BEGIN_DATE_TEST_TYPE_CODES = [
  TestTypeCodes.APPE,
  TestTypeCodes.RATA,
  TestTypeCodes.LINE,
  TestTypeCodes.CYCLE,
  TestTypeCodes.ONOFF,
  TestTypeCodes.FF2LBAS,
  TestTypeCodes.UNITDEF,
  TestTypeCodes.SEVENDAY,
];

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
      return `You reported an invalid Test Type Code of [${
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

  @ApiProperty({
    description: 'Test Number. ADD TO PROPERTY METADATA',
  })
  testNumber: string;

  @ApiProperty({
    description: 'Test Reason Code. ADD TO PROPERTY METADATA',
  })
  @IsValidCode(TestReasonCode, {
    message: (args: ValidationArguments) => {
      return `You reported an invalid Test Reason Code of [${
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
  testReasonCode?: string;

  @ApiProperty({
    description: 'Test Description. ADD TO PROPERTY METADATA',
  })
  testDescription?: string;

  @ApiProperty({
    description: 'Test Result Code. ADD TO PROPERTY METADATA',
  })
  @IsValidCode(TestResultCode, {
    message: (args: ValidationArguments) => {
      return `You reported an invalid Test Result Code of [${
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
  testResultCode?: string;

  @ApiProperty({
    description: propertyMetadata.beginDate.description,
  })
  @IsNotEmpty({
    message: `You did not provide [beginDate], which is required for [${KEY}]`,
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
  @IsInDateRange(MIN_DATE, null, {
    message: (args: ValidationArguments) => `You reported a [beginDate] of [${args.value}] which is outside the range of acceptable values for this date for [${KEY}]`,
  })
  @ValidateIf(o => BEGIN_DATE_TEST_TYPE_CODES.includes(o.testTypeCode))
  beginDate?: Date;

  @ApiProperty({
    description: 'Begin Hour. ADD TO PROPERTY METADATA',
  })
  @IsNotEmpty({
    message: `You did not provide [beginHour], which is required for [${KEY}]`,
  })
  @IsInRange(MIN_HOUR, MAX_HOUR, {
    message: (args: ValidationArguments) => `The value [${args.value}] in the field [beginHour] for [${KEY}] is not within the range of valid values from [${MIN_HOUR}] to [${MAX_HOUR}]`
  })
  @ValidateIf(o => BEGIN_DATE_TEST_TYPE_CODES.includes(o.testTypeCode))
  beginHour?: number;

  @ApiProperty({
    description: 'Begin Minute. ADD TO PROPERTY METADATA',
  })
  @IsInRange(0, 59, {
    message: (args: ValidationArguments) => {
      return formatTestSummaryValidationError(
        args,
        `Begin Minute must be a numeric number from 0 to 59${''}. You reported an invalid minute of [${
          args.value
        }]`,
      );
    },
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
  @IsInDateRange(MIN_DATE, null, {
    message: (args: ValidationArguments) => `You reported an [endDate] of [${args.value}], which is outside the range of acceptable values for this date for [${KEY}]`,
  })
  @IsNotEmpty({
    message: `You did not provide [endDate], which is required for [${KEY}]`,
  })
  endDate?: Date;

  @ApiProperty({
    description: 'End Hour. ADD TO PROPERTY METADATA',
  })
  @IsInRange(0, 23, {
    message: (args: ValidationArguments) => {
      return `End Hour must be a numeric number from 0 to 23. You reported an invalid hour of [${
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
  endHour?: number;

  @ApiProperty({
    description: 'End Minute. ADD TO PROPERTY METADATA',
  })
  @IsInRange(0, 59, {
    message: (args: ValidationArguments) => {
      return `End Minute must be a numeric number from 0 to 59. You reported an invalid minute of [${
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
  quarter?: number;

  @ApiProperty({
    description: 'Test Comment. ADD TO PROPERTY METADATA',
  })
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
