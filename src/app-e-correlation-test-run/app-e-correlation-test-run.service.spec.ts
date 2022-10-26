import { Test, TestingModule } from '@nestjs/testing';
import { AppEHeatInputFromGasDTO } from '../dto/app-e-heat-input-from-gas.dto';
import { AppEHeatInputFromOilDTO } from '../dto/app-e-heat-input-from-oil.dto';
import { AppECorrelationTestRunDTO } from '../dto/app-e-correlation-test-run.dto';
import { AppECorrelationTestRun } from '../entities/app-e-correlation-test-run.entity';
import { AppECorrelationTestRunMap } from '../maps/app-e-correlation-test-run.map';
import { AppECorrelationTestRunRepository } from './app-e-correlation-test-run.repository';
import { AppECorrelationTestRunService } from './app-e-correlation-test-run.service';
import { AppEHeatInputFromGasService } from '../app-e-heat-input-from-gas/app-e-heat-input-from-gas.service';
import { AppEHeatInputFromOilService } from '../app-e-heat-input-from-oil/app-e-heat-input-from-oil.service';

const testSumId = '1';
const appECorrTestSumId = 'g7h8i9';
const appECorrTestRunId = 'g7h8i9';
const appECorrelationTestRunRecord = new AppECorrelationTestRunDTO();
const appECorrelationTestRunEntity = new AppECorrelationTestRun();

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(appECorrelationTestRunRecord),
  many: jest.fn().mockResolvedValue([appECorrelationTestRunRecord]),
});

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue([appECorrelationTestRunEntity]),
  findOne: jest.fn().mockResolvedValue(appECorrelationTestRunEntity),
});

const mockAppEHeatInputFromGasService = () => ({
  export: jest.fn().mockResolvedValue([new AppEHeatInputFromGasDTO()]),
});
const mockAppEHeatInputFromOilService = () => ({
  export: jest.fn().mockResolvedValue([new AppEHeatInputFromOilDTO()]),
});

describe('AppECorrelationTestRunService', () => {
  let service: AppECorrelationTestRunService;
  let repository: AppECorrelationTestRunRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppECorrelationTestRunService,
        {
          provide: AppECorrelationTestRunRepository,
          useFactory: mockRepository,
        },
        {
          provide: AppECorrelationTestRunMap,
          useFactory: mockMap,
        },
        {
          provide: AppEHeatInputFromGasService,
          useFactory: mockAppEHeatInputFromGasService,
        },
        {
          provide: AppEHeatInputFromOilService,
          useFactory: mockAppEHeatInputFromOilService,
        },
      ],
    }).compile();

    service = module.get<AppECorrelationTestRunService>(
      AppECorrelationTestRunService,
    );
    repository = module.get<AppECorrelationTestRunRepository>(
      AppECorrelationTestRunRepository,
    );
  });

  describe('getAppECorrelationTestRun', () => {
    it('Calls repository.findOne({id}) to get a single Appendix E Correlation Test Run record', async () => {
      const result = await service.getAppECorrelationTestRun(appECorrTestRunId);
      expect(result).toEqual(appECorrelationTestRunRecord);
      expect(repository.findOne).toHaveBeenCalled();
    });

    it('Should throw error when Appendix E Correlation Test Run record not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      let errored = false;

      try {
        await service.getAppECorrelationTestRun(appECorrTestRunId);
      } catch (err) {
        errored = true;
      }

      expect(errored).toBe(true);
    });
  });

  describe('getAppECorrelationTestRuns', () => {
    it('Calls Repository to find all Appendix E Correlation Test Run records for a given Test Summary ID', async () => {
      const results = await service.getAppECorrelationTestRuns(
        appECorrTestSumId,
      );
      expect(results).toEqual([appECorrelationTestRunRecord]);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('getAppECorrelationTestRunsByAppECorrelationTestSumId', () => {
    it('Should get Appendix E Correlation Test Sum ids', async () => {
      const result = await service.getAppECorrelationTestRunsByAppECorrelationTestSumId(
        [testSumId],
      );
      expect(result).toEqual([appECorrelationTestRunRecord]);
    });
  });

  describe('Export', () => {
    it('Should Export Appendix E Correlation Test Run', async () => {
      jest
        .spyOn(service, 'getAppECorrelationTestRunsByAppECorrelationTestSumId')
        .mockResolvedValue([appECorrelationTestRunRecord]);
      const result = await service.export([testSumId]);
      expect(result).toEqual([appECorrelationTestRunRecord]);
    });
  });
});
