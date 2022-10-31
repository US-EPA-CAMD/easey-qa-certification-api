import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { TestSummaryService } from '../test-summary/test-summary.service';
import { AppEHeatInputFromGasRecordDTO } from '../dto/app-e-heat-input-from-gas.dto';
import { AppEHeatInputFromGas } from '../entities/app-e-heat-input-from-gas.entity';
import { AppEHeatInputFromGasMap } from '../maps/app-e-heat-input-from-gas.map';
import { AppEHeatInputFromGasRepository } from './app-e-heat-input-from-gas.repository';
import { AppEHeatInputFromGasService } from './app-e-heat-input-from-gas.service';

const appECorrTestRunId = 'd4e6f7';
const appEHIGasId = 'a1b2c3';
const appEHIGasRecord = new AppEHeatInputFromGasRecordDTO();
const appEHIGasRecords = [appEHIGasRecord];

const mockTestSumService = () => ({
  resetToNeedsEvaluation: jest.fn(),
});

const mockRepository = () => ({
  testSumIds: jest.fn().mockResolvedValue(appEHIGasRecords),
  create: jest.fn().mockResolvedValue(appEHIGasRecord),
  save: jest.fn().mockResolvedValue(appEHIGasRecord),
  findOne: jest.fn().mockResolvedValue(appEHIGasRecord),
  getAppEHeatInputFromGasById: jest.fn().mockResolvedValue(appEHIGasRecord),
  getAppEHeatInputFromGasByTestRunId: jest
    .fn()
    .mockResolvedValue(appEHIGasRecords),
  getAppEHeatInputFromGasesByTestRunIds: jest
    .fn()
    .mockResolvedValue(appEHIGasRecords),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(appEHIGasRecord),
  many: jest.fn().mockResolvedValue(appEHIGasRecords),
});

describe('AppEHeatInputFromGasService', () => {
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
    repository = module.get<AppEHeatInputFromGasRepository>(
      AppEHeatInputFromGasRepository,
    );
  });

  describe('getAppEHeatInputFromGases', () => {
    it('calls the repository.find() to get Appendix E Heat Input from Gas records by Appendix E Correlation Test Run Id', async () => {
      const result = await service.getAppEHeatInputFromGases(appECorrTestRunId);
      expect(result).toEqual(appEHIGasRecords);
    });
  });

  describe('getAppEHeatInputFromGas', () => {
    it('Calls repository.findOne({id}) to get a Appendix E Heat Input from Oil record', async () => {
      const result = await service.getAppEHeatInputFromGas(appEHIGasId);
      expect(result).toEqual(appEHIGasRecord);
    });

    it('Should throw error when record not found', async () => {
      jest
        .spyOn(repository, 'getAppEHeatInputFromGasById')
        .mockResolvedValue(null);

      let errored = false;

      try {
        await service.getAppEHeatInputFromGas('kdiene');
      } catch (err) {
        errored = true;
      }

      expect(errored).toBe(true);
    });
  });

  describe('getAppEHeatInputFromGasByTestRunIds', () => {
    it('Should get Appendix E Heat Input From Oil records by test sum ids', async () => {
      const result = await service.getAppEHeatInputFromGasByTestRunIds([
        appECorrTestRunId,
      ]);
      expect(result).toEqual(appEHIGasRecords);
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
