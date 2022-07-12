import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { TestSummaryWorkspaceRepository } from './test-summary.repository';
import { QASuppDataWorkspaceRepository } from '../qa-supp-data-workspace/qa-supp-data.repository';
import { TestSummaryChecksService } from './test-summary-checks.service';
import { TestSummaryBaseDTO } from '../dto/test-summary.dto';
import { TestTypeCodes } from '../enums/test-type-code.enum';
import { QAMonitorPlanWorkspaceRepository } from '../qa-monitor-plan-workspace/qa-monitor-plan.repository';
import { MonitorPlan } from '../entities/workspace/monitor-plan.entity';

describe('Test Summary Check Service Test', () => {
  let service: TestSummaryChecksService;
  let qaMonitorPlanWSRepo: any;

  const summaryBase: TestSummaryBaseDTO = new TestSummaryBaseDTO();
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
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        TestSummaryChecksService,
        TestSummaryWorkspaceRepository,
        QASuppDataWorkspaceRepository,
        {
          provide: QAMonitorPlanWorkspaceRepository,
          useFactory: mockQAMonitorPlanWorkspaceRepository,
        },
      ],
    }).compile();

    qaMonitorPlanWSRepo = module.get(QAMonitorPlanWorkspaceRepository);

    service = module.get(TestSummaryChecksService);
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
        'You did not provide [beginMinute] for [Test Summary]. This information will be required for ECMPS submissions.',
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
