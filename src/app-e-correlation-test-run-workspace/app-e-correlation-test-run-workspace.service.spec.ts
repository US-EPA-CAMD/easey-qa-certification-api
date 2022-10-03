import { Test, TestingModule } from '@nestjs/testing';
import { AppECorrelationTestRunMap } from '../maps/app-e-correlation-test-run.map';
import {
  AppECorrelationTestRunBaseDTO,
  AppECorrelationTestRunDTO,
} from '../dto/app-e-correlation-test-run.dto';
import { AppECorrelationTestRun } from '../entities/app-e-correlation-test-run.entity';
import { AppECorrelationTestRunWorkspaceRepository } from './app-e-correlation-test-run-workspace.repository';
import { AppECorrelationTestRunWorkspaceService } from './app-e-correlation-test-run-workspace.service';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';

const userId = 'testUser';
const testSumId = 'g7h8i9';
const appECorrTestSumId = 'g7h8i9';
const appECorrTestRunId = 'g7h8i9';
const appECorrelationTestRunRecord = new AppECorrelationTestRunDTO();
const appECorrelationTestRunEntity = new AppECorrelationTestRun();

const payload: AppECorrelationTestRunBaseDTO = new AppECorrelationTestRunBaseDTO();

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(appECorrelationTestRunRecord),
  many: jest.fn().mockResolvedValue([appECorrelationTestRunRecord]),
});

const mockRepository = () => ({
  save: jest.fn().mockResolvedValue(appECorrelationTestRunEntity),
  create: jest.fn().mockResolvedValue(appECorrelationTestRunEntity),
  find: jest.fn().mockResolvedValue([appECorrelationTestRunEntity]),
  findOne: jest.fn().mockResolvedValue(appECorrelationTestRunEntity),
});

const mockTestSumService = () => ({
  resetToNeedsEvaluation: jest.fn(),
});

describe('AppECorrelationTestRunWorkspaceService', () => {
  let service: AppECorrelationTestRunWorkspaceService;
  let repository: AppECorrelationTestRunWorkspaceRepository;
  let testSummaryService: TestSummaryWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppECorrelationTestRunWorkspaceService,
        {
          provide: AppECorrelationTestRunWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: AppECorrelationTestRunMap,
          useFactory: mockMap,
        },
        {
          provide: TestSummaryWorkspaceService,
          useFactory: mockTestSumService,
        },
      ],
    }).compile();

    service = module.get<AppECorrelationTestRunWorkspaceService>(
      AppECorrelationTestRunWorkspaceService,
    );
    repository = module.get<AppECorrelationTestRunWorkspaceRepository>(
      AppECorrelationTestRunWorkspaceRepository,
    );
    testSummaryService = module.get<TestSummaryWorkspaceService>(
      TestSummaryWorkspaceService,
    );
  });

  describe('getAppECorrelationTestRun', () => {
    it('Calls repository.findOne({id}) to get a single Appendix E Correlation Test Run record', async () => {
      const result = await service.getAppECorrelationTestRun(appECorrTestRunId);
      expect(result).toEqual(appECorrelationTestRunRecord);
      expect(repository.findOne).toHaveBeenCalled();
    });

    it('Should throw error when Appendix E Correlation Test Run record not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      let errored = false;

      try {
        await service.getAppECorrelationTestRun(appECorrTestRunId);
      } catch (err) {
        errored = true;
      }

      expect(errored).toBe(true);
    });
  });

  describe('getAppECorrelationTestRuns', () => {
    it('Calls Repository to find all Appendix E Correlation Test Run records for a given Test Summary ID', async () => {
      const results = await service.getAppECorrelationTestRuns(
        appECorrTestSumId,
      );
      expect(results).toEqual([appECorrelationTestRunRecord]);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('createFuelFlowToLoadTest', () => {
    it('Should create and return a new Fuel Flow To Load Test record', async () => {
      const result = await service.createAppECorrelationTestRun(
        testSumId,
        appECorrTestSumId,
        payload,
        userId,
      );

      expect(result).toEqual(appECorrelationTestRunRecord);
      expect(testSummaryService.resetToNeedsEvaluation).toHaveBeenCalled();
    });
  });
});
