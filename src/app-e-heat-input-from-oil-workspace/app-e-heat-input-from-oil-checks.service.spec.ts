import { Test } from '@nestjs/testing';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { AppEHeatInputFromOilChecksService } from './app-e-heat-input-from-oil-checks.service';
import { AppECorrelationTestRunWorkspaceRepository } from '../app-e-correlation-test-run-workspace/app-e-correlation-test-run-workspace.repository';
import { AppEHeatInputFromOilWorkspaceRepository } from './app-e-heat-input-from-oil.repository';
import { AppECorrelationTestRun } from '../entities/workspace/app-e-correlation-test-run.entity';
import { AppECorrelationTestSummary } from '../entities/workspace/app-e-correlation-test-summary.entity';
import { TestSummary } from '../entities/workspace/test-summary.entity';
import {
  AppEHeatInputFromOilBaseDTO,
  AppEHeatInputFromOilImportDTO,
} from '../dto/app-e-heat-input-from-oil.dto';
import { AppEHeatInputFromOil } from '../entities/workspace/app-e-heat-input-from-oil.entity';

const MOCK_ERROR_MSG = 'ERROR MSG';
const mockAppETestRun: AppECorrelationTestRun = new AppECorrelationTestRun();
mockAppETestRun.runNumber = 1;
mockAppETestRun.appECorrelationTestSummary = new AppECorrelationTestSummary();
mockAppETestRun.appECorrelationTestSummary.operatingLevelForRun = 1;
mockAppETestRun.appECorrelationTestSummary.testSummary = new TestSummary();
const mockDTO = new AppEHeatInputFromOilBaseDTO();
mockDTO.monitoringSystemID = 'X';
const mockDuplicate = new AppEHeatInputFromOil();
const appETestRunId = '1';

const mockRepo = () => ({
  findDuplicate: jest.fn(),
});

const mockAppETestRunRepo = () => ({
  findOneWithAncestors: jest.fn().mockResolvedValue(mockAppETestRun),
});

describe('Appendix E Heat Input From Oil Checks Service Test', () => {
  let service: AppEHeatInputFromOilChecksService;
  let appEHeatInputFromOilRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule, LoggingException],
      providers: [
        AppEHeatInputFromOilChecksService,
        {
          provide: AppECorrelationTestRunWorkspaceRepository,
          useFactory: mockAppETestRunRepo,
        },
        {
          provide: AppEHeatInputFromOilWorkspaceRepository,
          useFactory: mockRepo,
        },
      ],
    }).compile();

    service = module.get(AppEHeatInputFromOilChecksService);
    jest.spyOn(service, 'getMessage').mockReturnValue(MOCK_ERROR_MSG);

    appEHeatInputFromOilRepository = module.get<
      AppEHeatInputFromOilWorkspaceRepository
    >(AppEHeatInputFromOilWorkspaceRepository);
  });

  describe('Appendix E Heat Input From Oil Checks', () => {
    it('Should pass APPE-50 Check when no duplicates', async () => {
      const result = await service.runChecks(mockDTO, null, appETestRunId);
      expect(result).toEqual([]);
    });

    it('Should fail APPE-50 check when there is a duplicate', async () => {
      jest
        .spyOn(appEHeatInputFromOilRepository, 'findDuplicate')
        .mockReturnValue(mockDuplicate);

      let result;
      try {
        result = await service.runChecks(mockDTO, null, appETestRunId);
      } catch (err) {
        result = err.response.message;
      }

      expect(result).toEqual([MOCK_ERROR_MSG]);
    });
  });
});
