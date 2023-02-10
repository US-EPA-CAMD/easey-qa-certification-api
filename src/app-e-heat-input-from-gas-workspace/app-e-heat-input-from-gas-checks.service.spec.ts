import { Test } from '@nestjs/testing';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { AppEHeatInputFromGasChecksService } from './app-e-heat-input-from-gas-checks.service';
import { AppECorrelationTestRunWorkspaceRepository } from '../app-e-correlation-test-run-workspace/app-e-correlation-test-run-workspace.repository';
import { AppEHeatInputFromGasWorkspaceRepository } from './app-e-heat-input-from-gas-workspace.repository';
import { AppECorrelationTestRun } from '../entities/workspace/app-e-correlation-test-run.entity';
import { AppECorrelationTestSummary } from '../entities/workspace/app-e-correlation-test-summary.entity';
import { TestSummary } from '../entities/workspace/test-summary.entity';
import {
  AppEHeatInputFromGasBaseDTO,
  AppEHeatInputFromGasImportDTO,
} from '../dto/app-e-heat-input-from-gas.dto';
import { AppEHeatInputFromGas } from '../entities/workspace/app-e-heat-input-from-gas.entity';

const MOCK_ERROR_MSG = 'ERROR MSG';
const mockAppETestRun: AppECorrelationTestRun = new AppECorrelationTestRun();
mockAppETestRun.runNumber = 1;
mockAppETestRun.appECorrelationTestSummary = new AppECorrelationTestSummary();
mockAppETestRun.appECorrelationTestSummary.operatingLevelForRun = 1;
mockAppETestRun.appECorrelationTestSummary.testSummary = new TestSummary();
const mockDTO = new AppEHeatInputFromGasBaseDTO();
mockDTO.monitoringSystemID = 'X';
const mockDuplicate = new AppEHeatInputFromGas();
const appETestRunId = '1';

const mockRepo = () => ({
  findDuplicate: jest.fn(),
});

const mockAppETestRunRepo = () => ({
  findOneWithAncestors: jest.fn().mockResolvedValue(mockAppETestRun),
});

describe('Appendix E Heat Input From Gas Checks Service Test', () => {
  let service: AppEHeatInputFromGasChecksService;
  let appEHeatInputFromGasRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule, LoggingException],
      providers: [
        AppEHeatInputFromGasChecksService,
        {
          provide: AppECorrelationTestRunWorkspaceRepository,
          useFactory: mockAppETestRunRepo,
        },
        {
          provide: AppEHeatInputFromGasWorkspaceRepository,
          useFactory: mockRepo,
        },
      ],
    }).compile();

    service = module.get(AppEHeatInputFromGasChecksService);
    jest.spyOn(service, 'getMessage').mockReturnValue(MOCK_ERROR_MSG);

    appEHeatInputFromGasRepository = module.get<
      AppEHeatInputFromGasWorkspaceRepository
    >(AppEHeatInputFromGasWorkspaceRepository);
  });

  describe('Appendix E Heat Input From Gas Checks', () => {
    it('Should pass APPE-51 Check when no duplicates', async () => {
      const result = await service.runChecks(mockDTO, null, appETestRunId);
      expect(result).toEqual([]);
    });

    it('Should fail APPE-51 check when there is a duplicate', async () => {
      jest
        .spyOn(appEHeatInputFromGasRepository, 'findDuplicate')
        .mockReturnValue([mockDTO]);

      let result;
      try {
        result = await service.runChecks(mockDTO, null, appETestRunId);
      } catch (err) {
        result = err.response.message;
      }

      expect(result).toEqual([MOCK_ERROR_MSG]);
    });
  });

  describe('Appendix E Heat Input from Gas - Duplicate Check on Import', () => {
    let importDTO1 = new AppEHeatInputFromGasImportDTO();
    importDTO1.monitoringSystemID = 'ID1';
    let importDTO2 = new AppEHeatInputFromGasImportDTO();
    importDTO2.monitoringSystemID = 'ID2';

    it('Should pass when no duplicates in import payload', async () => {
      const result = await service.runImportChecks([importDTO1, importDTO2]);
      expect(result).toEqual([]); // No error messages
    });

    it('Should fail when there are duplicates in import payload', async () => {
      importDTO2.monitoringSystemID = importDTO1.monitoringSystemID;
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
