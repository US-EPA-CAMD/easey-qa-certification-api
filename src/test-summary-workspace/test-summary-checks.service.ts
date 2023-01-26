import { InjectRepository } from '@nestjs/typeorm';
import { HttpStatus, Injectable } from '@nestjs/common';

import { Logger } from '@us-epa-camd/easey-common/logger';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';

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
import { ComponentWorkspaceRepository } from '../component-workspace/component.repository';
import { AnalyzerRangeWorkspaceRepository } from '../analyzer-range-workspace/analyzer-range.repository';
import { TestSummaryMasterDataRelationshipRepository } from '../test-summary-master-data-relationship/test-summary-master-data-relationship.repository';
import { MonitorSystemRepository } from '../monitor-system/monitor-system.repository';
import { MonitorMethodRepository } from '../monitor-method/monitor-method.repository';
import { TestResultCodeRepository } from '../test-result-code/test-result-code.repository';
import {
  BEGIN_DATE_TEST_TYPE_CODES,
  BEGIN_MINUTE_TEST_TYPE_CODES,
  VALID_CODES_FOR_END_MINUTE_VALIDATION,
} from '../utilities/constants';

const KEY = 'Test Summary';

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
    @InjectRepository(TestSummaryMasterDataRelationshipRepository)
    private readonly testSummaryRelationshipsRepository: TestSummaryMasterDataRelationshipRepository,
    @InjectRepository(MonitorSystemRepository)
    private readonly monitorSystemRepository: MonitorSystemRepository,
    @InjectRepository(MonitorMethodRepository)
    private readonly monitorMethodRepository: MonitorMethodRepository,
    @InjectRepository(TestResultCodeRepository)
    private readonly testResultCodeRepository: TestResultCodeRepository,
  ) {}

  private throwIfErrors(errorList: string[], isImport: boolean = false) {
    if (!isImport && errorList.length > 0) {
      throw new LoggingException(errorList, HttpStatus.BAD_REQUEST);
    }
  }

  async runChecks(
    locationId: string,
    summary: TestSummaryBaseDTO | TestSummaryImportDTO,
    isImport: boolean = false,
    isUpdate: boolean = false,
    summaries?: TestSummaryImportDTO[],
    historicalTestSumId?: string,
  ): Promise<string[]> {
    let error: string = null;
    const errorList: string[] = [];
    this.logger.info('Running Test Summary Checks');

    if (!isImport) {
      const duplicateQaSupp = await this.qaSuppDataRepository.getQASuppDataByTestTypeCodeComponentIdEndDateEndTime(
        locationId,
        summary.componentID,
        summary.testTypeCode,
        summary.testNumber,
        summary.spanScaleCode,
        summary.endDate,
        summary.endHour,
        summary.endMinute,
      );
      historicalTestSumId = duplicateQaSupp?.testSumId;
    }

    if (isImport) {
      // IMPORT-16 Inappropriate Children Records for Test Summary
      error = this.import16Check(summary as TestSummaryImportDTO);
      if (error) {
        errorList.push(error);
      }

      // IMPORT-17 Extraneous Test Summary Data Check
      error = this.import17Check(locationId, summary);
      if (error) {
        errorList.push(error);
      }

      // IMPORT-18 System and Component Check
      error = await this.import18Check(locationId, summary);
      if (error) {
        errorList.push(error);
      }

      // Import-19 Inappropriate Children Record for RATA
      error = await this.import19Check(
        locationId,
        summary as TestSummaryImportDTO,
      );
      if (error) {
        errorList.push(error);
      }

      // IMPORT-33 Inappropriate Test Type For Location
      error = this.import33Check(summary as TestSummaryImportDTO);
      if (error) {
        errorList.push(error);
      }
    }

    // TEST-3 Test Begin Minute Valid
    if (BEGIN_DATE_TEST_TYPE_CODES.includes(summary.testTypeCode)) {
      error = await this.testMinuteField(summary, locationId, 'beginMinute');
      if (error) {
        errorList.push(error);
      }
    }

    if (VALID_CODES_FOR_END_MINUTE_VALIDATION.includes(summary.testTypeCode)) {
      // TEST-6 Test End Minute Valid
      error = await this.testMinuteField(summary, locationId, 'endMinute');
      if (error) {
        errorList.push(error);
      }
    }

    // TEST-7 Test Dates Consistent
    // NOTE: beginMinute and endMinute validity tests need to run before this test
    error = this.test7Check(summary);
    if (error) {
      errorList.push(error);
    }

    if (summary.testTypeCode === TestTypeCodes.LINE) {
      // LINEAR-10 Linearity Test Result Code Valid
      error = await this.linear10Check(summary);
      if (error) {
        errorList.push(error);
      }
    }

    // TEST-8 Test Span Scale Valid
    error = await this.test8Check(locationId, summary);
    if (error) {
      errorList.push(error);
    }

    // TEST-23 Injection Protocol Valid
    error = await this.test23Check(locationId, summary);
    if (error) {
      errorList.push(error);
    }

    if (!isUpdate) {
      // LINEAR-4 Identification of Previously Reported Test or Test Number for Linearity Check
      error = await this.linear4Check(
        locationId,
        summary,
        historicalTestSumId,
        isImport,
      );
      if (error) {
        errorList.push(error);
      }

      error = await this.duplicateTestCheck(
        locationId,
        summary,
        summaries,
        historicalTestSumId,
        isImport,
      );
      if (error) {
        errorList.push(error);
      }
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
      summary.airEmissionTestingData?.length > 0
    ) {
      invalidChildRecords.push('Air Emission Test');
    }

    if (invalidChildRecords.length > 0) {
      error = this.getMessage('IMPORT-16-A', {
        inappropriateChildren: invalidChildRecords,
        testTypeCode: summary.testTypeCode,
      });
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
      error = this.getMessage('IMPORT-17-A', {
        fieldname: extraneousTestSummaryFields,
        locationID: summary.unitId ? summary.unitId : summary.stackPipeId,
        testTypeCode: summary.testTypeCode,
        testNumber: summary.testNumber,
      });
    }

    return error;
  }

  // IMPORT-18 System and Component Check
  private async import18Check(
    locationId: string,
    summary: TestSummaryBaseDTO | TestSummaryImportDTO,
  ): Promise<string> {
    const locTestTypeNumber = {
      locationID: summary.unitId ? summary.unitId : summary.stackPipeId,
      testTypeCode: summary.testTypeCode,
      testNumber: summary.testNumber,
    };

    const resultA = this.getMessage('IMPORT-18-A', locTestTypeNumber);
    const resultB = this.getMessage('IMPORT-18-B', {
      ...locTestTypeNumber,
      component: summary.componentID,
    });
    const resultC = this.getMessage('IMPORT-18-C', locTestTypeNumber);
    const resultD = this.getMessage('IMPORT-18-D', {
      ...locTestTypeNumber,
      system: summary.monitoringSystemID,
    });
    const resultE = this.getMessage('IMPORT-18-E', locTestTypeNumber);
    const resultF = this.getMessage('IMPORT-18-F', locTestTypeNumber);

    const monitorSystem = await this.monitorSystemRepository.findOne({
      where: {
        monitoringSystemID: summary.monitoringSystemID,
      },
    });

    const component = await this.componentRepository.findOne({
      componentID: summary.componentID,
      locationId: locationId,
    });

    if (
      [
        TestTypeCodes.SEVENDAY.toString(),
        TestTypeCodes.LINE.toString(),
        TestTypeCodes.CYCLE.toString(),
        TestTypeCodes.ONOFF.toString(),
        TestTypeCodes.FFACC.toString(),
        TestTypeCodes.FFACCTT.toString(),
        TestTypeCodes.HGSI3.toString(),
        TestTypeCodes.HGLINE.toString(),
      ].includes(summary.testTypeCode)
    ) {
      if (summary.monitoringSystemID || !summary.componentID) {
        return resultA;
      } else {
        if (
          [
            TestTypeCodes.SEVENDAY.toString(),
            TestTypeCodes.ONOFF.toString(),
            TestTypeCodes.CYCLE.toString(),
            TestTypeCodes.LINE.toString(),
          ].includes(summary.testTypeCode)
        ) {
          if (
            !['SO2', 'CO2', 'NOX', 'O2', 'FLOW', 'HG'].includes(
              component.componentTypeCode,
            )
          ) {
            return resultB;
          }
        }

        if (
          [
            TestTypeCodes.HGSI3.toString(),
            TestTypeCodes.HGLINE.toString(),
          ].includes(summary.testTypeCode)
        ) {
          if (component.componentTypeCode !== 'HG') {
            return resultB;
          }
        }

        if (
          [
            TestTypeCodes.FFACC.toString(),
            TestTypeCodes.FFACCTT.toString(),
          ].includes(summary.testTypeCode)
        ) {
          if (!['OFFM', 'GFFM'].includes(component.componentTypeCode)) {
            return resultB;
          }
        }
      }
    }

    if (
      [
        TestTypeCodes.RATA.toString(),
        TestTypeCodes.F2LCHK.toString(),
        TestTypeCodes.F2LREF.toString(),
        TestTypeCodes.FF2LBAS.toString(),
        TestTypeCodes.FF2LTST.toString(),
        TestTypeCodes.APPE.toString(),
      ].includes(summary.testTypeCode)
    ) {
      if (summary.monitoringSystemID === null || summary.componentID !== null) {
        return resultC;
      } else {
        if (summary.testTypeCode === TestTypeCodes.RATA.toString()) {
          if (
            ![
              'SO2',
              'CO2',
              'NOX',
              'NOXC',
              'O2',
              'FLOW',
              'H2O',
              'H2OM',
              'NOXP',
              'SO2R',
              'HG',
              'HCL',
              'HF',
              'ST',
            ].includes(monitorSystem.systemTypeCode)
          ) {
            return resultD;
          }

          if (summary.testTypeCode === 'APPE') {
            if (monitorSystem.systemTypeCode !== 'NOXE') {
              return resultD;
            }
          }

          if (['F2LCHK', 'F2LREF'].includes(summary.testTypeCode)) {
            if (monitorSystem.systemTypeCode !== 'FLOW') {
              return resultD;
            }
          }

          if (['FF2LBAS', 'FF2LTST'].includes(summary.testTypeCode)) {
            if (
              !['OILV', 'OILM', 'GAS', 'LTOL', 'LTGS'].includes(
                monitorSystem.systemTypeCode,
              )
            ) {
              return resultD;
            }
          }
        }
      }
    }

    if (summary.testTypeCode === TestTypeCodes.UNITDEF.toString()) {
      if (summary.monitoringSystemID !== null || summary.componentID !== null) {
        return resultE;
      } else {
        const monitorMethod = await this.monitorMethodRepository.findOne({
          where: {
            locationId,
            parameterCode: 'NOXM',
            monitoringMethodCode: 'LME',
          },
        });

        if (!monitorMethod) {
          return resultF;
        }
      }
    }

    return null;
  }

  // Import-19 Inappropriate children Record for RATA
  private async import19Check(
    locationId: string,
    summary: TestSummaryImportDTO,
  ): Promise<string> {
    if (
      summary.testTypeCode === TestTypeCodes.RATA &&
      summary.rataData?.length > 0
    ) {
      for (const rata of summary.rataData) {
        if (rata.rataSummaryData?.length > 0) {
          for (const rataSummary of rata.rataSummaryData) {
            if (rataSummary.rataRunData?.length > 0) {
              for (const rataRun of rataSummary.rataRunData) {
                if (rataRun.flowRataRunData?.length > 0) {
                  const monitorSystem = await this.monitorSystemRepository.findOne(
                    {
                      locationId,
                      monitoringSystemID: summary.monitoringSystemID,
                    },
                  );

                  if (
                    monitorSystem &&
                    monitorSystem.systemTypeCode !== 'FLOW'
                  ) {
                    return this.getMessage('IMPORT-19-A', {
                      locationID: summary.unitId
                        ? summary.unitId
                        : summary.stackPipeId,
                      systemID: summary.monitoringSystemID,
                      testNumber: summary.testNumber,
                    });
                  }
                }
              }
            }
          }
        }
      }
    }
    return null;
  }

  // IMPORT-20 Duplicate Test Check
  // LINEAR-31 Duplicate Linearity (Result A)
  // LINEAR-31 Duplicate Linearity (Result B)
  // IMPORT-21 Duplicate Test Number Check
  private async duplicateTestCheck(
    locationId: string,
    summary: TestSummaryBaseDTO | TestSummaryImportDTO,
    summaries: TestSummaryImportDTO[] = [],
    historicalTestSumId: string,
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
    if (isImport && duplicates.length > 1) {
      error = this.getMessage('IMPORT-20-A', {
        locationID: summary.unitId ? summary.unitId : summary.stackPipeId,
        testTypeCode: summary.testTypeCode,
        testNumber: summary.testNumber,
      });
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

      if (summary.testTypeCode === TestTypeCodes.LINE) {
        // LINEAR-31 Duplicate Linearity (Result A)
        error = this.getMessage('LINEAR-31-A', null);
      } else if (summary.testTypeCode === TestTypeCodes.APPE) {
        // APPE-46 Duplicate Appendix E Test (Result A)
        error = this.getMessage('APPE-46-A', {
          testtype: summary.testTypeCode,
        });
      }
    } else {
      duplicate = await this.qaSuppDataRepository.getUnassociatedQASuppDataByLocationIdAndTestSum(
        locationId,
        historicalTestSumId,
        summary.testTypeCode,
        summary.testNumber,
      );

      if (duplicate) {
        if (isImport) {
          fields = this.compareFields(duplicate, summary);
        }
        if (summary.testTypeCode === TestTypeCodes.LINE) {
          // LINEAR-31 Duplicate Linearity (Result B)
          error = this.getMessage('LINEAR-31-B', null);
        } else if (summary.testTypeCode === TestTypeCodes.APPE) {
          error = this.getMessage('APPE-46-B', {
            testtype: summary.testTypeCode,
          });
        }
      }
    }

    // IMPORT-21 Duplicate Test Number Check
    if (fields.length > 0) {
      error = this.getMessage('IMPORT-21-A', {
        locationID: summary.unitId ? summary.unitId : summary.stackPipeId,
        testTypeCode: summary.testTypeCode,
        testNumber: summary.testNumber,
        fieldname: fields,
      });
    }

    return error;
  }

  // TEST-3 & TEST-6: Test Begin/End Minute Valid
  async testMinuteField(
    summary: TestSummaryBaseDTO,
    locationId: string,
    minuteField: string,
  ): Promise<string> {
    const resultA = this.getMessage('TEST-3-A', {
      fieldname: minuteField,
      key: KEY,
    });
    const resultB = this.getMessage('TEST-3-B', {
      fieldname: minuteField,
      key: KEY,
    });

    if (
      minuteField === 'endMinute' &&
      summary.testTypeCode.toUpperCase() === TestTypeCodes.ONOFF
    ) {
      return null;
    }

    if (summary[minuteField] === null || summary[minuteField] === undefined) {
      const listOfCodes = [
        TestTypeCodes.LINE,
        TestTypeCodes.RATA,
        TestTypeCodes.CYCLE,
        TestTypeCodes.FF2LTST,
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
          summary['beginDate'],
        );

        if (mp) return resultA;
      } catch (e) {
        console.error(e);
      }

      if (
        minuteField === 'beginMinute' &&
        BEGIN_MINUTE_TEST_TYPE_CODES.includes(summary.testTypeCode)
      ) {
        return resultB;
      }
    }

    return null;
  }

  // TEST-7 Test Dates Consistent
  test7Check(summary: TestSummaryBaseDTO): string {
    const errorResponse = this.getMessage('TEST-7-A', { key: KEY });
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
  private async test8Check(
    locationId: string,
    summary: TestSummaryBaseDTO,
  ): Promise<string> {
    const testDateConsistent = this.test7Check(summary);
    let FIELDNAME: string = 'spanScalecode';

    if (summary.componentID) {
      const component = await this.componentRepository.findOne({
        componentID: summary.componentID,
        locationId: locationId,
      });
      if (
        component &&
        component.componentTypeCode !== 'FLOW' &&
        summary.testTypeCode !== TestTypeCodes.FFACC &&
        summary.testTypeCode !== TestTypeCodes.FFACCTT
      ) {
        if (summary.spanScaleCode === null) {
          return this.getMessage('TEST-8-A', {
            fieldname: FIELDNAME,
            key: KEY,
          });
        }
        if (!['H', 'L'].includes(summary.spanScaleCode)) {
          return this.getMessage('TEST-8-B', {
            value: summary.spanScaleCode,
            fieldname: FIELDNAME,
            key: KEY,
          });
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
            return this.getMessage('TEST-8-C', {
              value: summary.spanScaleCode,
            });
          }
        }
      } else {
        if (summary.spanScaleCode !== null) {
          return this.getMessage('TEST-8-D', null);
        }
      }
    }

    return null;
  }

  // TEST-23 Injection Protocol Valid
  private async test23Check(locationId: string, summary: TestSummaryBaseDTO) {
    let error: string;
    const resultA = this.getMessage('TEST-23-A', null);
    const resultC = this.getMessage('TEST-23-C', null);
    const resultD = this.getMessage('TEST-23-D', null);

    if (
      [
        TestTypeCodes.SEVENDAY.toString(),
        TestTypeCodes.CYCLE.toString(),
      ].includes(summary.testTypeCode)
    ) {
      const component = await this.componentRepository.findOne({
        locationId: locationId,
        componentID: summary.componentID,
      });

      if (component) {
        if (component.componentTypeCode === 'HG') {
          if (
            summary.injectionProtocolCode === null ||
            !['HGE', 'HGO'].includes(summary.injectionProtocolCode)
          ) {
            error = resultA;
          }
        } else {
          if (summary.injectionProtocolCode !== null) {
            error = resultC;
          }
        }
      }
    } else {
      if (summary.injectionProtocolCode !== null) {
        error = resultD;
      }
    }

    return error;
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
      fields.push('monitoringSystemID');
    }

    if (
      (duplicate.component === null && summary.componentID) ||
      (duplicate.component &&
        duplicate.component.componentID !== summary.componentID)
    ) {
      fields.push('componentID');
    }

    if (duplicate.spanScaleCode !== summary.spanScaleCode) {
      fields.push('spanScaleCode');
    }

    if (
      new Date(duplicate.endDate).toDateString() !==
      new Date(summary.endDate).toDateString()
    ) {
      fields.push('endDate');
    }

    if (duplicate.endHour !== summary.endHour) {
      fields.push('endHour');
    }

    if (
      (duplicate.reportingPeriod === null && summary.year) ||
      (duplicate.reportingPeriod &&
        duplicate.reportingPeriod.year !== summary.year)
    ) {
      fields.push('year');
    }
    if (
      (duplicate.reportingPeriod === null && summary.quarter) ||
      (duplicate.reportingPeriod &&
        duplicate.reportingPeriod.quarter !== summary.quarter)
    ) {
      fields.push('quarter');
    }

    if (fields.length === 0) {
      if (
        (duplicate.endMinute === null && summary.endMinute) ||
        (duplicate.endMinute && duplicate.endMinute !== summary.endMinute)
      ) {
        fields.push('endMinute');
      }
    }

    return fields;
  }

  // LINEAR-4 Identification of Previously Reported Test or Test Number for Linearity Check
  private async linear4Check(
    locationId: string,
    summary: TestSummaryBaseDTO | TestSummaryImportDTO,
    historicalTestSumId: string,
    _isImport: boolean = false,
  ): Promise<string> {
    let error: string = null;
    let duplicateQaSupp: TestSummary | QASuppData;
    const resultA = this.getMessage('LINEAR-4-A', null);

    const duplicateTestSum = await this.repository.getTestSummaryByComponent(
      summary.componentID,
      summary.testTypeCode,
      summary.spanScaleCode,
      summary.endDate,
      summary.endHour,
      summary.endMinute,
    );

    if (duplicateTestSum) {
      error = this.getMessage('LINEAR-4-A', null);
    } else {
      duplicateQaSupp = await this.qaSuppDataRepository.getUnassociatedQASuppDataByTestTypeCodeComponentIdEndDateEndTime(
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
        error = this.getMessage('LINEAR-4-A', null);
      } else {
        duplicateQaSupp = await this.qaSuppDataRepository.getUnassociatedQASuppDataByLocationIdAndTestSum(
          locationId,
          historicalTestSumId,
          summary.testTypeCode,
          summary.testNumber,
        );

        if (duplicateQaSupp) {
          if (
            ![null, 'GRANTED', 'REQUIRE'].includes(
              duplicateQaSupp.submissionAvailabilityCode,
            )
          ) {
            if (
              duplicateQaSupp.component.componentID !== summary.componentID &&
              duplicateQaSupp.spanScaleCode !== summary.spanScaleCode &&
              duplicateQaSupp.endDate !== summary.endDate &&
              duplicateQaSupp.endHour !== summary.endHour &&
              duplicateQaSupp.endMinute !== summary.endMinute
            ) {
              error = CheckCatalogService.formatResultMessage('LINEAR-4-B', {
                testtype: duplicateQaSupp.testTypeCode,
              });
            } else {
              error = CheckCatalogService.formatResultMessage('LINEAR-4-C');
            }
          }
        }
      }
    }

    return error;
  }

  // IMPORT-33 Inappropriate Test Type For Location
  private import33Check(
    summary: TestSummaryBaseDTO | TestSummaryImportDTO,
  ): string {
    let error: string = null;
    const resultA = this.getMessage('IMPORT-33-A', {
      testType: summary.testTypeCode,
      locationType: summary.stackPipeId,
    });

    const INVALID_TEST_TYPE_CODES_FOR_CS_AND_MS = [
      TestTypeCodes.FFACC.toString(),
      TestTypeCodes.FFACCTT.toString(),
      TestTypeCodes.FF2LTST.toString(),
      TestTypeCodes.FF2LBAS.toString(),
      TestTypeCodes.APPE.toString(),
      TestTypeCodes.UNITDEF.toString(),
      TestTypeCodes.PEI.toString(),
      TestTypeCodes.PEMSACC.toString(),
    ];

    const INVALID_TEST_TYPE_CODES_FOR_CP = [
      TestTypeCodes.RATA.toString(),
      TestTypeCodes.LINE.toString(),
      TestTypeCodes.SEVENDAY.toString(),
      TestTypeCodes.ONOFF.toString(),
      TestTypeCodes.CYCLE.toString(),
      TestTypeCodes.LEAK.toString(),
      TestTypeCodes.APPE.toString(),
      TestTypeCodes.UNITDEF.toString(),
      TestTypeCodes.PEMSACC.toString(),
      TestTypeCodes.HGLINE.toString(),
      TestTypeCodes.HGSI3.toString(),
    ];

    const INVALID_TEST_TYPE_CODES_FOR_MP = [
      TestTypeCodes.RATA.toString(),
      TestTypeCodes.LINE.toString(),
      TestTypeCodes.SEVENDAY.toString(),
      TestTypeCodes.ONOFF.toString(),
      TestTypeCodes.CYCLE.toString(),
      TestTypeCodes.LEAK.toString(),
      TestTypeCodes.UNITDEF.toString(),
      TestTypeCodes.PEMSACC.toString(),
      TestTypeCodes.HGLINE.toString(),
      TestTypeCodes.HGSI3.toString(),
    ];

    if (
      summary.stackPipeId &&
      summary.stackPipeId !== null &&
      summary.stackPipeId.length >= 2 &&
      ['CS', 'MS'].includes(summary.stackPipeId.substring(0, 2))
    ) {
      if (
        INVALID_TEST_TYPE_CODES_FOR_CS_AND_MS.includes(summary.testTypeCode)
      ) {
        error = resultA;
      }
    }

    if (
      summary.stackPipeId &&
      summary.stackPipeId !== null &&
      summary.stackPipeId.length >= 2 &&
      ['CP'].includes(summary.stackPipeId.substring(0, 2))
    ) {
      if (INVALID_TEST_TYPE_CODES_FOR_CP.includes(summary.testTypeCode)) {
        error = resultA;
      }
    }

    if (
      summary.stackPipeId &&
      summary.stackPipeId !== null &&
      summary.stackPipeId.length >= 2 &&
      ['MP'].includes(summary.stackPipeId.substring(0, 2))
    ) {
      if (INVALID_TEST_TYPE_CODES_FOR_MP.includes(summary.testTypeCode)) {
        error = resultA;
      }
    }

    return error;
  }

  // LINEAR-10 Linearity Test Result Code Valid (Result C)
  private async linear10Check(
    summary: TestSummaryBaseDTO | TestSummaryImportDTO,
  ): Promise<string> {
    let error: string = null;
    let FIELDNAME: string = 'testResultCode';
    let KEY: string = 'Test Summary';
    const testSummaryMDRelationships = await this.testSummaryRelationshipsRepository.getTestTypeCodesRelationships(
      TestTypeCodes.LINE,
      'testResultCode',
    );

    const testResultCodes = testSummaryMDRelationships.map(
      s => s.testResultCode,
    );
    if (
      !testResultCodes.includes(summary.testResultCode) &&
      [TestTypeCodes.LINE.toString()].includes(summary.testTypeCode)
    ) {
      const option = this.testResultCodeRepository.findOne(
        summary.testResultCode,
      );

      if (option) {
        error = this.getMessage('LINEAR-10-C', {
          value: summary.testResultCode,
          fieldname: FIELDNAME,
          key: KEY,
        });
        //    error = `You reported the value [${summary.testResultCode}], which is not in the list of valid values for this test type [${summary.testTypeCode}], in the field [testResultCode] for [Test Summary].`;
      }
    }
    return error;
  }

  getMessage(messageKey: string, messageArgs: object): string {
    return CheckCatalogService.formatResultMessage(messageKey, messageArgs);
  }
}
