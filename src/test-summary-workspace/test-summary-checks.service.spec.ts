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
import { RataImportDTO } from '../dto/rata.dto';
import { MonitorSystemRepository } from '../monitor-system/monitor-system.repository';
import { MonitorMethodRepository } from '../monitor-method/monitor-method.repository';
import { MonitorMethod } from '../entities/monitor-method.entity';
import { TestResultCodeRepository } from '../test-result-code/test-result-code.repository';
import { ProtocolGasImportDTO } from '../dto/protocol-gas.dto';
import { TestQualificationImportDTO } from '../dto/test-qualification.dto';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';
import { AnalyzerRange } from '../entities/workspace/analyzerRange.entity';
import { AirEmissionTestingImportDTO } from '../dto/air-emission-test.dto';
import { AppECorrelationTestSummaryImportDTO } from '../dto/app-e-correlation-test-summary.dto';
import { FuelFlowToLoadTestImportDTO } from '../dto/fuel-flow-to-load-test.dto';
import { FuelFlowToLoadBaselineImportDTO } from '../dto/fuel-flow-to-load-baseline.dto';
import { CalibrationInjectionImportDTO } from '../dto/calibration-injection.dto';
import { FlowToLoadReferenceImportDTO } from '../dto/flow-to-load-reference.dto';
import { FlowToLoadCheckImportDTO } from '../dto/flow-to-load-check.dto';
import { OnlineOfflineCalibrationImportDTO } from '../dto/online-offline-calibration.dto';
import { CycleTimeSummaryImportDTO } from '../dto/cycle-time-summary.dto';

jest.mock('@us-epa-camd/easey-common/check-catalog');

const locationId = '1';
const MOCK_ERROR_MSG = 'MOCK_ERROR_MSG';

const component = new Component();

const mockTestSummaryRelationshipRepository = () => ({
  getTestTypeCodesRelationships: jest
    .fn()
    .mockResolvedValue([{ testResultCode: 'PASSED' }]),
});

const mockComponentWorkspaceRepository = () => ({
  findOne: jest.fn().mockResolvedValue(component),
});

const analyerRange = new AnalyzerRange();

const mockAnalyzerRangeWorkspaceRepository = () => ({
  findOne: jest.fn().mockResolvedValue(analyerRange),
  getAnalyzerRangeByComponentIdAndDate: jest
    .fn()
    .mockResolvedValue([analyerRange]),
});

const mockRepository = () => ({
  getTestSummaryByLocationId: jest.fn().mockResolvedValue(null),
  getTestSummaryByComponent: jest.fn().mockResolvedValue(null),
  findOne: jest.fn().mockResolvedValue(null),
});

const mockQARepository = () => ({
  findOne: jest.fn().mockResolvedValue(null),
  getUnassociatedQASuppDataByTestTypeCodeComponentIdEndDateEndTime: jest
    .fn()
    .mockResolvedValue(null),
  getUnassociatedQASuppDataByLocationIdAndTestSum: jest
    .fn()
    .mockResolvedValue(null),
  getQASuppDataByTestTypeCodeComponentIdEndDateEndTime: jest
    .fn()
    .mockResolvedValue(null),
});

describe('Test Summary Check Service Test', () => {
  let service: TestSummaryChecksService;
  let repository: TestSummaryWorkspaceRepository;
  let qaRepository: QASuppDataWorkspaceRepository;
  let testSummaryRelationshipRepository: TestSummaryMasterDataRelationshipRepository;
  let testResultCodeRepository: TestResultCodeRepository;
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
          provide: TestResultCodeRepository,
          useFactory: () => ({
            findOne: jest.fn().mockResolvedValue(new TestResultCode()),
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
    testResultCodeRepository = module.get(TestResultCodeRepository);
    qaRepository = module.get(QASuppDataWorkspaceRepository);

    service = module.get(TestSummaryChecksService);
    repository = module.get(TestSummaryWorkspaceRepository);

    // jest.spyOn(service, 'getMessage').mockReturnValue(MOCK_ERROR_MSG);
  });

  describe('Test Summary Checks', () => {
    const payload = new TestSummaryImportDTO();
    payload.componentID = 'A01';
    payload.spanScaleCode = 'H';
    payload.testTypeCode = TestTypeCodes.LINE;
    payload.stackPipeId = '';
    payload.testResultCode = 'PASSED';
    payload.testNumber = '';
    payload.beginDate = new Date('2020-01-01');
    payload.beginHour = 1;
    payload.beginMinute = 1;
    payload.endDate = new Date('2020-01-01');
    payload.endHour = 1;
    payload.endMinute = 2;
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

      expect(result).toEqual([]);
    });

    it('Should get error IMPORT-20 Duplicate Test Summary record', async () => {
      jest.spyOn(service, 'getMessage').mockReturnValue(MOCK_ERROR_MSG);
      jest
        .spyOn(repository, 'getTestSummaryByLocationId')
        .mockResolvedValue(null);
      const result = await service.runChecks(locationId, payload, true, false, [
        payload,
        payload,
      ]);

      expect(result).toEqual([MOCK_ERROR_MSG, MOCK_ERROR_MSG]);
    });

    it('Should get error IMPORT -21 Duplicate Test Summary record', async () => {
      jest.spyOn(service, 'getMessage').mockReturnValue(MOCK_ERROR_MSG);
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

      expect(result).toEqual([MOCK_ERROR_MSG, MOCK_ERROR_MSG]);
    });

    it('Should get error IMPORT -21 Duplicate Test Summary record (endMinute)', async () => {
      jest.spyOn(service, 'getMessage').mockReturnValue(MOCK_ERROR_MSG);
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

      expect(result).toEqual([MOCK_ERROR_MSG, MOCK_ERROR_MSG]);
    });

    it('Should get error IMPORT -21 Duplicate Test Summary record (when QASuppDataFound)', async () => {
      jest
        .spyOn(qaRepository, 'getUnassociatedQASuppDataByLocationIdAndTestSum')
        .mockResolvedValue(new QASuppData());
      jest.spyOn(service, 'getMessage').mockReturnValue(MOCK_ERROR_MSG);

      const returnedQASupp = new QASuppData();
      returnedQASupp.component = new Component();
      returnedQASupp.component.componentID = '011';
      returnedQASupp.endHour = 2;
      returnedQASupp.endDate = new Date();

      jest
        .spyOn(repository, 'getTestSummaryByLocationId')
        .mockResolvedValue(null);

      const result = await service.runChecks(locationId, payload, true, false, [
        payload,
      ]);
      expect(result).toEqual([MOCK_ERROR_MSG, MOCK_ERROR_MSG]);
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
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    });

    it('Should get error LINEAR -31 Duplicate Test Summary record (Result B)', async () => {
      const returnedQASupp = new QASuppData();

      jest
        .spyOn(repository, 'getTestSummaryByLocationId')
        .mockResolvedValue(null);

      try {
        await service.runChecks(locationId, payload, false, false, [
          payload,
          payload,
        ]);
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    });

    it('Should get error IMPORT-16 inappropriate Child when Test Type Code not equal to RATA, 7DAY, HGLINE, HGSI3, F2LREF, F2LCHK, CYCLE, ONOFF, FFACC, FFACCTT, FF2LBAS, FF2LTST, APPE and UNITDEF.', async () => {
      jest
        .spyOn(repository, 'getTestSummaryByLocationId')
        .mockResolvedValue(null);

      const importPayload = new TestSummaryImportDTO();
      importPayload.testTypeCode = TestTypeCodes.LINE;
      importPayload.rataData = [new RataImportDTO()];
      importPayload.testQualificationData = [new TestQualificationImportDTO()];
      importPayload.calibrationInjectionData = [
        new CalibrationInjectionImportDTO(),
      ];
      importPayload.hgSummaryData = [{}];
      importPayload.flowToLoadReferenceData = [
        new FlowToLoadReferenceImportDTO(),
      ];
      importPayload.flowToLoadCheckData = [new FlowToLoadCheckImportDTO()];
      importPayload.cycleTimeSummaryData = [new CycleTimeSummaryImportDTO()];
      importPayload.onlineOfflineCalibrationData = [
        new OnlineOfflineCalibrationImportDTO(),
      ];
      importPayload.fuelFlowmeterAccuracyData = [{}];
      importPayload.transmitterTransducerData = [{}];
      importPayload.fuelFlowToLoadBaselineData = [
        new FuelFlowToLoadBaselineImportDTO(),
      ];
      importPayload.fuelFlowToLoadTestData = [
        new FuelFlowToLoadTestImportDTO(),
      ];
      importPayload.appECorrelationTestSummaryData = [
        new AppECorrelationTestSummaryImportDTO(),
      ];
      importPayload.unitDefaultTestData = [{}];
      importPayload.airEmissionTestingData = [
        new AirEmissionTestingImportDTO(),
      ];

      try {
        await service.runChecks(locationId, importPayload, true, false, [
          importPayload,
        ]);
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    });

    it('Should get error IMPORT-16 inappropriate Child when Test Type Code not equal to RATA, LINE, APPE and UNITDEF, ', async () => {
      jest
        .spyOn(repository, 'getTestSummaryByLocationId')
        .mockResolvedValue(null);

      const importPayload = new TestSummaryImportDTO();
      importPayload.testTypeCode = TestTypeCodes.FF2LTST;
      payload.testResultCode = 'PASSED';
      importPayload.protocolGasData = [new ProtocolGasImportDTO()];
      importPayload.linearitySummaryData = [new LinearitySummaryImportDTO()];

      try {
        await service.runChecks(locationId, importPayload, true, false, [
          importPayload,
        ]);
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
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
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
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
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
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
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
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
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
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
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
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
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    });

    it('Should get error for TEST-8 - Test Span Scale Valid check Result A', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(new TestSummary());

      try {
        await service.runChecks(locationId, payload, true, false, [payload]);
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    });

    it('Should get error for LINEAR-4 check Result A', async () => {
      jest
        .spyOn(repository, 'getTestSummaryByComponent')
        .mockResolvedValue(new TestSummary());

      try {
        await service.runChecks(locationId, payload, true, false, [payload]);
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
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
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    });

    it('Should get error for LINEAR-4 check Result B', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      jest
        .spyOn(
          qaRepository,
          'getQASuppDataByTestTypeCodeComponentIdEndDateEndTime',
        )
        .mockResolvedValue(null);

      const qaSupp = new QASuppData();
      qaSupp.component = new Component();
      qaSupp.component.componentID = '011';
      qaSupp.spanScaleCode = 'H';
      qaSupp.submissionAvailabilityCode = 'UPDATED';
      qaSupp.endDate = new Date('2022-01-01');
      qaSupp.endHour = 0;
      qaSupp.endMinute = 0;

      try {
        await service.runChecks(locationId, payload, true, false, [payload]);
      } catch (err) {
        expect(err.response.message).toEqual([
          `Another [LINE] with this test number has already been submitted for this location. This test cannot be submitted with this test number. If this is a different test, you should assign it a unique test number.`,
        ]);
      }
    });

    it('Should get error for LINEAR-4 check Result C', async () => {
      CheckCatalogService.formatResultMessage = jest
        .fn()
        .mockResolvedValue(
          `This test has already been submitted and will not be resubmitted. If you wish to Informational Message resubmit this test, please contact EPA for approval.`,
        );

      const p = new TestSummaryImportDTO();
      p.testTypeCode = TestTypeCodes.LINE;
      p.stackPipeId = '';
      p.componentID = '011';
      p.testResultCode = 'PASSED';
      p.spanScaleCode = 'H';
      p.testNumber = '';
      p.beginHour = 1;
      p.beginMinute = 1;
      p.endHour = 1;
      p.endMinute = 2;
      p.beginDate = new Date('2020-01-01');
      p.endDate = new Date('2022-01-01');
      p.injectionProtocolCode = null;

      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      jest
        .spyOn(
          qaRepository,
          'getQASuppDataByTestTypeCodeComponentIdEndDateEndTime',
        )
        .mockResolvedValue(null);

      const qaSupp = new QASuppData();
      qaSupp.component = new Component();
      qaSupp.component.componentID = '011';
      qaSupp.spanScaleCode = 'H';
      qaSupp.submissionAvailabilityCode = 'UPDATED';
      qaSupp.endDate = new Date('2022-01-01');
      qaSupp.endHour = 1;
      qaSupp.endMinute = 2;

      try {
        await service.runChecks(locationId, p, true, false, [p]);
      } catch (err) {
        expect(err.response.message).toEqual([
          `This test has already been submitted and will not be resubmitted. If you wish to Informational Message resubmit this test, please contact EPA for approval.`,
        ]);
      }
    });

    it('Should get error for LINEAR-10 Linearity Test Result Code Valid and LINEAR-29 Determine Linearity Check Results with valid testResultCode', async () => {
      payload.testResultCode = 'INC';

      jest
        .spyOn(repository, 'getTestSummaryByLocationId')
        .mockResolvedValue(null);
      jest
        .spyOn(
          testSummaryRelationshipRepository,
          'getTestTypeCodesRelationships',
        )
        .mockResolvedValue([]);
      jest.spyOn(testResultCodeRepository, 'findOne').mockResolvedValue(null);

      try {
        await service.runChecks(locationId, payload, true, false, [payload]);
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    });

    it('Should get error for LINEAR-10 Linearity Test Result Code Valid and LINEAR-29 Determine Linearity Check Results with invalid testResultCode', async () => {
      payload.testResultCode = 'INC';

      jest
        .spyOn(repository, 'getTestSummaryByLocationId')
        .mockResolvedValue(null);

      try {
        await service.runChecks(locationId, payload, true, false, [payload]);
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    });
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
      jest.spyOn(service, 'getMessage').mockReturnValue(MOCK_ERROR_MSG);
      const summary = {
        ...summaryBase,
        testTypeCode: TestTypeCodes.LINE.toString(),
        beginMinute: null,
      };
      const result = await service.testMinuteField(summary, '1', 'beginMinute');
      expect(result).toBe(MOCK_ERROR_MSG);
    });

    it('returns error message A when startMinute is null and testType is not [LINE, RATA, CYCLE, F2LREF, APPE, UNITDEF] and monitor plan is found', async () => {
      jest.spyOn(service, 'getMessage').mockReturnValue(MOCK_ERROR_MSG);
      qaMonitorPlanWSRepo.getMonitorPlanWithALowerBeginDate.mockResolvedValue(
        new MonitorPlan(),
      );
      const summary = {
        ...summaryBase,
        testTypeCode: TestTypeCodes.F2LCHK.toString(),
        beginMinute: null,
      };
      const result = await service.testMinuteField(summary, '1', 'beginMinute');
      expect(result).toBe(MOCK_ERROR_MSG);
    });

    it('returns error message B when startMinute is null and testType is not [LINE, RATA, CYCLE, F2LREF, APPE, UNITDEF] and monitor plan is NOT found', async () => {
      jest.spyOn(service, 'getMessage').mockReturnValue(MOCK_ERROR_MSG);
      qaMonitorPlanWSRepo.getMonitorPlanWithALowerBeginDate.mockResolvedValue(
        null,
      );
      const summary = {
        ...summaryBase,
        testTypeCode: TestTypeCodes.F2LCHK.toString(),
        beginMinute: null,
      };
      const result = await service.testMinuteField(summary, '1', 'beginMinute');
      expect(result).toBe(MOCK_ERROR_MSG);
    });
  });
});
