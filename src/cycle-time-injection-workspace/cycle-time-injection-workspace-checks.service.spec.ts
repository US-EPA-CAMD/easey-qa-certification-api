import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { CycleTimeInjection } from '../entities/workspace/cycle-time-injection.entity';
import { 
  CycleTimeInjectionBaseDTO,
  CycleTimeInjectionImportDTO
} from '../dto/cycle-time-injection.dto';
import { CycleTimeInjectionChecksService } from './cycle-time-injection-workspace-checks.service';
import { CycleTimeInjectionWorkspaceRepository } from './cycle-time-injection-workspace.repository';
import { CycleTimeSummaryWorkspaceRepository } from '../cycle-time-summary-workspace/cycle-time-summary-workspace.repository';
import { CycleTimeSummary } from '../entities/workspace/cycle-time-summary.entity';
import { TestSummaryWorkspaceRepository } from '../test-summary-workspace/test-summary.repository';
import { TestSummary } from '../entities/workspace/test-summary.entity';
import { TestSummaryImportDTO } from '../dto/test-summary.dto';
import { TestTypeCodes } from '../enums/test-type-code.enum';

const MOCK_ERROR_MSG = 'MOCK_ERROR_MSG';
const testSumId = '1';
const cycleTimeSumId = '1';

const mockRepository = () => ({
  findOne: jest.fn().mockResolvedValue(null),
});

const cycleTimeInj = new CycleTimeInjection();
const cycleTimeSum = new CycleTimeSummary();
const testSummary = new TestSummary();
testSummary.testTypeCode = 'CYCLE';
cycleTimeSum.cycleTimeInjections = [cycleTimeInj];

const mockCycleTimeSummaryRepository = () => ({
  getSummaryById: jest.fn().mockResolvedValue(cycleTimeSum),
});

const mockTestSummaryRepository = () => ({
  getTestSummaryById: jest.fn().mockResolvedValue(testSummary),
});

describe('Linearity Injection Check Service Test', () => {
  let service: CycleTimeInjectionChecksService;
  let repository: CycleTimeInjectionWorkspaceRepository;
  let linearitySummaryRepository: CycleTimeSummaryWorkspaceRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        CycleTimeInjectionChecksService,
        {
          provide: CycleTimeInjectionWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: CycleTimeSummaryWorkspaceRepository,
          useFactory: mockCycleTimeSummaryRepository,
        },
        {
          provide: TestSummaryWorkspaceRepository,
          useFactory: mockTestSummaryRepository,
        },
      ],
    }).compile();

    service = module.get(CycleTimeInjectionChecksService);
    repository = module.get(CycleTimeInjectionWorkspaceRepository);
    linearitySummaryRepository = module.get(
      CycleTimeSummaryWorkspaceRepository,
    );

    jest.spyOn(service, 'getMessage').mockReturnValue(MOCK_ERROR_MSG);
  });

  describe('Linearity Injection Checks', () => {
    const payload = new CycleTimeInjectionBaseDTO();
    payload.gasLevelCode = 'ZERO';
    it('Should pass all checks', async () => {
      const result = await service.runChecks(payload, cycleTimeSumId, testSumId);
      expect(result).toEqual([]);
    });
  });

  describe('CYCLE-21 Gas Monitoring System ID Valid (Result B)', () => {
    const payload = new CycleTimeInjectionBaseDTO();

    const returnValue = new CycleTimeInjection();

    it('Should get CYCLE-21-B error', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(returnValue);

      try {
        await service.runChecks(payload, cycleTimeSumId, testSumId);
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    });
  });
});
