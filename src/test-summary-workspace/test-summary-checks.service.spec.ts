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

const locationId = '1';

const mockRepository = () => ({
  getTestSummaryByLocationId: jest.fn().mockResolvedValue(null),
});
const mockQARepository = () => ({
  getQASuppDataByLocationId: jest.fn().mockResolvedValue(null),
});

describe('Test Summary Check Service Test', () => {
  let service: TestSummaryChecksService;
  let repository: TestSummaryWorkspaceRepository;
  let qArepository: QASuppDataWorkspaceRepository;
  let qaMonitorPlanWSRepo: any;

  const summaryBase: TestSummaryBaseDTO = new TestSummaryBaseDTO();
  summaryBase.unitId = '1';
  summaryBase.beginHour = 1;
  summaryBase.beginMinute = 1;
  summaryBase.endHour = 1;
  summaryBase.endMinute = 2;
  summaryBase.beginDate = new Date('2020-01-01');
  summaryBase.endDate = new Date('2020-01-01');
  summaryBase.testTypeCode = TestTypeCodes.ONOFF.toString();
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
      ],
    }).compile();

    qaMonitorPlanWSRepo = module.get(QAMonitorPlanWorkspaceRepository);
    qArepository = module.get(QASuppDataWorkspaceRepository);

    service = module.get(TestSummaryChecksService);
    repository = module.get(TestSummaryWorkspaceRepository);
  });

  describe('Test Summary Checks', () => {
    const payload = new TestSummaryImportDTO();
    payload.testTypeCode = TestTypeCodes.LINE;
    payload.testNumber = '';
    payload.beginHour = 1;
    payload.beginMinute = 1;
    payload.endHour = 1;
    payload.endMinute = 2;
    payload.beginDate = new Date('2020-01-01');
    payload.endDate = new Date('2020-01-01');

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
      const result = await service.runChecks(
        locationId,
        payload,
        [payload],
        true,
      );

      expect(result).toEqual([]);
    });

    it('Should get error IMPORT -20 Duplicate Test Summary record', async () => {
      jest
        .spyOn(repository, 'getTestSummaryByLocationId')
        .mockResolvedValue(null);
      const result = await service.runChecks(
        locationId,
        payload,
        [payload, payload],
        true,
      );

      expect(result).toEqual([
        `You have reported multiple Test Summary records for Unit/Stack [${payload.unitId}], Test Type Code [${payload.testTypeCode}], and Test Number [${payload.testNumber}]`,
      ]);
    });

    it('Should get error IMPORT -21 Duplicate Test Summary record', async () => {
      const returnedTestSummary = new TestSummary();
      jest
        .spyOn(repository, 'getTestSummaryByLocationId')
        .mockResolvedValue(returnedTestSummary);
      const result = await service.runChecks(
        locationId,
        payload,
        [payload],
        true,
      );

      expect(result).toEqual([
        `The database contains another Test Summary record for Unit/Stack [${payload.unitId}], Test Type Code [${payload.testTypeCode}], and Test Number [${payload.testNumber}]. However, the values reported for [End Date,End Hour] are different between the two tests.`,
      ]);
    });

    it('Should get error LINEAR -31 Duplicate Test Summary record (Result A)', async () => {
      const returnedTestSummary = new TestSummary();
      returnedTestSummary.reportingPeriod = null;
      returnedTestSummary.spanScaleCode = '';
      returnedTestSummary.component = null;
      returnedTestSummary.system = null;
      returnedTestSummary.testTypeCode = TestTypeCodes.LINE;
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
        await service.runChecks(locationId, payload, [payload, payload]);
      } catch (err) {
        expect(err.response.message).toEqual([
          `Another Test Summary record for Unit/Stack [${payload.unitId}], Test Type Code [${payload.testTypeCode}], and Test Number [${payload.testNumber}]. You must assign a different test number.`,
        ]);
      }
    });

    it('Should get error LINEAR -31 Duplicate Test Summary record (Result B)', async () => {
      const returnedQASupp = new QASuppData();

      jest
        .spyOn(repository, 'getTestSummaryByLocationId')
        .mockResolvedValue(null);

      jest
        .spyOn(qArepository, 'getQASuppDataByLocationId')
        .mockResolvedValue(returnedQASupp);
      try {
        await service.runChecks(locationId, payload, [payload, payload]);
      } catch (err) {
        expect(err.response.message).toEqual([
          `Another Test Summary record for Unit/Stack [${payload.unitId}], Test Type Code [${payload.testTypeCode}], and Test Number [${payload.testNumber}]. You cannot change the Test Number to the value that you have entered, because a test with this Test Type and Test Number has already been submitted. If this is a different test, you should assign it a different Test Number. If you are trying to resubmit this test, you should delete this test, and either reimport this test with its original Test Number or retrieve the original test from the EPA host system.`,
        ]);
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
