import { HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import {
  AppECorrelationTestSummaryBaseDTO,
  AppECorrelationTestSummaryDTO,
} from '../dto/app-e-correlation-test-summary.dto';
import { AppECorrelationTestSummary } from '../entities/app-e-correlation-test-summary.entity';
import { AppECorrelationTestSummaryMap } from '../maps/app-e-correlation-summary.map';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { AppendixETestSummaryWorkspaceRepository } from './app-e-correlation-test-summary-workspace.repository';
import { AppECorrelationTestSummaryWorkspaceService } from './app-e-correlation-test-summary-workspace.service';

const testSumId = '';
const userId = 'user';
const appendixECorrelationTestSummaryId = '';
const entity = new AppECorrelationTestSummary();
const appECorrelationTest = new AppECorrelationTestSummaryDTO();
const appECorrelationTests = [appECorrelationTest];

const payload = new AppECorrelationTestSummaryBaseDTO();

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue([entity]),
  findOne: jest.fn().mockResolvedValue(entity),
  save: jest.fn().mockResolvedValue(entity),
  create: jest.fn().mockResolvedValue(entity),
  delete: jest.fn().mockResolvedValue(null),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(appECorrelationTest),
  many: jest.fn().mockResolvedValue(appECorrelationTests),
});

const mockTestSumService = () => ({
  resetToNeedsEvaluation: jest.fn(),
});

describe('AppECorrelationTestSummaryWorkspaceService', () => {
  let service: AppECorrelationTestSummaryWorkspaceService;
  let testSummaryService: TestSummaryWorkspaceService;
  let repository: AppendixETestSummaryWorkspaceRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppECorrelationTestSummaryWorkspaceService,
        {
          provide: TestSummaryWorkspaceService,
          useFactory: mockTestSumService,
        },
        {
          provide: AppendixETestSummaryWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: AppECorrelationTestSummaryMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get<AppECorrelationTestSummaryWorkspaceService>(
      AppECorrelationTestSummaryWorkspaceService,
    );
    testSummaryService = module.get<TestSummaryWorkspaceService>(
      TestSummaryWorkspaceService,
    );
    repository = module.get<AppendixETestSummaryWorkspaceRepository>(
      AppendixETestSummaryWorkspaceRepository,
    );
  });

  describe('createAppECorrelation', () => {
    it('Calls the service to create a new Appendix E Correlation Test Summary record', async () => {
      const result = await service.createAppECorrelation(
        testSumId,
        payload,
        userId,
      );

      expect(result).toEqual(appECorrelationTest);
      expect(testSummaryService.resetToNeedsEvaluation).toHaveBeenCalled();
    });

    describe('editAppECorrelation', () => {
      it('should update an Appendix E Correlation Test Summary record', async () => {
        const result = await service.editAppECorrelation(
          testSumId,
          appendixECorrelationTestSummaryId,
          payload,
          userId,
        );
        expect(result).toEqual(appECorrelationTest);
      });

      it('should throw error with invalid Appendix E Correlation Test Summary', async () => {
        jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);

        let errored = false;
        try {
          await service.editAppECorrelation(
            testSumId,
            appendixECorrelationTestSummaryId,
            payload,
            userId,
          );
        } catch (e) {
          errored = true;
        }
        expect(errored).toEqual(true);
      });
    });
  });
  describe('getAppECorrelationsByTestSumIds', () => {
    it('Should get Appendix E Correlation Test Summary records by test sum ids', async () => {
      const result = await service.getAppECorrelationsByTestSumIds([testSumId]);
      expect(result).toEqual([appECorrelationTest]);
    });
  });

  describe('Export', () => {
    it('Should Export Appendix E Correlation Test Summary', async () => {
      jest
        .spyOn(service, 'getAppECorrelationsByTestSumIds')
        .mockResolvedValue([appECorrelationTest]);
      const result = await service.export([testSumId]);
      expect(result).toEqual([appECorrelationTest]);
    });
  });

  describe('deleteAppECorrelation', () => {
    it('Should delete an Appendix E Correlation Test Summary record', async () => {
      const result = await service.deleteAppECorrelation(
        testSumId,
        appendixECorrelationTestSummaryId,
        userId,
      );
      expect(result).toEqual(undefined);
    });

    it('Should throw error while deleting an Appendix E Correlation Test Summary record', async () => {
      const error = new LoggingException(
        `Error Appendix E Correlation Test Summary with record Id [${appendixECorrelationTestSummaryId}]`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      jest.spyOn(repository, 'delete').mockRejectedValue(error);

      let errored = false;
      try {
        await service.deleteAppECorrelation(
          testSumId,
          appendixECorrelationTestSummaryId,
          userId,
        );
      } catch (e) {
        errored = true;
      }
      expect(errored).toEqual(true);
    });
  });
});
