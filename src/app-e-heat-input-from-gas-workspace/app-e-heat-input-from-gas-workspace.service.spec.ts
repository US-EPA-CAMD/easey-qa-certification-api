import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { MonitorSystem } from '../entities/workspace/monitor-system.entity';
import { MonitorSystemRepository } from '../monitor-system/monitor-system.repository';
import {
  AppEHeatInputFromGasDTO,
  AppEHeatInputFromGasImportDTO,
  AppEHeatInputFromGasRecordDTO,
} from '../dto/app-e-heat-input-from-gas.dto';
import { AppEHeatInputFromGasMap } from '../maps/app-e-heat-input-from-gas.map';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { AppEHeatInputFromGasWorkspaceRepository } from './app-e-heat-input-from-gas-workspace.repository';
import { AppEHeatInputFromGasWorkspaceService } from './app-e-heat-input-from-gas-workspace.service';
import { AppEHeatInputFromGas } from '../entities/workspace/app-e-heat-input-from-gas.entity';
import { AppEHeatInputFromGasRepository } from '../app-e-heat-input-from-gas/app-e-heat-input-from-gas.repository';

const locationId = 'LOCATION-ID';
const testSumId = 'TEST-SUM-ID';
const corrTestRunId = 'APP-E-CORR-TEST-RUN-ID';
const userId = 'USER-ID';

const mockTestSummaryService = () => ({
  resetToNeedsEvaluation: jest.fn(),
});

const mockHistoricalRepo = () => ({
  getAppEHeatInputFromGasByTestRunIdAndMonSysID: jest
    .fn()
    .mockResolvedValue(new AppEHeatInputFromGasRecordDTO()),
});

const appECorrTestRunId = 'd4e6f7';
const mockAeHiFromGas = new AppEHeatInputFromGas();
const mockAeHiFromGasDTO = new AppEHeatInputFromGasDTO();

const mockTestSumService = () => ({
  resetToNeedsEvaluation: jest.fn(),
});

const mockRepository = () => ({
  getAppEHeatInputFromGasesByTestRunIds: jest
    .fn()
    .mockResolvedValue([mockAeHiFromGas]),
  create: jest.fn().mockResolvedValue(mockAeHiFromGas),
  save: jest.fn().mockResolvedValue(mockAeHiFromGas),
  findOne: jest.fn().mockResolvedValue(mockAeHiFromGas),
});

const mockMonSysRepository = () => ({
  findOne: jest.fn().mockResolvedValue(new MonitorSystem()),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(mockAeHiFromGasDTO),
  many: jest.fn().mockResolvedValue([mockAeHiFromGasDTO]),
});

describe('AppEHeatInputFromGasWorkspaceService', () => {
  let service: AppEHeatInputFromGasWorkspaceService;
  let repository: AppEHeatInputFromGasWorkspaceRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Logger,
        AppEHeatInputFromGasWorkspaceService,
        {
          provide: TestSummaryWorkspaceService,
          useFactory: mockTestSummaryService,
        },
        {
          provide: AppEHeatInputFromGasRepository,
          useFactory: mockHistoricalRepo,
        },
        {
          provide: TestSummaryWorkspaceService,
          useFactory: mockTestSumService,
        },
        {
          provide: AppEHeatInputFromGasWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: MonitorSystemRepository,
          useFactory: mockMonSysRepository,
        },
        {
          provide: AppEHeatInputFromGasMap,
          useFactory: mockMap,
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

      await service.import(
        locationId,
        testSumId,
        corrTestRunId,
        importDTO,
        userId,
        false,
      );
    });

    it('Should Import Appendix E Heat Input from Gas from Historical Record', async () => {
      jest
        .spyOn(service, 'createAppEHeatInputFromGas')
        .mockResolvedValue(recordDTO);

      await service.import(
        locationId,
        testSumId,
        corrTestRunId,
        importDTO,
        userId,
        true,
      );
    });
  });

  describe('getAppEHeatInputFromGasByTestRunIds', () => {
    it('Should get Appendix E Heat Input From Gas records by test sum ids', async () => {
      const result = await service.getAppEHeatInputFromGasByTestRunIds([
        appECorrTestRunId,
      ]);
      expect(result).toEqual([mockAeHiFromGas]);
    });
  });

  describe('export', () => {
    it('Should export Appendix E Heat Input From Gas Record', async () => {
      jest
        .spyOn(service, 'getAppEHeatInputFromGasByTestRunIds')
        .mockResolvedValue([]);

      const result = await service.export([appECorrTestRunId]);
      expect(result).toEqual([]);
    });
  });
});
