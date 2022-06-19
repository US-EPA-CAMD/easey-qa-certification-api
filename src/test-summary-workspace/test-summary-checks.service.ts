import { BadRequestException, Injectable } from '@nestjs/common';

import { Logger } from '@us-epa-camd/easey-common/logger';

import {
  TestSummaryBaseDTO,
  TestSummaryImportDTO,
} from '../dto/test-summary.dto';

import { TestTypeCodes } from '../enums/test-type-code.enum';

@Injectable()
export class TestSummaryChecksService {
  constructor(private readonly logger: Logger) {}

  private throwIfErrors(errorList: string[], isImport: boolean = false) {
    if (!isImport && errorList.length > 0) {
      this.logger.error(BadRequestException, errorList, true);
    }
  }

  async runChecks(
    summary: TestSummaryBaseDTO | TestSummaryImportDTO,
    isImport: boolean = false,
  ): Promise<string[]> {
    let error: string = null;
    const errorList: string[] = [];
    this.logger.info('Running Test Summary Checks');

    if (isImport) {
      // IMPORT-16 Inappropriate Children Records for Test Summary
      error = this.import16Check(summary as TestSummaryImportDTO);
      if (error) errorList.push(error);
    }

    // IMPORT-17 Extraneous Test Summary Data Check
    error = this.import17Check(summary as TestSummaryImportDTO);
    if (error) errorList.push(error);

    this.throwIfErrors(errorList, isImport);
    return errorList;
  }

  // IMPORT-16 Inappropriate Children Records for Test Summary
  private import16Check(
    summary: TestSummaryImportDTO
  ): string {
    let error: string = null;
    const invalidChildRecords: string[] = [];

    if (summary.testTypeCode !== TestTypeCodes.RATA) {
      if (summary.rataData && summary.rataData.length > 0) {
        invalidChildRecords.push('RATA');
      }
      if (
        summary.testQualificationData &&
        summary.testQualificationData.length > 0
      ) {
        invalidChildRecords.push('Test Qualification');
      }
    }

    if (summary.testTypeCode !== TestTypeCodes.SEVENDAY) {
      if (
        summary.calibrationInjectionData &&
        summary.calibrationInjectionData.length > 0
      ) {
        invalidChildRecords.push('Calibration Injection');
      }
    }

    if (summary.testTypeCode !== TestTypeCodes.LINE) {
      if (
        summary.linearitySummaryData &&
        summary.linearitySummaryData.length > 0
      ) {
        invalidChildRecords.push('Linearity Summary');
      }
    }

    if (
      summary.testTypeCode !== TestTypeCodes.HGLINE &&
      summary.testTypeCode !== TestTypeCodes.HGSI3
    ) {
      if (summary.hgSummaryData && summary.hgSummaryData.length > 0) {
        invalidChildRecords.push('Hg Linearity or System Integrity Summary');
      }
    }

    if (summary.testTypeCode !== TestTypeCodes.F2LREF) {
      if (
        summary.flowToLoadReferenceData &&
        summary.flowToLoadReferenceData.length > 0
      ) {
        invalidChildRecords.push('Flow to Load Reference');
      }
    }

    if (summary.testTypeCode !== TestTypeCodes.F2LCHK) {
      if (
        summary.flowToLoadCheckData &&
        summary.flowToLoadCheckData.length > 0
      ) {
        invalidChildRecords.push('Flow to Load Check');
      }
    }

    if (summary.testTypeCode !== TestTypeCodes.CYCLE) {
      if (
        summary.cycleTimeSummaryData &&
        summary.cycleTimeSummaryData.length > 0
      ) {
        invalidChildRecords.push('Cycle Time Summary');
      }
    }

    if (summary.testTypeCode !== TestTypeCodes.ONOFF) {
      if (
        summary.onlineOfflineCalibrationData &&
        summary.onlineOfflineCalibrationData.length > 0
      ) {
        invalidChildRecords.push('Online Offline Calibration');
      }
    }

    if (summary.testTypeCode !== TestTypeCodes.FFACC) {
      if (
        summary.fuelFlowmeterAccuracyData &&
        summary.fuelFlowmeterAccuracyData.length > 0
      ) {
        invalidChildRecords.push('Fuel Flowmeter Accuracy');
      }
    }

    if (summary.testTypeCode !== TestTypeCodes.FFACCTT) {
      if (
        summary.transmitterTransducerData &&
        summary.transmitterTransducerData.length > 0
      ) {
        invalidChildRecords.push('Transmitter Transducer');
      }
    }

    if (summary.testTypeCode !== TestTypeCodes.FF2LBAS) {
      if (
        summary.fuelFlowToLoadBaselineData &&
        summary.fuelFlowToLoadBaselineData.length > 0
      ) {
        invalidChildRecords.push('Fuel Flow to Load Baseline');
      }
    }

    if (summary.testTypeCode !== TestTypeCodes.FF2LTST) {
      if (
        summary.fuelFlowToLoadTestData &&
        summary.fuelFlowToLoadTestData.length > 0
      ) {
        invalidChildRecords.push('Fuel Flow to Load Test');
      }
    }

    if (summary.testTypeCode !== TestTypeCodes.APPE) {
      if (
        summary.appECorrelationTestSummaryData &&
        summary.appECorrelationTestSummaryData.length > 0
      ) {
        invalidChildRecords.push('Appendix E Correlation Test Summary');
      }
    }

    if (summary.testTypeCode !== TestTypeCodes.UNITDEF) {
      if (
        summary.unitDefaultTestData &&
        summary.unitDefaultTestData.length > 0
      ) {
        invalidChildRecords.push('Unit Default Test');
      }
    }

    if (
      summary.testTypeCode !== TestTypeCodes.RATA &&
      summary.testTypeCode !== TestTypeCodes.LINE &&
      summary.testTypeCode !== TestTypeCodes.APPE &&
      summary.testTypeCode !== TestTypeCodes.UNITDEF
    ) {
      if (summary.protocolGasData && summary.protocolGasData.length > 0) {
        invalidChildRecords.push('Protocol Gas');
      }
    }

    if (
      summary.testTypeCode !== TestTypeCodes.RATA &&
      summary.testTypeCode !== TestTypeCodes.APPE &&
      summary.testTypeCode !== TestTypeCodes.UNITDEF
    ) {
      if (
        summary.airEmissionTestData &&
        summary.airEmissionTestData.length > 0
      ) {
        invalidChildRecords.push('Air Emission Test');
      }
    }

    if (invalidChildRecords.length > 0) {
      error = `You have reported invalid [${
          invalidChildRecords
        }] records for Test Summary record [${
          summary.testNumber
        }] with a Test Type Code of [${
          summary.testTypeCode
        }].`;
    }

    return error;
  }

  // TODO: Needs to be changed to non-import check and applied before create/update as well as import
  // IMPORT-17 Extraneous Test Summary Data Check
  private import17Check(
    summary: TestSummaryBaseDTO | TestSummaryImportDTO,
  ): string {
    let error: string = null;
    const properties: string[] = [];

    if (summary.testDescription &&
      summary.testDescription !== null &&
      summary.testTypeCode !== TestTypeCodes.OTHER
    ) {
      properties.push('Test Description');
    }

    if (summary.testResultCode &&
      summary.testResultCode !== null &&
      [
        TestTypeCodes.APPE.toString(),
        TestTypeCodes.F2LREF.toString(),
        TestTypeCodes.FF2LBAS.toString(),
        TestTypeCodes.UNITDEF.toString(),
      ].includes(summary.testTypeCode)
    ) {
      properties.push('Test Result Code');
    }

    if (summary.testReasonCode &&
      summary.testReasonCode !== null &&
      [
        TestTypeCodes.F2LREF.toString(),
        TestTypeCodes.FF2LBAS.toString(),
      ].includes(summary.testTypeCode)
    ) {
      properties.push('Test Reason Code');
    }    

    if (summary.spanScaleCode &&
      summary.spanScaleCode !== null &&
      [
        TestTypeCodes.LINE.toString(),
        TestTypeCodes.CYCLE.toString(),
        TestTypeCodes.ONOFF.toString(),
        TestTypeCodes.HGSI3.toString(),
        TestTypeCodes.HGLINE.toString(),
        TestTypeCodes.SEVENDAY.toString(),
      ].includes(summary.testTypeCode) === false
    ) {
      properties.push('Span Scale Code');
    }

    if (summary.gracePeriodIndicator &&
      summary.gracePeriodIndicator !== null &&
      summary.gracePeriodIndicator === 1 &&
      [
        TestTypeCodes.RATA.toString(),
        TestTypeCodes.LINE.toString(),
        TestTypeCodes.LEAK.toString(),
        TestTypeCodes.HGSI3.toString(),
        TestTypeCodes.HGLINE.toString(),
      ].includes(summary.testTypeCode) === false
    ) {
      properties.push('Grace Period Indicator');
    }

    if ([
        TestTypeCodes.APPE.toString(),
        TestTypeCodes.LINE.toString(),
        TestTypeCodes.RATA.toString(),
        TestTypeCodes.CYCLE.toString(),
        TestTypeCodes.ONOFF.toString(),
        TestTypeCodes.HGSI3.toString(),
        TestTypeCodes.HGLINE.toString(),
        TestTypeCodes.UNITDEF.toString(),
        TestTypeCodes.FF2LBAS.toString(),
        TestTypeCodes.SEVENDAY.toString(),
      ].includes(summary.testTypeCode) === false
    ) {
      if (summary.beginDate && summary.beginDate !== null) {
        properties.push('Begin Date');
      }

      if (summary.beginHour && summary.beginHour !== null) {
        properties.push('Begin Hour');
      }

      if (summary.beginMinute && summary.beginMinute !== null) {
        properties.push('Begin Minute');
      }
    }

    if ([
        TestTypeCodes.FF2LTST.toString(),
        TestTypeCodes.F2LCHK.toString(),
      ].includes(summary.testTypeCode)
    ) {
      if (summary.endDate && summary.endDate !== null) {
        properties.push('End Date');
      }

      if (summary.endHour && summary.endHour !== null) {
        properties.push('End Hour');
      }

      if (summary.endMinute && summary.endMinute !== null) {
        properties.push('End Minute');
      }
    } else {
      // TODO: confirm that this else goes with the above if based on check specs
      if (summary.year && summary.year !== null) {
        properties.push('Year');
      }

      if (summary.quarter && summary.quarter !== null) {
        properties.push('Quarter');
      }
    }

    if ([
        TestTypeCodes.ONOFF.toString(),
        TestTypeCodes.FF2LBAS.toString(),
      ].includes(summary.testTypeCode)
    ) {
      if (summary.beginMinute && summary.beginMinute !== null) {
        properties.push('Begin Minute');
      }

      if (summary.endMinute && summary.endMinute !== null) {
        properties.push('End Minute');
      }
    }    

    if (properties.length > 0) {
      error = `You have reported extraneous values for [${
          properties
        }] propert${properties.length > 1 ? 'ies' : 'y'} in Test Summary record for Unit/Stack [${
          summary.unitId ? summary.unitId : summary.stackPipeId
        }], Test Type Code [${
          summary.testTypeCode
        }], and Test Number [${
          summary.testNumber
        }]`;
    }

    return error;
  }
}
