import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { AppECorrelationTestRunService } from '../app-e-correlation-test-run/app-e-correlation-test-run.service';
import { AppECorrelationTestRunDTO } from '../dto/app-e-correlation-test-run.dto';
import { AppECorrelationTestSummaryDTO } from '../dto/app-e-correlation-test-summary.dto';
import { AppECorrelationTestSummary } from '../entities/app-e-correlation-test-summary.entity';
import { AppECorrelationTestSummaryMap } from '../maps/app-e-correlation-summary.map';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { AppendixETestSummaryRepository } from './app-e-correlation-test-summary.repository';
import { AppECorrelationTestSummaryService } from './app-e-correlation-test-summary.service';

const testSumId = '';
const entity = new AppECorrelationTestSummary();
const appECorrelationTest = new AppECorrelationTestSummaryDTO();
const appECorrelationTests = [appECorrelationTest];

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue([entity]),
  findOneBy: jest.fn().mockResolvedValue(entity),
  save: jest.fn().mockResolvedValue(entity),
  create: jest.fn().mockResolvedValue(entity),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(appECorrelationTest),
  many: jest.fn().mockResolvedValue(appECorrelationTests),
});

const mockTestSumService = () => ({
  resetToNeedsEvaluation: jest.fn(),
});

const mockTestRunService = () => ({
  export: jest.fn().mockResolvedValue([new AppECorrelationTestRunDTO()]),
});

describe('AppECorrelationTestSummaryWorkspaceService', () => {
  let service: AppECorrelationTestSummaryService;
  let testSummaryService: TestSummaryWorkspaceService;
  let repository: AppendixETestSummaryRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppECorrelationTestSummaryService,
        ConfigService,
        {
          provide: TestSummaryWorkspaceService,
          useFactory: mockTestSumService,
        },
        {
          provide: AppECorrelationTestRunService,
          useFactory: mockTestRunService,
        },
        {
          provide: AppendixETestSummaryRepository,
          useFactory: mockRepository,
        },
        {
          provide: AppECorrelationTestSummaryMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get<AppECorrelationTestSummaryService>(
      AppECorrelationTestSummaryService,
    );
    testSummaryService = module.get<TestSummaryWorkspaceService>(
      TestSummaryWorkspaceService,
    );
    repository = module.get<AppendixETestSummaryRepository>(
      AppendixETestSummaryRepository,
    );
  });

  describe('createAppECorrelation', () => {
    it('Calls the service to create a new Appendix E Correlation Test Summary record', async () => {
      const result = await service.getAppECorrelation(testSumId);
      expect(result).toEqual(appECorrelationTest);
    });
  });

  describe('getAppECorrelationsByTestSumIds', () => {
    it('Should get Appendix E Correlation Test Summary records by test sum ids', async () => {
      const result = await service.getAppECorrelationsByTestSumIds([testSumId]);
      expect(result).toEqual([appECorrelationTest]);
    });
  });

  describe('getAppECorrelationsByTestSumIds', () => {
    it('Should get Appendix E Correlation Test Sum ids', async () => {
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
});
