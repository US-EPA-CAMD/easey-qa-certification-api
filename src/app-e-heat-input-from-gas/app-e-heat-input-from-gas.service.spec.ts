import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { TestSummaryService } from '../test-summary/test-summary.service';
import { AppEHeatInputFromGasDTO } from '../dto/app-e-heat-input-from-gas.dto';
import { AppEHeatInputFromGas } from '../entities/app-e-heat-input-from-gas.entity';
import { AppEHeatInputFromGasMap } from '../maps/app-e-heat-input-from-gas.map';
import { AppEHeatInputFromGasRepository } from './app-e-heat-input-from-gas.repository';
import { AppEHeatInputFromGasService } from './app-e-heat-input-from-gas.service';

const appECorrTestRunId = 'd4e6f7';
const mockAeHiFromGas = new AppEHeatInputFromGas();
const mockAeHiFromGasDTO = new AppEHeatInputFromGasDTO();

const mockTestSumService = () => ({
  resetToNeedsEvaluation: jest.fn(),
});

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue([mockAeHiFromGas]),
  create: jest.fn().mockResolvedValue(mockAeHiFromGas),
  save: jest.fn().mockResolvedValue(mockAeHiFromGas),
  findOne: jest.fn().mockResolvedValue(mockAeHiFromGas),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(mockAeHiFromGasDTO),
  many: jest.fn().mockResolvedValue([mockAeHiFromGasDTO]),
});

describe('AppEHeatInputFromGasWorkspaceService', () => {
  let service: AppEHeatInputFromGasService;
  let repository: AppEHeatInputFromGasRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Logger,
        AppEHeatInputFromGasService,
        {
          provide: TestSummaryService,
          useFactory: mockTestSumService,
        },
        {
          provide: AppEHeatInputFromGasRepository,
          useFactory: mockRepository,
        },
        {
          provide: AppEHeatInputFromGasMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get<AppEHeatInputFromGasService>(
      AppEHeatInputFromGasService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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
