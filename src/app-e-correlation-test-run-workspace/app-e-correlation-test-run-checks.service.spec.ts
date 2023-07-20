import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { AppECorrelationTestRunChecksService } from './app-e-correlation-test-run-checks.service';
import { AppECorrelationTestRunWorkspaceRepository } from '../app-e-correlation-test-run-workspace/app-e-correlation-test-run-workspace.repository';
import {
  AppECorrelationTestRunBaseDTO,
  AppECorrelationTestRunImportDTO,
} from '../dto/app-e-correlation-test-run.dto';
import { AppECorrelationTestRun } from '../entities/workspace/app-e-correlation-test-run.entity';
import { AppECorrelationTestSummary } from '../entities/workspace/app-e-correlation-test-summary.entity';
import { AppendixETestSummaryWorkspaceRepository } from '../app-e-correlation-test-summary-workspace/app-e-correlation-test-summary-workspace.repository';

const MOCK_ERROR_MSG = 'ERROR MSG';
const mockAppETestSummary = new AppECorrelationTestSummary();
mockAppETestSummary.operatingLevelForRun = 1;
const mockAppETestRun = new AppECorrelationTestRun();
const mockDTO = new AppECorrelationTestRunBaseDTO();
mockDTO.runNumber = 1;
const appETestSumId = '1';

const mockRepo = () => ({
  findDuplicate: jest.fn(),
});

const mockAppETestSumRepo = () => ({
  findOne: jest.fn().mockResolvedValue(mockAppETestSummary),
});

describe('Appendix E Correlation Test Run Checks Service Test', () => {
  let service: AppECorrelationTestRunChecksService;
  let repo: AppECorrelationTestRunWorkspaceRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule, LoggerModule],
      providers: [
        AppECorrelationTestRunChecksService,
        {
          provide: AppECorrelationTestRunWorkspaceRepository,
          useFactory: mockRepo,
        },
        {
          provide: AppendixETestSummaryWorkspaceRepository,
          useFactory: mockAppETestSumRepo,
        },
      ],
    }).compile();

    service = module.get(AppECorrelationTestRunChecksService);
    jest.spyOn(service, 'getMessage').mockReturnValue(MOCK_ERROR_MSG);

    repo = module.get<AppECorrelationTestRunWorkspaceRepository>(
      AppECorrelationTestRunWorkspaceRepository,
    );
  });

  describe('Appendix E Correlation Test Run Checks', () => {
    it('Should pass APPE-49 Check when no duplicates', async () => {
      const result = await service.runChecks(mockDTO, null, appETestSumId);
      expect(result).toEqual([]);
    });

    it('Should fail APPE-49 check when there is a duplicate', async () => {
      jest.spyOn(repo, 'findDuplicate').mockResolvedValue(mockAppETestRun);

      let result;
      try {
        result = await service.runChecks(mockDTO, null, appETestSumId);
      } catch (err) {
        result = err.response.message;
      }

      expect(result).toEqual(MOCK_ERROR_MSG);
    });
  });

  describe('Appendix E Test Run - Duplicate Check on Import', () => {
    let importDTO1 = new AppECorrelationTestRunImportDTO();
    importDTO1.runNumber = 1;
    let importDTO2 = new AppECorrelationTestRunImportDTO();
    importDTO2.runNumber = 2;

    it('Should pass when no duplicates in import payload', async () => {
      const result = await service.runImportChecks([importDTO1, importDTO2]);
      expect(result).toEqual([]); // No error messages
    });

    it('Should fail when there are duplicates in import payload', async () => {
      importDTO2.runNumber = importDTO1.runNumber;
      let result;
      try {
        result = await service.runImportChecks([importDTO1, importDTO2]);
      } catch (err) {
        result = err.response.message;
      }

      expect(result).toEqual([MOCK_ERROR_MSG]);
    });
  });
});
