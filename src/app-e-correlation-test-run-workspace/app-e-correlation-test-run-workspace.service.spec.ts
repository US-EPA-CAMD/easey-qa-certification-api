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
import { InternalServerErrorException } from '@nestjs/common';

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
  delete: jest.fn().mockResolvedValue(null),
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

  describe('createAppECorrelationTestRun', () => {
    it('Should create and return a new Appendix E Correlation Test Run record', async () => {
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

  describe('updateAppECorrelationTestRun', () => {
    it('Should update a Appendix E Correlation Test Run record', async () => {
      const result = await service.updateAppECorrelationTestRun(
        testSumId,
        appECorrTestSumId,
        appECorrTestRunId,
        payload,
        userId,
      );
      expect(result).toEqual(appECorrelationTestRunRecord);
    });

    it('Should through error while updating a Appendix E Correlation Test Run record', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);

      let errored = false;
      try {
        await service.updateAppECorrelationTestRun(
          testSumId,
          appECorrTestSumId,
          appECorrTestRunId,
          payload,
          userId,
        );
      } catch (e) {
        errored = true;
      }
      expect(errored).toEqual(true);
    });
  });

  describe('deleteAppECorrelationTestRun', () => {
    it('Should delete a Appendix E Correlation Test Run record', async () => {
      const result = await service.deleteAppECorrelationTestRun(
        testSumId,
        appECorrTestSumId,
        appECorrTestRunId,
        userId,
      );
      expect(result).toEqual(undefined);
    });

    it('Should through error while deleting a Appendix E Correlation Test Run record', async () => {
      const error = new InternalServerErrorException(
        `Error deleting Appendix E Correlation Test Run record Id [${appECorrTestRunId}]`,
      );
      jest.spyOn(repository, 'delete').mockRejectedValue(error);

      let errored = false;
      try {
        await service.deleteAppECorrelationTestRun(
          testSumId,
          appECorrTestSumId,
          appECorrTestRunId,
          userId,
        );
      } catch (e) {
        errored = true;
      }
      expect(errored).toEqual(true);
    });
  });
});
