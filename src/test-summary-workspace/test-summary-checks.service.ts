import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Logger } from '@us-epa-camd/easey-common/logger';

import {
  TestSummaryBaseDTO,
  TestSummaryImportDTO,
} from '../dto/test-summary.dto';

import { TestTypeCodes } from '../enums/test-type-code.enum';
import { TestSummary } from '../entities/workspace/test-summary.entity';
import { TestSummaryWorkspaceRepository } from './test-summary.repository';
import { QASuppData } from '../entities/workspace/qa-supp-data.entity';
import { QASuppDataWorkspaceRepository } from '../qa-supp-data-workspace/qa-supp-data.repository';

@Injectable()
export class TestSummaryChecksService {
  constructor(
    private readonly logger: Logger,
    @InjectRepository(TestSummaryWorkspaceRepository)
    private readonly repository: TestSummaryWorkspaceRepository,
    @InjectRepository(QASuppDataWorkspaceRepository)
    private readonly qaSuppDataRepository: QASuppDataWorkspaceRepository,
  ) {}

  private throwIfErrors(errorList: string[], isImport: boolean = false) {
    if (!isImport && errorList.length > 0) {
      this.logger.error(BadRequestException, errorList, true);
    }
  }

  async runChecks(
    locationId: string,
    summary: TestSummaryBaseDTO | TestSummaryImportDTO,
    summaries?: TestSummaryImportDTO[],
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
    error = this.import17Check(summary);
    if (error) errorList.push(error);

    error = await this.duplicateTestCheck(locationId, summary, summaries, isImport);
    if (error) errorList.push(error);

    this.throwIfErrors(errorList, isImport);
    return errorList;
  }

  // IMPORT-16 Inappropriate Children Records for Test Summary
  private import16Check(summary: TestSummaryImportDTO): string {
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
      error = `You have reported invalid [${invalidChildRecords}] records for Test Summary record [${summary.testNumber}] with a Test Type Code of [${summary.testTypeCode}].`;
    }

    return error;
  }

  // IMPORT-17 Extraneous Test Summary Data Check
  private import17Check(
    summary: TestSummaryBaseDTO | TestSummaryImportDTO,
  ): string {
    let error: string = null;
    const properties: string[] = [];

    if (
      summary.testDescription &&
      summary.testDescription !== null &&
      summary.testTypeCode !== TestTypeCodes.OTHER
    ) {
      properties.push('Test Description');
    }

    if (
      summary.testResultCode &&
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

    if (
      summary.testReasonCode &&
      summary.testReasonCode !== null &&
      [
        TestTypeCodes.F2LREF.toString(),
        TestTypeCodes.FF2LBAS.toString(),
      ].includes(summary.testTypeCode)
    ) {
      properties.push('Test Reason Code');
    }

    if (
      summary.spanScaleCode &&
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

    if (
      summary.gracePeriodIndicator &&
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

    if (
      [
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

    if (
      [
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
      if (summary.year && summary.year !== null) {
        properties.push('Year');
      }

      if (summary.quarter && summary.quarter !== null) {
        properties.push('Quarter');
      }
    }

    if (
      [
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
      error = `You have reported extraneous values for [${properties}] propert${
        properties.length > 1 ? 'ies' : 'y'
      } in Test Summary record for Unit/Stack [${
        summary.unitId ? summary.unitId : summary.stackPipeId
      }], Test Type Code [${summary.testTypeCode}], and Test Number [${
        summary.testNumber
      }]`;
    }

    return error;
  }

  private async duplicateTestCheck(
    locationId: string,
    summary: TestSummaryBaseDTO | TestSummaryImportDTO,
    summaries: TestSummaryImportDTO[] = [],
    isImport: boolean = false,
  ): Promise<string> {
    let error: string = null;
    let fields: string[] = [];
    let duplicate: TestSummary | QASuppData;

    const duplicates = summaries.filter(i => {
      return (
        i.unitId === summary.unitId &&
        i.stackPipeId === summary.stackPipeId &&
        i.testTypeCode === summary.testTypeCode &&
        i.testNumber === summary.testNumber
      );
    });

    // IMPORT-20 Duplicate Test Check
    if (duplicates.length > 1) {
      error = `You have reported multiple Test Summary records for Unit/Stack [${
        summary.unitId ? summary.unitId : summary.stackPipeId
      }], Test Type Code [${summary.testTypeCode}], and Test Number [${
        summary.testNumber
      }]`;
    }    

    duplicate = await this.repository.getTestSummaryByLocationId(
      locationId,
      summary.testTypeCode,
      summary.testNumber,
    );

    if (duplicate) {
      if (isImport) {
        fields = this.compareFields(duplicate, summary);
      } else {
        // LINEAR-31 Duplicate Linearity (Result A)
        error = `The database contains another Test Summary record for Unit/Stack [${
          summary.unitId ? summary.unitId : summary.stackPipeId
        }], Test Type Code [${summary.testTypeCode}], and Test Number [${
          summary.testNumber
        }]. You must assign a different test number.`;
      }
    }
    else {
      duplicate = await this.qaSuppDataRepository.getQASuppDataByLocationId(
        locationId,
        summary.testTypeCode,
        summary.testNumber,
      );
      
      if (duplicate) {
        if (isImport) {
          fields = this.compareFields(duplicate, summary);
        } else {
          // LINEAR-31 Duplicate Linearity (Result B)
          error = `The database contains another Test Summary record for Unit/Stack [${
            summary.unitId ? summary.unitId : summary.stackPipeId
          }], Test Type Code [${summary.testTypeCode}], and Test Number [${
            summary.testNumber
          }]. You cannot change the Test Number to the value that you have entered, because a test with this Test Type and Test Number has already been submitted. If this is a different test, you should assign it a different Test Number. If you are trying to resubmit this test, you should delete this test, and either reimport this test with its original Test Number or retrieve the original test from the EPA host system.`;
        }
      }
    }

    // IMPORT-21 Duplicate Test Number Check
    if (fields.length > 0) {
      error = `The database contains another Test Summary record for Unit/Stack [${
        summary.unitId ? summary.unitId : summary.stackPipeId
      }], Test Type Code [${summary.testTypeCode}], and Test Number [${
        summary.testNumber
      }]. However, the values reported for [${fields}] are different between the two tests.`;
    }

    return error;
  }

  private compareFields(
    duplicate: TestSummary | QASuppData,
    summary: TestSummaryBaseDTO | TestSummaryImportDTO,
  ): string[] {
    const fields: string[] = [];

    if ((duplicate.system === null && summary.monitoringSystemId) ||
        (duplicate.system && duplicate.system.monitoringSystemId !== summary.monitoringSystemId)
    ) {
      fields.push('Monitoring System Id');
    }

    if ((duplicate.component === null && summary.componentId) ||
        (duplicate.component && duplicate.component.componentId !== summary.componentId)
    ) {
      fields.push('Component Id');
    }

    if (duplicate.spanScaleCode !== summary.spanScaleCode) {
      fields.push('Span Scale Code');
    }

    if (duplicate.endDate !== summary.endDate) {
      fields.push('End Date');
    }

    if (duplicate.endHour !== summary.endHour) {
      fields.push('End Hour');
    }

    if ((duplicate.reportingPeriod === null && summary.year) ||
        (duplicate.reportingPeriod && duplicate.reportingPeriod.year !== summary.year)
    ) {
      fields.push('Year');
    }
    if ((duplicate.reportingPeriod === null && summary.quarter) ||
        (duplicate.reportingPeriod && duplicate.reportingPeriod.quarter !== summary.quarter)
    ) {
      fields.push('Quarter');
    }

    if (fields.length === 0) {
      if (summary.endMinute &&
          duplicate.endMinute &&
          duplicate.endMinute !== summary.endMinute
      ) {
        fields.push('End Minute');
      }
    }

    return fields;
  }
}
