import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { AppECorrelationTestSummaryChecksService } from './app-e-correlation-test-summary-checks.service';
import {
  AppECorrelationTestSummaryBaseDTO,
  AppECorrelationTestSummaryImportDTO,
} from '../dto/app-e-correlation-test-summary.dto';
import { AppECorrelationTestSummary } from '../entities/workspace/app-e-correlation-test-summary.entity';
import { AppendixETestSummaryWorkspaceRepository } from '../app-e-correlation-test-summary-workspace/app-e-correlation-test-summary-workspace.repository';

const MOCK_ERROR_MSG = 'ERROR MSG';
const mockAppETestSummary = new AppECorrelationTestSummary();
mockAppETestSummary.operatingLevelForRun = 1;
const mockDTO = new AppECorrelationTestSummaryBaseDTO();
mockDTO.operatingLevelForRun = 1;
const testSumId = '1';

const mockRepo = () => ({
  findDuplicate: jest.fn(),
});

describe('Appendix E Correlation Test Summary Checks Service Test', () => {
  let service: AppECorrelationTestSummaryChecksService;
  let repo: AppendixETestSummaryWorkspaceRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule, LoggerModule],
      providers: [
        AppECorrelationTestSummaryChecksService,
        {
          provide: AppendixETestSummaryWorkspaceRepository,
          useFactory: mockRepo,
        },
      ],
    }).compile();

    service = module.get(AppECorrelationTestSummaryChecksService);
    jest.spyOn(service, 'getMessage').mockReturnValue(MOCK_ERROR_MSG);

    repo = module.get<AppendixETestSummaryWorkspaceRepository>(
      AppendixETestSummaryWorkspaceRepository,
    );
  });

  describe('Appendix E Correlation Test Summary Checks', () => {
    it('Should pass APPE-48 Check when no duplicates', async () => {
      const result = await service.runChecks(mockDTO, null, testSumId);
      expect(result).toEqual([]);
    });

    it('Should fail APPE-48 check when there is a duplicate', async () => {
      jest.spyOn(repo, 'findDuplicate').mockResolvedValue(mockAppETestSummary);

      let result;
      try {
        result = await service.runChecks(mockDTO, null, testSumId);
      } catch (err) {
        result = err.response.message;
      }

      expect(result).toEqual(MOCK_ERROR_MSG);
    });
  });

  describe('Appendix E Test Summary - Duplicate Check on Import', () => {
    let importDTO1 = new AppECorrelationTestSummaryImportDTO();
    importDTO1.operatingLevelForRun = 1;
    let importDTO2 = new AppECorrelationTestSummaryImportDTO();
    importDTO2.operatingLevelForRun = 2;

    it('Should pass when no duplicates in import payload', async () => {
      const result = await service.runImportChecks([importDTO1, importDTO2]);
      expect(result).toEqual([]); // No error messages
    });

    it('Should fail when there are duplicates in import payload', async () => {
      importDTO2.operatingLevelForRun = importDTO1.operatingLevelForRun;
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
