import { Test, TestingModule } from '@nestjs/testing';
import { AppEHeatInputFromGasWorkspaceService } from './app-e-heat-input-from-gas-workspace.service';
import {
  AppEHeatInputFromGasImportDTO,
  AppEHeatInputFromGasRecordDTO,
} from '../dto/app-e-heat-input-from-gas.dto';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { AppEHeatInputFromGasMap } from '../maps/app-e-heat-input-from-gas.map';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { AppEHeatInputFromGasWorkspaceRepository } from './app-e-heat-input-from-gas-workspace.repository';
import { AppEHeatInputFromGas } from '../entities/workspace/app-e-heat-input-from-gas.entity';
import { AppEHeatInputFromGasRepository } from '../app-e-heat-input-from-gas/app-e-heat-input-from-gas.repository';

const testSumId = 'TEST-SUM-ID';
const corrTestRunId = 'APP-E-CORR-TEST-RUN-ID';
const userId = 'USER-ID';

const mockTestSummaryService = () => ({
  resetToNeedsEvaluation: jest.fn(),
});

const mockWorkspaceRepo = () => ({
  save: jest.fn().mockResolvedValue(new AppEHeatInputFromGas()),
});

const mockHistoricalRepo = () => ({
  findOne: jest.fn().mockResolvedValue(new AppEHeatInputFromGasRecordDTO()),
});

describe('AppEHeatInputFromGasWorkspaceService', () => {
  let service: AppEHeatInputFromGasWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Logger,
        AppEHeatInputFromGasWorkspaceService,
        AppEHeatInputFromGasMap,
        {
          provide: TestSummaryWorkspaceService,
          useFactory: mockTestSummaryService,
        },
        {
          provide: AppEHeatInputFromGasWorkspaceRepository,
          useFactory: mockWorkspaceRepo,
        },
        {
          provide: AppEHeatInputFromGasRepository,
          useFactory: mockHistoricalRepo,
        },
      ],
    }).compile();

    service = module.get<AppEHeatInputFromGasWorkspaceService>(
      AppEHeatInputFromGasWorkspaceService,
    );
  });

  describe('import', () => {
    const importDTO = new AppEHeatInputFromGasImportDTO();
    const recordDTO = new AppEHeatInputFromGasRecordDTO();

    it('Should Import Appendix E Heat Input from Gas', async () => {
      jest
        .spyOn(service, 'createAppEHeatInputFromGas')
        .mockResolvedValue(recordDTO);

      await service.import(testSumId, corrTestRunId, importDTO, userId, false);
    });

    it('Should Import Appendix E Heat Input from Gas from Historical Record', async () => {
      jest
        .spyOn(service, 'createAppEHeatInputFromGas')
        .mockResolvedValue(recordDTO);

      await service.import(testSumId, corrTestRunId, importDTO, userId, true);
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
