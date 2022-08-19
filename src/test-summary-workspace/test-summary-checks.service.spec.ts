import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { TestSummaryWorkspaceRepository } from './test-summary.repository';
import { QASuppDataWorkspaceRepository } from '../qa-supp-data-workspace/qa-supp-data.repository';
import { TestSummaryChecksService } from './test-summary-checks.service';
import {
  TestSummaryBaseDTO,
  TestSummaryImportDTO,
} from '../dto/test-summary.dto';
import { TestTypeCodes } from '../enums/test-type-code.enum';
import { QAMonitorPlanWorkspaceRepository } from '../qa-monitor-plan-workspace/qa-monitor-plan.repository';
import { MonitorPlan } from '../entities/workspace/monitor-plan.entity';
import { TestSummary } from '../entities/workspace/test-summary.entity';
import { QASuppData } from '../entities/workspace/qa-supp-data.entity';
import { LinearitySummaryImportDTO } from '../dto/linearity-summary.dto';
import { Component } from '../entities/workspace/component.entity';
import { ComponentWorkspaceRepository } from '../component-workspace/component.repository';
import { AnalyzerRangeWorkspaceRepository } from '../analyzer-range-workspace/analyzer-range.repository';
import { TestSummaryMasterDataRelationshipRepository } from '../test-summary-master-data-relationship/test-summary-master-data-relationship.repository';
import { TestResultCode } from '../entities/test-result-code.entity';
import { ReportingPeriod } from '../entities/workspace/reporting-period.entity';
import { MonitorSystem } from '../entities/workspace/monitor-system.entity';
import { RataBaseDTO, RataImportDTO } from '../dto/rata.dto';
import { MonitorSystemRepository } from '../monitor-system/monitor-system.repository';
import { MonitorMethodRepository } from '../monitor-method/monitor-method.repository';
import { MonitorMethod } from '../entities/monitor-method.entity';

const locationId = '1';

const component = new Component();

const mockTestSummaryRelationshipRepository = () => ({
  getTestTypeCodesRelationships: jest
    .fn()
    .mockResolvedValue([{ testResultCode: 'PASSED' }]),
});

const mockComponentWorkspaceRepository = () => ({
  findOne: jest.fn().mockResolvedValue(component),
});

const mockAnalyzerRangeWorkspaceRepository = () => ({
  findOne: jest.fn().mockResolvedValue(component),
});

const mockRepository = () => ({
  getTestSummaryByLocationId: jest.fn().mockResolvedValue(null),
  findOne: jest.fn().mockResolvedValue(null),
});
const mockQARepository = () => ({
  findOne: jest.fn().mockResolvedValue(null),
  getQASuppDataByLocationId: jest.fn().mockResolvedValue(null),
  getQASuppDataByTestTypeCodeComponentIdEndDateEndTime: jest
    .fn()
    .mockResolvedValue(null),
});

describe('Test Summary Check Service Test', () => {
  let service: TestSummaryChecksService;
  let repository: TestSummaryWorkspaceRepository;
  let qaRepository: QASuppDataWorkspaceRepository;
  let testSummaryRelationshipRepository: TestSummaryMasterDataRelationshipRepository;
  let qaMonitorPlanWSRepo: any;

  const summaryBase: TestSummaryBaseDTO = new TestSummaryBaseDTO();
  summaryBase.unitId = '1';
  summaryBase.stackPipeId = null;
  summaryBase.beginHour = 1;
  summaryBase.beginMinute = 1;
  summaryBase.endHour = 1;
  summaryBase.endMinute = 2;
  summaryBase.beginDate = new Date('2020-01-01');
  summaryBase.endDate = new Date('2020-01-01');
  summaryBase.testTypeCode = TestTypeCodes.ONOFF.toString();
  summaryBase.testResultCode = 'PASSED';
  summaryBase.testNumber = '';

  const mockQAMonitorPlanWorkspaceRepository = () => ({
    getMonitorPlanWithALowerBeginDate: jest.fn(),
    find: jest.fn(),
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        TestSummaryChecksService,
        {
          provide: TestSummaryMasterDataRelationshipRepository,
          useFactory: mockTestSummaryRelationshipRepository,
        },
        {
          provide: TestSummaryWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: QASuppDataWorkspaceRepository,
          useFactory: mockQARepository,
        },
        {
          provide: QAMonitorPlanWorkspaceRepository,
          useFactory: mockQAMonitorPlanWorkspaceRepository,
        },
        {
          provide: ComponentWorkspaceRepository,
          useFactory: mockComponentWorkspaceRepository,
        },
        {
          provide: AnalyzerRangeWorkspaceRepository,
          useFactory: mockAnalyzerRangeWorkspaceRepository,
        },
        {
          provide: MonitorSystemRepository,
          useFactory: () => ({
            findOne: jest.fn().mockResolvedValue(new MonitorSystem()),
          }),
        },
        {
          provide: MonitorMethodRepository,
          useFactory: () => ({
            findOne: jest.fn().mockResolvedValue(new MonitorMethod()),
          }),
        },
      ],
    }).compile();

    qaMonitorPlanWSRepo = module.get(QAMonitorPlanWorkspaceRepository);
    testSummaryRelationshipRepository = module.get(
      TestSummaryMasterDataRelationshipRepository,
    );
    qaRepository = module.get(QASuppDataWorkspaceRepository);

    service = module.get(TestSummaryChecksService);
    repository = module.get(TestSummaryWorkspaceRepository);
  });

  describe('Test Summary Checks', () => {
    const payload = new TestSummaryImportDTO();
    payload.testTypeCode = TestTypeCodes.LINE;
    payload.stackPipeId = '';
    payload.testResultCode = 'PASSED';
    payload.testNumber = '';
    payload.beginHour = 1;
    payload.beginMinute = 1;
    payload.endHour = 1;
    payload.endMinute = 2;
    payload.beginDate = new Date('2020-01-01');
    payload.endDate = new Date('2020-01-01');
    payload.injectionProtocolCode = null;

    it('Should pass all checks', async () => {
      jest
        .spyOn(repository, 'getTestSummaryByLocationId')
        .mockResolvedValue(null);
      const result = await service.runChecks(locationId, payload);

      expect(result).toEqual([]);
    });

    it('Should pass all checks while importing', async () => {
      jest
        .spyOn(repository, 'getTestSummaryByLocationId')
        .mockResolvedValue(null);
      const result = await service.runChecks(locationId, payload, true, false, [
        payload,
      ]);

      expect(result).toEqual([
        'You have reported a Test Summary Record for Location 1, TestTypeCode [LINE] and Test Number [], which either does not have a ComponentID or inappropriately has a MonitorSystemID. This test record was not imported.',
      ]);
    });

    it('Should get error IMPORT -20 Duplicate Test Summary record', async () => {
      jest
        .spyOn(repository, 'getTestSummaryByLocationId')
        .mockResolvedValue(null);
      const result = await service.runChecks(locationId, payload, true, false, [
        payload,
        payload,
      ]);

      expect(result).toEqual([
        'You have reported a Test Summary Record for Location 1, TestTypeCode [LINE] and Test Number [], which either does not have a ComponentID or inappropriately has a MonitorSystemID. This test record was not imported.',
        `You have reported multiple Test Summary records for Unit/Stack [${payload.stackPipeId}], Test Type Code [${payload.testTypeCode}], and Test Number [${payload.testNumber}].`,
      ]);
    });

    it('Should get error IMPORT -21 Duplicate Test Summary record', async () => {
      const returnedTestSummary = new TestSummary();
      returnedTestSummary.spanScaleCode = 'L';
      returnedTestSummary.endHour = 2;
      returnedTestSummary.endDate = new Date();
      returnedTestSummary.reportingPeriod = new ReportingPeriod();
      returnedTestSummary.reportingPeriod.year = 2000;
      returnedTestSummary.reportingPeriod.quarter = 1;
      returnedTestSummary.system = new MonitorSystem();
      returnedTestSummary.system.monitoringSystemID = '1';
      returnedTestSummary.component = new Component();
      returnedTestSummary.component.componentID = 'A01';

      jest
        .spyOn(repository, 'getTestSummaryByLocationId')
        .mockResolvedValue(returnedTestSummary);
      const result = await service.runChecks(locationId, payload, true, false, [
        payload,
      ]);

      expect(result).toEqual([
        'You have reported a Test Summary Record for Location 1, TestTypeCode [LINE] and Test Number [], which either does not have a ComponentID or inappropriately has a MonitorSystemID. This test record was not imported.',
        `The database contains another Test Summary record for Unit/Stack [${payload.stackPipeId}], Test Type Code [${payload.testTypeCode}], and Test Number [${payload.testNumber}]. However, the values reported for [monitoringSystemID,componentID,spanScaleCode,endDate,endHour,year,quarter] are different between the two tests.`,
      ]);
    });

    it('Should get error IMPORT -21 Duplicate Test Summary record (endMinute)', async () => {
      const returnedTestSummary = new TestSummary();
      returnedTestSummary.endMinute = 3;
      returnedTestSummary.endHour = 1;
      returnedTestSummary.endDate = new Date('2020-01-01');

      jest
        .spyOn(repository, 'getTestSummaryByLocationId')
        .mockResolvedValue(returnedTestSummary);
      const result = await service.runChecks(locationId, payload, true, false, [
        payload,
      ]);

      expect(result).toEqual([
        'You have reported a Test Summary Record for Location 1, TestTypeCode [LINE] and Test Number [], which either does not have a ComponentID or inappropriately has a MonitorSystemID. This test record was not imported.',
        `The database contains another Test Summary record for Unit/Stack [${payload.stackPipeId}], Test Type Code [${payload.testTypeCode}], and Test Number [${payload.testNumber}]. However, the values reported for [endMinute] are different between the two tests.`,
      ]);
    });

    it('Should get error IMPORT -21 Duplicate Test Summary record (when QASuppDataFound)', async () => {
      const returnedQASupp = new QASuppData();
      returnedQASupp.endHour = 2;
      returnedQASupp.endDate = new Date();

      jest
        .spyOn(repository, 'getTestSummaryByLocationId')
        .mockResolvedValue(null);

      jest
        .spyOn(qaRepository, 'getQASuppDataByLocationId')
        .mockResolvedValue(returnedQASupp);

      const result = await service.runChecks(locationId, payload, true, false, [
        payload,
      ]);
      expect(result).toEqual([
        'You have reported a Test Summary Record for Location 1, TestTypeCode [LINE] and Test Number [], which either does not have a ComponentID or inappropriately has a MonitorSystemID. This test record was not imported.',
        `The database contains another Test Summary record for Unit/Stack [${payload.stackPipeId}], Test Type Code [${payload.testTypeCode}], and Test Number [${payload.testNumber}]. However, the values reported for [endDate,endHour] are different between the two tests.`,
      ]);
    });

    it('Should get error LINEAR -31 Duplicate Test Summary record (Result A)', async () => {
      const returnedTestSummary = new TestSummary();
      returnedTestSummary.reportingPeriod = null;
      returnedTestSummary.spanScaleCode = '';
      returnedTestSummary.component = null;
      returnedTestSummary.system = null;
      returnedTestSummary.testTypeCode = TestTypeCodes.LINE;
      returnedTestSummary.testResultCode = 'PASSED';
      returnedTestSummary.testNumber = '';
      returnedTestSummary.beginHour = 1;
      returnedTestSummary.beginMinute = 1;
      returnedTestSummary.endHour = 1;
      returnedTestSummary.endMinute = 2;
      returnedTestSummary.beginDate = new Date('2020-01-01');
      returnedTestSummary.endDate = new Date('2020-01-01');

      jest
        .spyOn(repository, 'getTestSummaryByLocationId')
        .mockResolvedValue(returnedTestSummary);
      try {
        await service.runChecks(locationId, payload, false, false, [
          payload,
          payload,
        ]);
      } catch (err) {
        expect(err.response.message).toEqual([
          `Another Test Summary record for Unit/Stack [${payload.stackPipeId}], Test Type Code [${payload.testTypeCode}], and Test Number [${payload.testNumber}]. You must assign a different test number.`,
        ]);
      }
    });

    it('Should get error LINEAR -31 Duplicate Test Summary record (Result B)', async () => {
      const returnedQASupp = new QASuppData();

      jest
        .spyOn(repository, 'getTestSummaryByLocationId')
        .mockResolvedValue(null);

      jest
        .spyOn(qaRepository, 'getQASuppDataByLocationId')
        .mockResolvedValue(returnedQASupp);
      try {
        await service.runChecks(locationId, payload, false, false, [
          payload,
          payload,
        ]);
      } catch (err) {
        expect(err.response.message).toEqual([
          `Another Test Summary record for Unit/Stack [${payload.stackPipeId}], Test Type Code [${payload.testTypeCode}], and Test Number [${payload.testNumber}]. You cannot change the Test Number to the value that you have entered, because a test with this Test Type and Test Number has already been submitted. If this is a different test, you should assign it a different Test Number. If you are trying to resubmit this test, you should delete this test, and either reimport this test with its original Test Number or retrieve the original test from the EPA host system.`,
        ]);
      }
    });

    it('Should get error IMPORT-16 inappropriate Child when Test Type Code not equal to RATA, 7DAY, HGLINE, HGSI3, F2LREF, F2LCHK, CYCLE, ONOFF, FFACC, FFACCTT, FF2LBAS, FF2LTST, APPE and UNITDEF.', async () => {
      jest
        .spyOn(repository, 'getTestSummaryByLocationId')
        .mockResolvedValue(null);

      const importPayload = new TestSummaryImportDTO();
      importPayload.testTypeCode = TestTypeCodes.LINE;
      importPayload.rataData = [new RataImportDTO()];
      importPayload.testQualificationData = [{}];
      importPayload.calibrationInjectionData = [{}];
      importPayload.hgSummaryData = [{}];
      importPayload.flowToLoadReferenceData = [{}];
      importPayload.flowToLoadCheckData = [{}];
      importPayload.cycleTimeSummaryData = [{}];
      importPayload.onlineOfflineCalibrationData = [{}];
      importPayload.fuelFlowmeterAccuracyData = [{}];
      importPayload.transmitterTransducerData = [{}];
      importPayload.fuelFlowToLoadBaselineData = [{}];
      importPayload.fuelFlowToLoadTestData = [{}];
      importPayload.appECorrelationTestSummaryData = [{}];
      importPayload.unitDefaultTestData = [{}];
      importPayload.airEmissionTestData = [{}];

      try {
        await service.runChecks(locationId, importPayload, true, false, [
          importPayload,
        ]);
      } catch (err) {
        // expect(err.response.message).toEqual([
        //   `You have reported invalid [RATA, Test Qualification, Calibration Injection, Hg Linearity or System Integrity Summary, Flow to Load Reference, Flow to Load Check, Cycle Time Summary, Online Offline Calibration, Fuel Flowmeter Accuracy, Transmitter Transducer, Fuel Flow to Load Baseline, Fuel Flow to Load Test, Appendix E Correlation Test Summary, Unit Default Test, Air Emission Test] records for a Test Summary record with a Test Type Code of [${importPayload.testTypeCode}].`,
        // ]);
      }
    });

    it('Should get error IMPORT-16 inappropriate Child when Test Type Code not equal to RATA, LINE, APPE and UNITDEF, ', async () => {
      jest
        .spyOn(repository, 'getTestSummaryByLocationId')
        .mockResolvedValue(null);

      const importPayload = new TestSummaryImportDTO();
      importPayload.testTypeCode = TestTypeCodes.FF2LTST;
      payload.testResultCode = 'PASSED';
      importPayload.protocolGasData = [];
      importPayload.linearitySummaryData = [new LinearitySummaryImportDTO()];

      try {
        await service.runChecks(locationId, importPayload, true, false, [
          importPayload,
        ]);
      } catch (err) {
        expect(err.response.message).toEqual([
          `You have reported invalid [Linearity Summary, Protocol Gas] records for a Test Summary record with a Test Type Code of [${importPayload.testTypeCode}].`,
        ]);
      }
    });

    it('Should get error IMPORT-17 TestDescription, TestResultCode, SpanScaleCode, TestReasonCode, GracePeriodIndicator, BeginMinute, EndMinute Extraneous Test Summary Field, ', async () => {
      jest
        .spyOn(repository, 'getTestSummaryByLocationId')
        .mockResolvedValue(null);

      const importPayload = new TestSummaryImportDTO();
      importPayload.testNumber = '1';
      importPayload.testTypeCode = TestTypeCodes.FF2LBAS;
      importPayload.testDescription = 'Description';
      importPayload.testResultCode = 'PASSED';
      importPayload.testReasonCode = 'RETEST';
      importPayload.spanScaleCode = 'CODE';
      importPayload.gracePeriodIndicator = 1;
      importPayload.endMinute = 1;
      importPayload.beginMinute = 1;

      try {
        await service.runChecks(locationId, importPayload, true, false, [
          importPayload,
        ]);
      } catch (err) {
        expect(err.response.message).toEqual([
          `An extraneous value has been reported for [TestDescription, TestResultCode, SpanScaleCode, TestReasonCode, GracePeriodIndicator, BeginMinute, EndMinute] in the Test Summary record for Location [${locationId}], TestTypeCode [${importPayload.testTypeCode}] and Test Number [${importPayload.testNumber}].`,
        ]);
      }
    });

    it('Should get error IMPORT-17 BeginDate, BeginHour, BeginMinute, Year, Quarter Extraneous Test Summary Field, ', async () => {
      jest
        .spyOn(repository, 'getTestSummaryByLocationId')
        .mockResolvedValue(null);

      const importPayload = new TestSummaryImportDTO();
      importPayload.testNumber = '1';
      importPayload.testTypeCode = TestTypeCodes.DAHS;
      importPayload.beginDate = new Date();
      importPayload.beginHour = 1;
      importPayload.beginMinute = 1;
      importPayload.year = 2000;
      importPayload.quarter = 2;

      try {
        await service.runChecks(locationId, importPayload, true, false, [
          importPayload,
        ]);
      } catch (err) {
        expect(err.response.message).toEqual([
          `An extraneous value has been reported for [BeginDate, BeginHour, BeginMinute, Year, Quarter] in the Test Summary record for Location [${locationId}], TestTypeCode [${importPayload.testTypeCode}] and Test Number [${importPayload.testNumber}].`,
        ]);
      }
    });

    it('Should get error IMPORT-17 EndDate, EndHour, EndMinute Extraneous Test Summary Field, ', async () => {
      jest
        .spyOn(repository, 'getTestSummaryByLocationId')
        .mockResolvedValue(null);

      const importPayload = new TestSummaryImportDTO();
      importPayload.testNumber = '1';
      importPayload.testTypeCode = TestTypeCodes.F2LCHK;
      importPayload.endDate = new Date();
      importPayload.endHour = 1;
      importPayload.endMinute = 1;

      try {
        await service.runChecks(locationId, importPayload, true, false, [
          importPayload,
        ]);
      } catch (err) {
        expect(err.response.message).toEqual([
          `An extraneous value has been reported for [EndDate, EndHour, EndMinute] in the Test Summary record for Location [${locationId}], TestTypeCode [${importPayload.testTypeCode}] and Test Number [${importPayload.testNumber}].`,
        ]);
      }
    });

    it('Should get error for IMPORT-33 Check with stackPipe CS0AAN', async () => {
      const importPayload = new TestSummaryImportDTO();
      importPayload.testNumber = '1';
      importPayload.stackPipeId = 'CS0AAN';
      importPayload.testTypeCode = TestTypeCodes.FFACC;
      importPayload.endDate = new Date();
      importPayload.endHour = 1;
      importPayload.endMinute = 1;

      try {
        await service.runChecks(locationId, importPayload, true, false, [
          importPayload,
        ]);
      } catch (err) {
        expect(err.response.message).toEqual([
          `You have reported a [${importPayload.testTypeCode}] test that is inappropriate for Stack [${importPayload.stackPipeId}].`,
        ]);
      }
    });

    it('Should get error for IMPORT-33 Check with stackPipe CPO', async () => {
      const importPayload = new TestSummaryImportDTO();
      importPayload.testNumber = '1';
      importPayload.stackPipeId = 'CPO';
      importPayload.testTypeCode = TestTypeCodes.RATA;
      importPayload.endDate = new Date();
      importPayload.endHour = 1;
      importPayload.endMinute = 1;

      try {
        await service.runChecks(locationId, importPayload, true, false, [
          importPayload,
        ]);
      } catch (err) {
        expect(err.response.message).toEqual([
          `You have reported a [${importPayload.testTypeCode}] test that is inappropriate for Stack [${importPayload.stackPipeId}].`,
        ]);
      }
    });

    it('Should get error for IMPORT-33 Check with stackPipe MP1', async () => {
      const importPayload = new TestSummaryImportDTO();
      importPayload.testNumber = '1';
      importPayload.stackPipeId = 'MP1';
      importPayload.testTypeCode = TestTypeCodes.RATA;
      importPayload.endDate = new Date();
      importPayload.endHour = 1;
      importPayload.endMinute = 1;

      try {
        await service.runChecks(locationId, importPayload, true, false, [
          importPayload,
        ]);
      } catch (err) {
        expect(err.response.message).toEqual([
          `You have reported a [${importPayload.testTypeCode}] test that is inappropriate for Stack [${importPayload.stackPipeId}].`,
        ]);
      }
    });

    it('Should get error for TEST-8 - Test Span Scale Valid check Result A', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(new TestSummary());

      try {
        await service.runChecks(locationId, payload, true, false, [payload]);
      } catch (err) {
        expect(err.response.message).toEqual([
          `Based on the information in this record, this test has already been submitted with a different test number, or the database already contains the same test with a different test number. This test cannot be submitted.`,
        ]);
      }
    });

    it('Should get error for LINEAR-4 check Result A', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(new TestSummary());

      try {
        await service.runChecks(locationId, payload, true, false, [payload]);
      } catch (err) {
        expect(err.response.message).toEqual([
          `Based on the information in this record, this test has already been submitted with a different test number, or the database already contains the same test with a different test number. This test cannot be submitted.`,
        ]);
      }
    });

    it('Should get error for LINEAR-4 check Result A', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      jest
        .spyOn(
          qaRepository,
          'getQASuppDataByTestTypeCodeComponentIdEndDateEndTime',
        )
        .mockResolvedValue(new QASuppData());

      try {
        await service.runChecks(locationId, payload, true, false, [payload]);
      } catch (err) {
        expect(err.response.message).toEqual([
          `Based on the information in this record, this test has already been submitted with a different test number, or the database already contains the same test with a different test number. This test cannot be submitted.`,
        ]);
      }
    });

    it('Should get error for LINEAR-10 Linearity Test Result Code Valid and LINEAR-29 Determine Linearity Check Results with valid testResultCode', async () => {
      payload.testResultCode = 'INC';

      let values = {
        findOne: jest.fn().mockResolvedValue(new TestResultCode()),
      };
      jest.mock('../utilities/utils.ts', () => ({
        getEntityManager: jest.fn().mockReturnValue(values),
      }));

      jest
        .spyOn(repository, 'getTestSummaryByLocationId')
        .mockResolvedValue(null);

      try {
        await service.runChecks(locationId, payload, true, false, [payload]);
      } catch (err) {
        console.log(err);
        // expect(err.response.message).toEqual([
        //   `You reported the value [${payload.testResultCode}], which is not in the list of valid values for this test type, in the field [testResultCode] for [Test Summary].`,
        // ]);
      }
    });

    // it('Should get error for LINEAR-10 Linearity Test Result Code Valid and LINEAR-29 Determine Linearity Check Results with invalid testResultCode', async () => {
    //   payload.testResultCode = 'INC';

    //   jest
    //     .spyOn(repository, 'getTestSummaryByLocationId')
    //     .mockResolvedValue(null);

    //   try {
    //     await service.runChecks(locationId, payload, [payload], true);
    //   } catch (err) {
    //     expect(err.response.message).toEqual([
    //       `You reported the value [${payload.testResultCode}], which is not in the list of valid values, in the field [testResultCode] for [Test Summary].`,
    //     ]);
    //   }
    // });
  });

  // TEST-7 Test Dates Consistent
  describe('test7Check test', () => {
    it('returns error message when beginDate/hour >= endDate/hour for testTypeCode=ONOFF', () => {
      const result = service.test7Check(summaryBase);
      expect(result).not.toBeNull();
    });

    it('returns null when beginDate/hour < endDate/hour for testTypeCode=ONOFF', () => {
      const summary = { ...summaryBase };
      summary.endHour = 2;
      const result = service.test7Check(summary);

      expect(result).toBeNull();
    });

    it('returns error message when testTypeCode=LINE and beginMinute > endMinute', () => {
      const summary = { ...summaryBase };
      summary.testTypeCode = TestTypeCodes.LINE.toString();
      summary.beginMinute = 3;

      const result = service.test7Check(summary);

      expect(result).not.toBeNull();
    });

    it('returns null when testTypeCode=LINE and beginMinute <= endMinute', () => {
      const summary = { ...summaryBase };
      summary.testTypeCode = TestTypeCodes.LINE.toString();

      const result = service.test7Check(summary);

      expect(result).toBeNull();
    });
  });

  describe('testMinuteField() test', () => {
    it('returns null when startMinute and endMinute are valid', async () => {
      const startMinuteresult = await service.testMinuteField(
        summaryBase,
        '1',
        'beginMinute',
      );
      const endMinuteresult = await service.testMinuteField(
        summaryBase,
        '1',
        'endMinute',
      );

      expect(startMinuteresult).toBeNull();
      expect(endMinuteresult).toBeNull();
    });

    it('returns error message when testType "LINE"', async () => {
      const summary = {
        ...summaryBase,
        testTypeCode: TestTypeCodes.LINE.toString(),
        beginMinute: null,
      };
      const result = await service.testMinuteField(summary, '1', 'beginMinute');
      expect(result).toBe(
        'You did not provide [beginMinute], which is required for [Test Summary].',
      );
    });

    it('returns error message A when startMinute is null and testType is not [LINE, RATA, CYCLE, F2LREF, APPE, UNITDEF] and monitor plan is found', async () => {
      qaMonitorPlanWSRepo.getMonitorPlanWithALowerBeginDate.mockResolvedValue(
        new MonitorPlan(),
      );
      const summary = {
        ...summaryBase,
        testTypeCode: TestTypeCodes.F2LCHK.toString(),
        beginMinute: null,
      };
      const result = await service.testMinuteField(summary, '1', 'beginMinute');
      expect(result).toBe(
        'You did not provide [beginMinute], which is required for [Test Summary].',
      );
    });

    it('returns error message B when startMinute is null and testType is not [LINE, RATA, CYCLE, F2LREF, APPE, UNITDEF] and monitor plan is NOT found', async () => {
      qaMonitorPlanWSRepo.getMonitorPlanWithALowerBeginDate.mockResolvedValue(
        null,
      );
      const summary = {
        ...summaryBase,
        testTypeCode: TestTypeCodes.F2LCHK.toString(),
        beginMinute: null,
      };
      const result = await service.testMinuteField(summary, '1', 'beginMinute');
      expect(result).toBe(
        'You did not provide [beginMinute] for [Test Summary]. This information will be required for ECMPS submissions.',
      );
    });
  });
});
