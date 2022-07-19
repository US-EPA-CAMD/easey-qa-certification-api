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
import { QAMonitorPlanWorkspaceRepository } from '../qa-monitor-plan-workspace/qa-monitor-plan.repository';
import { MonitorPlan } from '../entities/workspace/monitor-plan.entity';
import { Component } from '../entities/workspace/component.entity';
import { ComponentWorkspaceRepository } from '../component-workspace/component.repository';
import { AnalyzerRangeWorkspaceRepository } from '../analyzer-range-workspace/analyzer-range.repository';

@Injectable()
export class TestSummaryChecksService {
  constructor(
    private readonly logger: Logger,
    @InjectRepository(TestSummaryWorkspaceRepository)
    private readonly repository: TestSummaryWorkspaceRepository,
    @InjectRepository(QASuppDataWorkspaceRepository)
    private readonly qaSuppDataRepository: QASuppDataWorkspaceRepository,
    @InjectRepository(QAMonitorPlanWorkspaceRepository)
    private readonly qaMonitorPlanRepository: QAMonitorPlanWorkspaceRepository,
    @InjectRepository(ComponentWorkspaceRepository)
    private readonly componentRepository: ComponentWorkspaceRepository,
    @InjectRepository(AnalyzerRangeWorkspaceRepository)
    private readonly analyzerRangeRepository: AnalyzerRangeWorkspaceRepository,
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
      if (error) {
        errorList.push(error);
      }
    }

    if (isImport) {
      // IMPORT-17 Extraneous Test Summary Data Check
      error = this.import17Check(locationId, summary);
      if (error) {
        errorList.push(error);
      }
    }

    // TEST-3 Test Begin Minute Valid
    error = await this.testMinuteField(summary, locationId, 'beginMinute');
    if (error) {
      errorList.push(error);
    }

    // TEST-6 Test End Minute Valid
    error = await this.testMinuteField(summary, locationId, 'endMinute');
    if (error) {
      errorList.push(error);
    }

    // TEST-7 Test Dates Consistent
    // NOTE: beginMinute and endMinute validity tests need to run before this test
    error = this.test7Check(summary);
    if (error) {
      errorList.push(error);
    }

    // LINEAR-4 Identification of Previously Reported Test or Test Number for Linearity Check
    error = await this.linear4Check(locationId, summary, isImport);
    if (error) {
      errorList.push(error);
    }

    // TEST-8 Test Span Scale Valid
    error = await this.testSpanScale(locationId, summary);
    if (error) {
      errorList.push(error);
    }

    // TEST-23 Injection Protocol Valid
    error = await this.testInjectionProtocol(locationId, summary);
    if (error) {
      errorList.push(error);
    }

    error = await this.duplicateTestCheck(
      locationId,
      summary,
      summaries,
      isImport,
    );
    if (error) {
      errorList.push(error);
    }

    this.throwIfErrors(errorList, isImport);
    this.logger.info('Completed Test Summary Checks');
    return errorList;
  }

  // IMPORT-16 Inappropriate Children Records for Test Summary
  private import16Check(summary: TestSummaryImportDTO): string {
    let error: string = null;
    const invalidChildRecords: string[] = [];

    if (summary.testTypeCode !== TestTypeCodes.RATA) {
      if (summary.rataData?.length > 0) {
        invalidChildRecords.push('RATA');
      }
      if (summary.testQualificationData?.length > 0) {
        invalidChildRecords.push('Test Qualification');
      }
    }

    if (
      summary.testTypeCode !== TestTypeCodes.SEVENDAY &&
      summary.calibrationInjectionData?.length > 0
    ) {
      invalidChildRecords.push('Calibration Injection');
    }

    if (
      summary.testTypeCode !== TestTypeCodes.LINE &&
      summary.linearitySummaryData?.length > 0
    ) {
      invalidChildRecords.push('Linearity Summary');
    }

    if (
      summary.testTypeCode !== TestTypeCodes.HGLINE &&
      summary.testTypeCode !== TestTypeCodes.HGSI3 &&
      summary.hgSummaryData?.length > 0
    ) {
      invalidChildRecords.push('Hg Linearity or System Integrity Summary');
    }

    if (
      summary.testTypeCode !== TestTypeCodes.F2LREF &&
      summary.flowToLoadReferenceData?.length > 0
    ) {
      invalidChildRecords.push('Flow to Load Reference');
    }

    if (
      summary.testTypeCode !== TestTypeCodes.F2LCHK &&
      summary.flowToLoadCheckData?.length > 0
    ) {
      invalidChildRecords.push('Flow to Load Check');
    }

    if (
      summary.testTypeCode !== TestTypeCodes.CYCLE &&
      summary.cycleTimeSummaryData?.length > 0
    ) {
      invalidChildRecords.push('Cycle Time Summary');
    }

    if (
      summary.testTypeCode !== TestTypeCodes.ONOFF &&
      summary.onlineOfflineCalibrationData?.length > 0
    ) {
      invalidChildRecords.push('Online Offline Calibration');
    }

    if (
      summary.testTypeCode !== TestTypeCodes.FFACC &&
      summary.fuelFlowmeterAccuracyData?.length > 0
    ) {
      invalidChildRecords.push('Fuel Flowmeter Accuracy');
    }

    if (
      summary.testTypeCode !== TestTypeCodes.FFACCTT &&
      summary.transmitterTransducerData?.length > 0
    ) {
      invalidChildRecords.push('Transmitter Transducer');
    }

    if (
      summary.testTypeCode !== TestTypeCodes.FF2LBAS &&
      summary.fuelFlowToLoadBaselineData?.length > 0
    ) {
      invalidChildRecords.push('Fuel Flow to Load Baseline');
    }

    if (
      summary.testTypeCode !== TestTypeCodes.FF2LTST &&
      summary.fuelFlowToLoadTestData?.length > 0
    ) {
      invalidChildRecords.push('Fuel Flow to Load Test');
    }

    if (
      summary.testTypeCode !== TestTypeCodes.APPE &&
      summary.appECorrelationTestSummaryData?.length > 0
    ) {
      invalidChildRecords.push('Appendix E Correlation Test Summary');
    }

    if (
      summary.testTypeCode !== TestTypeCodes.UNITDEF &&
      summary.unitDefaultTestData?.length > 0
    ) {
      invalidChildRecords.push('Unit Default Test');
    }

    if (
      ![
        TestTypeCodes.RATA.toString(),
        TestTypeCodes.LINE.toString(),
        TestTypeCodes.APPE.toString(),
        TestTypeCodes.UNITDEF.toString(),
      ].includes(summary.testTypeCode) &&
      summary.protocolGasData?.length > 0
    ) {
      invalidChildRecords.push('Protocol Gas');
    }

    if (
      ![
        TestTypeCodes.RATA.toString(),
        TestTypeCodes.APPE.toString(),
        TestTypeCodes.UNITDEF.toString(),
      ].includes(summary.testTypeCode) &&
      summary.airEmissionTestData?.length > 0
    ) {
      invalidChildRecords.push('Air Emission Test');
    }

    if (invalidChildRecords.length > 0) {
      error = `You have reported invalid [${invalidChildRecords}] records for a Test Summary record with a Test Type Code of [${summary.testTypeCode}]. This file was not imported.`;
    }

    return error;
  }

  // IMPORT-17 Extraneous Test Summary Data Check
  private import17Check(
    locationId: string,
    summary: TestSummaryBaseDTO | TestSummaryImportDTO,
  ): string {
    let error: string = null;
    const extraneousTestSummaryFields: string[] = [];

    if (
      summary.testDescription &&
      summary.testDescription !== null &&
      summary.testTypeCode !== TestTypeCodes.OTHER
    ) {
      extraneousTestSummaryFields.push('TestDescription');
    }

    if (
      summary.testResultCode &&
      summary.testResultCode !== null &&
      [
        TestTypeCodes.FF2LBAS.toString(),
        TestTypeCodes.F2LREF.toString(),
        TestTypeCodes.APPE.toString(),
        TestTypeCodes.UNITDEF.toString(),
      ].includes(summary.testTypeCode)
    ) {
      extraneousTestSummaryFields.push('TestResultCode');
    }

    if (
      summary.spanScaleCode &&
      summary.spanScaleCode !== null &&
      ![
        TestTypeCodes.SEVENDAY.toString(),
        TestTypeCodes.LINE.toString(),
        TestTypeCodes.CYCLE.toString(),
        TestTypeCodes.ONOFF.toString(),
        TestTypeCodes.HGLINE.toString(),
        TestTypeCodes.HGSI3.toString(),
      ].includes(summary.testTypeCode)
    ) {
      extraneousTestSummaryFields.push('SpanScaleCode');
    }

    if (
      summary.testReasonCode &&
      summary.testReasonCode !== null &&
      [
        TestTypeCodes.FF2LBAS.toString(),
        TestTypeCodes.F2LREF.toString(),
      ].includes(summary.testTypeCode)
    ) {
      extraneousTestSummaryFields.push('TestReasonCode');
    }

    if (
      summary.gracePeriodIndicator &&
      summary.gracePeriodIndicator === 1 &&
      ![
        TestTypeCodes.RATA.toString(),
        TestTypeCodes.LINE.toString(),
        TestTypeCodes.LEAK.toString(),
        TestTypeCodes.HGLINE.toString(),
        TestTypeCodes.HGSI3.toString(),
      ].includes(summary.testTypeCode)
    ) {
      extraneousTestSummaryFields.push('GracePeriodIndicator');
    }

    if (
      ![
        TestTypeCodes.RATA.toString(),
        TestTypeCodes.SEVENDAY.toString(),
        TestTypeCodes.LINE.toString(),
        TestTypeCodes.CYCLE.toString(),
        TestTypeCodes.ONOFF.toString(),
        TestTypeCodes.FF2LBAS.toString(),
        TestTypeCodes.APPE.toString(),
        TestTypeCodes.UNITDEF.toString(),
        TestTypeCodes.HGSI3.toString(),
        TestTypeCodes.HGLINE.toString(),
      ].includes(summary.testTypeCode)
    ) {
      if (summary.beginDate && summary.beginDate !== null) {
        extraneousTestSummaryFields.push('BeginDate');
      }

      if (summary.beginHour && summary.beginHour !== null) {
        extraneousTestSummaryFields.push('BeginHour');
      }

      if (summary.beginMinute && summary.beginMinute !== null) {
        extraneousTestSummaryFields.push('BeginMinute');
      }
    }

    if (
      [
        TestTypeCodes.FF2LTST.toString(),
        TestTypeCodes.F2LCHK.toString(),
      ].includes(summary.testTypeCode)
    ) {
      if (summary.endDate && summary.endDate !== null) {
        extraneousTestSummaryFields.push('EndDate');
      }

      if (summary.endHour && summary.endHour !== null) {
        extraneousTestSummaryFields.push('EndHour');
      }

      if (summary.endMinute && summary.endMinute !== null) {
        extraneousTestSummaryFields.push('EndMinute');
      }
    } else {
      if (summary.year && summary.year !== null) {
        extraneousTestSummaryFields.push('Year');
      }

      if (summary.quarter && summary.quarter !== null) {
        extraneousTestSummaryFields.push('Quarter');
      }
    }

    if (
      [
        TestTypeCodes.FF2LBAS.toString(),
        TestTypeCodes.ONOFF.toString(),
      ].includes(summary.testTypeCode)
    ) {
      if (summary.beginMinute && summary.beginMinute !== null) {
        extraneousTestSummaryFields.push('BeginMinute');
      }

      if (summary.endMinute && summary.endMinute !== null) {
        extraneousTestSummaryFields.push('EndMinute');
      }
    }

    if (extraneousTestSummaryFields.length > 0) {
      error = `An extraneous value has been reported for [${extraneousTestSummaryFields}] in the Test Summary record for Location [${locationId}], TestTypeCode [${summary.testTypeCode}] and Test Number [${summary.testNumber}]. This value was not imported.`;
    }

    return error;
  }

  // IMPORT-20 Duplicate Test Check
  // LINEAR-31 Duplicate Linearity (Result A)
  // LINEAR-31 Duplicate Linearity (Result B)
  // IMPORT-21 Duplicate Test Number Check
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
      }

      // LINEAR-31 Duplicate Linearity (Result A)
      error = `Another Test Summary record for Unit/Stack [${
        summary.unitId ? summary.unitId : summary.stackPipeId
      }], Test Type Code [${summary.testTypeCode}], and Test Number [${
        summary.testNumber
      }]. You must assign a different test number.`;
    } else {
      duplicate = await this.qaSuppDataRepository.getQASuppDataByLocationId(
        locationId,
        summary.testTypeCode,
        summary.testNumber,
      );

      if (duplicate) {
        if (isImport) {
          fields = this.compareFields(duplicate, summary);
        }

        // LINEAR-31 Duplicate Linearity (Result B)
        error = `Another Test Summary record for Unit/Stack [${
          summary.unitId ? summary.unitId : summary.stackPipeId
        }], Test Type Code [${summary.testTypeCode}], and Test Number [${
          summary.testNumber
        }]. You cannot change the Test Number to the value that you have entered, because a test with this Test Type and Test Number has already been submitted. If this is a different test, you should assign it a different Test Number. If you are trying to resubmit this test, you should delete this test, and either reimport this test with its original Test Number or retrieve the original test from the EPA host system.`;
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

  // TEST-3 & TEST-6: Test Begin/End Minute Valid
  async testMinuteField(
    summary: TestSummaryBaseDTO,
    locationId: string,
    minuteField: string,
  ): Promise<string> {
    const resultA = `You did not provide [${minuteField}], which is required for [Test Summary].`;
    const resultB = `You did not provide [${minuteField}] for [Test Summary]. This information will be required for ECMPS submissions.`;

    if (
      minuteField === 'endMinute' &&
      summary.testTypeCode.toUpperCase() === TestTypeCodes.ONOFF
    )
      return null;

    if (summary[minuteField] === null || summary[minuteField] === undefined) {
      const listOfCodes = [
        TestTypeCodes.LINE,
        TestTypeCodes.RATA,
        TestTypeCodes.CYCLE,
        TestTypeCodes.F2LREF,
        TestTypeCodes.APPE,
        TestTypeCodes.UNITDEF,
      ];
      const isSummaryTTCinListOfCodes: boolean = listOfCodes
        .map(ttc => ttc.toString())
        .includes(summary.testTypeCode);

      if (isSummaryTTCinListOfCodes) {
        return resultA;
      }

      // Test MP Begin Date
      try {
        const mp: MonitorPlan = await this.qaMonitorPlanRepository.getMonitorPlanWithALowerBeginDate(
          locationId,
          summary.unitId,
          summary.stackPipeId,
          summary[minuteField],
        );

        this.qaMonitorPlanRepository.find();
        if (mp) return resultA;
      } catch (e) {
        console.error(e);
      }

      return resultB;
    }

    return null;
  }

  // TEST-7 Test Dates Consistent
  test7Check(summary: TestSummaryBaseDTO): string {
    const errorResponse = `You reported endDate, endHour, and endMinute which is prior to or equal to beginDate, beginHour, and beginMinute for [Test Summary].`;
    const testTypeCode = summary.testTypeCode.toUpperCase();

    // cannot call getFullYear and other functions unless we do new Date
    const summaryBeginDate = new Date(summary.beginDate);

    const summaryEndDate = new Date(summary.endDate);
    // need to add a 0 in front if the hour is a single digit or else new Date() will through error
    const beginHour =
      summary.beginHour > 9 ? summary.beginHour : `0${summary.beginHour}`;
    const endHour =
      summary.endHour > 9 ? summary.endHour : `0${summary.endHour}`;
    const beginMinute =
      summary.beginMinute > 9 ? summary.beginMinute : `0${summary.beginMinute}`;
    const endMinute =
      summary.endMinute > 9 ? summary.endMinute : `0${summary.endMinute}`;

    // creates a date string in format yyyy-mm-dd
    const beginDate = `${summaryBeginDate.getFullYear()}-${
      summaryBeginDate.getMonth() < 10 ? '0' : ''
    }${summaryBeginDate.getMonth()}-${
      summaryBeginDate.getDay() < 10 ? '0' : ''
    }${summaryBeginDate.getDay()}`;
    const endDate = `${summaryEndDate.getFullYear()}-${
      summaryEndDate.getMonth() < 10 ? '0' : ''
    }${summaryEndDate.getMonth()}-${
      summaryEndDate.getDay() < 10 ? '0' : ''
    }${summaryEndDate.getDay()}`;

    if (
      testTypeCode === TestTypeCodes.ONOFF.toString() ||
      testTypeCode === TestTypeCodes.FF2LBAS.toString()
    ) {
      // then create a datetime string in format yyyy-mm-dd:hh:mm
      const beginDateHour = new Date(`${beginDate}T${beginHour}:00`);
      const endDateHour = new Date(`${endDate}T${endHour}:00`);

      if (beginDateHour >= endDateHour) return errorResponse;
    } else {
      const beginDateHourMinute = new Date(
        `${beginDate}T${beginHour}:${beginMinute}`,
      );
      const endDateHourMinute = new Date(`${endDate}T${endHour}:${endMinute}`);

      if (beginDateHourMinute >= endDateHourMinute) return errorResponse;
    }

    return null;
  }

  // TEST-8 - Test Span Scale Valid
  private async testSpanScale(
    locationId: string,
    summary: TestSummaryBaseDTO,
  ): Promise<string> {
    const testDateConsistent = this.test7Check(summary);

    const resultA = `You did not provide Span Scale Code, which is required for Test Summary.`;
    const resultB = `You reported the value ${summary.spanScaleCode}, which is not in the list of valid values, in the field
    Span Scale Code for Test Summary.`;
    const resultC = `The active Analyzer Range for the Component is inconsistent with the Span Scale ${summary.spanScaleCode}
    reported for this test.`;
    const resultD = `You reported a SpanScaleCode, but this is not appropriate for flow component.`;

    if (summary.componentID) {
      const component = await this.componentRepository.findOne({
        componentID: summary.componentID,
        locationId: locationId,
      });
      if (component?.componentTypeCode !== 'FLOW') {
        if (summary.spanScaleCode === null) {
          return resultA;
        }
        if (!['H', 'L'].includes(summary.spanScaleCode)) {
          return resultB;
        }

        if (!testDateConsistent) {
          let analyzerRangeCode: string;
          if (summary.spanScaleCode === 'H') {
            analyzerRangeCode = 'L';
          }
          if (summary.spanScaleCode === 'L') {
            analyzerRangeCode = 'H';
          }

          const analyerRanges = await this.analyzerRangeRepository.getAnalyzerRangeByComponentIdAndDate(
            component.id,
            summary,
          );

          const analyerRange = analyerRanges.find(i => {
            return (
              i.analyzerRangeCode === analyzerRangeCode &&
              i.componentRecordId === component.id
            );
          });

          if (analyerRange) {
            return resultC;
          }
        }
      } else {
        if (summary.spanScaleCode !== null) {
          return resultD;
        }
      }
    }

    return null;
  }

  private async testInjectionProtocol(
    locationId: string,
    summary: TestSummaryBaseDTO,
  ) {
    let message: string;
    const resultA = `You did not identify an injection protocol (HGE or HGO), as required for a Hg CEMS seven day calibration or cycle time test`;
    const resultC = `An injection protocol is only reported for Hg CEMS.`;
    const resultD = `An injection protocol is not required for this test type.`;

    if (['7DAY', 'CYCLE'].includes(summary.testTypeCode)) {
      const component = await this.componentRepository.findOne({
        componentID: summary.componentID,
        locationId,
      });

      if (component) {
        if (component.componentTypeCode === 'HG') {
          if (summary.injectionProtocolCode) {
            message = resultA;
            return message;
          } else if (['HGE', 'HGO'].includes(summary.injectionProtocolCode)) {
            message = resultA;
            return message;
          } else {
            if (summary.injectionProtocolCode !== null) {
              message = resultC;
              return message;
            }
          }
        }
      }
    } else {
      if (summary.injectionProtocolCode !== null) {
        message = resultD;
        return message;
      }
    }

    return null;
  }

  private compareFields(
    duplicate: TestSummary | QASuppData,
    summary: TestSummaryBaseDTO | TestSummaryImportDTO,
  ): string[] {
    const fields: string[] = [];

    if (
      (duplicate.system === null && summary.monitoringSystemID) ||
      (duplicate.system &&
        duplicate.system.monitoringSystemID !== summary.monitoringSystemID)
    ) {
      fields.push('Monitoring System Id');
    }

    if (
      (duplicate.component === null && summary.componentID) ||
      (duplicate.component &&
        duplicate.component.componentID !== summary.componentID)
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

    if (
      (duplicate.reportingPeriod === null && summary.year) ||
      (duplicate.reportingPeriod &&
        duplicate.reportingPeriod.year !== summary.year)
    ) {
      fields.push('Year');
    }
    if (
      (duplicate.reportingPeriod === null && summary.quarter) ||
      (duplicate.reportingPeriod &&
        duplicate.reportingPeriod.quarter !== summary.quarter)
    ) {
      fields.push('Quarter');
    }

    if (fields.length === 0) {
      if (
        summary.endMinute &&
        duplicate.endMinute &&
        duplicate.endMinute !== summary.endMinute
      ) {
        fields.push('End Minute');
      }
    }

    return fields;
  }

  // LINEAR-4 Identification of Previously Reported Test or Test Number for Linearity Check
  private async linear4Check(
    locationId: string,
    summary: TestSummaryBaseDTO | TestSummaryImportDTO,
    _isImport: boolean = false,
  ): Promise<string> {
    let error: string = null;
    let duplicateQaSupp: TestSummary | QASuppData;

    const duplicateTestSum = await this.repository.findOne({
      testTypeCode: summary.testTypeCode,
      spanScaleCode: summary.spanScaleCode,
      endDate: summary.endDate,
      endHour: summary.endHour,
      endMinute: summary.endMinute,
    });

    if (duplicateTestSum) {
      error = `Based on the information in this record, this test has already been submitted with a different test number, or the Client Tool database already contains the same test with a different test number. This test cannot be submitted.`;
    } else {
      duplicateQaSupp = await this.qaSuppDataRepository.getQASuppDataByTestTypeCodeComponentIdEndDateEndTime(
        locationId,
        summary.componentID,
        summary.testTypeCode,
        summary.testNumber,
        summary.spanScaleCode,
        summary.endDate,
        summary.endHour,
        summary.endMinute,
      );

      if (duplicateQaSupp) {
        error = `Based on the information in this record, this test has already been submitted with a different test number, or the Client Tool database already contains the same test with a different test number. This test cannot be submitted.`;
      } else {
        // TODO: BLOCKED DUE TO COLUMN DOESNOT EXISTS IN DATABASE
        /* duplicateQaSupp = await this.qaSuppDataRepository.findOne({
          locationId: locationId,
          testTypeCode: summary.testTypeCode,
          testNumber: summary.testNumber,
        });

        if (duplicateQaSupp) {
          if (duplicateQaSupp.canSubmit === 'N') {
            if (
              duplicateQaSupp.testSumId !== duplicateTestSum.id &&
              duplicateQaSupp.component.componentID !== summary.componentID &&
              duplicateQaSupp.spanScaleCode !== summary.spanScaleCode &&
              duplicateQaSupp.endDate !== summary.endDate &&
              duplicateQaSupp.endHour !== summary.endHour &&
              duplicateQaSupp.endMinute !== summary.endMinute
            ) {
              error = `Another [${duplicateQaSupp.testTypeCode}] with this test number [${duplicateQaSupp.testNumber}] has already been submitted for this location. This test cannot be submitted with this test number. If this is a different test, you should assign it a unique test number.`;
            } else {
              error = `This test has already been submitted and will not be resubmitted. If you wish to resubmit this test, please contact EPA for approval.`;
            }
          }
        } */
      }
    }

    return error;
  }
}
