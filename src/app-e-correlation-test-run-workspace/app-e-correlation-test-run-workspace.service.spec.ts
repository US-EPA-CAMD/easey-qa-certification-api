import { Test, TestingModule } from '@nestjs/testing';
import { AppECorrelationTestRunMap } from '../maps/app-e-correlation-test-run.map';
import {
  AppECorrelationTestRunBaseDTO,
  AppECorrelationTestRunDTO,
  AppECorrelationTestRunImportDTO,
  AppECorrelationTestRunRecordDTO,
} from '../dto/app-e-correlation-test-run.dto';
import { AppECorrelationTestRun } from '../entities/app-e-correlation-test-run.entity';
import { AppECorrelationTestRunWorkspaceRepository } from './app-e-correlation-test-run-workspace.repository';
import { AppECorrelationTestRunWorkspaceService } from './app-e-correlation-test-run-workspace.service';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { InternalServerErrorException } from '@nestjs/common';
import { AppECorrelationTestRunRepository } from '../app-e-correlation-test-run/app-e-correlation-test-run.repository';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { AppEHeatInputFromGasWorkspaceService } from '../app-e-heat-input-from-gas-workspace/app-e-heat-input-from-gas-workspace.service';
import { AppEHeatInputFromOilWorkspaceService } from '../app-e-heat-input-from-oil-workspace/app-e-heat-input-from-oil.service';
import { AppEHeatInputFromGasMap } from '../maps/app-e-heat-input-from-gas.map';
import { AppEHeatInputFromOilMap } from '../maps/app-e-heat-input-from-oil.map';
import {
  AppEHeatInputFromGasDTO,
  AppEHeatInputFromGasImportDTO,
} from '../dto/app-e-heat-input-from-gas.dto';
import {
  AppEHeatInputFromOilDTO,
  AppEHeatInputFromOilImportDTO,
} from '../dto/app-e-heat-input-from-oil.dto';

const locationId = 'testLocation';
const userId = 'testUser';
const locationId = '5';
const testSumId = 'g7h8i9';
const appECorrTestSumId = 'g7h8i9';
const appECorrTestRunId = 'g7h8i9';
const appECorrelationTestRunRecord = new AppECorrelationTestRunDTO();
const appECorrelationTestRunEntity = new AppECorrelationTestRun();

const payload: AppECorrelationTestRunBaseDTO = new AppECorrelationTestRunBaseDTO();

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(appECorrelationTestRunRecord),
  many: jest.fn().mockResolvedValue([appECorrelationTestRunRecord]),
});

const mockRepository = () => ({
  delete: jest.fn().mockResolvedValue(null),
  save: jest.fn().mockResolvedValue(appECorrelationTestRunEntity),
  create: jest.fn().mockResolvedValue(appECorrelationTestRunEntity),
  find: jest.fn().mockResolvedValue([appECorrelationTestRunEntity]),
  findOne: jest.fn().mockResolvedValue(appECorrelationTestRunEntity),
});

const mockHistoricalRepo = () => ({
  findOne: jest.fn().mockResolvedValue(appECorrelationTestRunRecord),
});

const mockTestSumService = () => ({
  resetToNeedsEvaluation: jest.fn(),
});
const mockAppEHeatInputFromGasService = () => ({
  export: jest.fn().mockResolvedValue([new AppEHeatInputFromGasDTO()]),
});
const mockAppEHeatInputFromOilService = () => ({
  export: jest.fn().mockResolvedValue([new AppEHeatInputFromOilDTO()]),
});

describe('AppECorrelationTestRunWorkspaceService', () => {
  let service: AppECorrelationTestRunWorkspaceService;
  let repository: AppECorrelationTestRunWorkspaceRepository;
  let historicalRepo: AppECorrelationTestRunRepository;
  let testSummaryService: TestSummaryWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Logger,
        AppECorrelationTestRunWorkspaceService,
        {
          provide: AppECorrelationTestRunWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: AppECorrelationTestRunRepository,
          useFactory: mockHistoricalRepo,
        },
        {
          provide: AppECorrelationTestRunMap,
          useFactory: mockMap,
        },
        {
          provide: TestSummaryWorkspaceService,
          useFactory: mockTestSumService,
        },
        {
          provide: AppEHeatInputFromGasWorkspaceService,
          useFactory: mockAppEHeatInputFromGasService,
        },
        {
          provide: AppEHeatInputFromOilWorkspaceService,
          useFactory: mockAppEHeatInputFromOilService,
        },
      ],
    }).compile();

    service = module.get<AppECorrelationTestRunWorkspaceService>(
      AppECorrelationTestRunWorkspaceService,
    );
    repository = module.get<AppECorrelationTestRunWorkspaceRepository>(
      AppECorrelationTestRunWorkspaceRepository,
    );
    historicalRepo = module.get<AppECorrelationTestRunRepository>(
      AppECorrelationTestRunRepository,
    );
    testSummaryService = module.get<TestSummaryWorkspaceService>(
      TestSummaryWorkspaceService,
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

  describe('createAppECorrelationTestRun', () => {
    it('Should create and return a new Appendix E Correlation Test Run record', async () => {
      const result = await service.createAppECorrelationTestRun(
        testSumId,
        appECorrTestSumId,
        payload,
        userId,
        false,
        null,
      );

      expect(result).toEqual(appECorrelationTestRunRecord);
      expect(testSummaryService.resetToNeedsEvaluation).toHaveBeenCalled();
    });
  });

  describe('updateAppECorrelationTestRun', () => {
    it('Should update a Appendix E Correlation Test Run record', async () => {
      const result = await service.updateAppECorrelationTestRun(
        testSumId,
        appECorrTestSumId,
        appECorrTestRunId,
        payload,
        userId,
      );
      expect(result).toEqual(appECorrelationTestRunRecord);
    });

    it('Should through error while updating a Appendix E Correlation Test Run record', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);

      let errored = false;
      try {
        await service.updateAppECorrelationTestRun(
          testSumId,
          appECorrTestSumId,
          appECorrTestRunId,
          payload,
          userId,
        );
      } catch (e) {
        errored = true;
      }
      expect(errored).toEqual(true);
    });
  });

  describe('deleteAppECorrelationTestRun', () => {
    it('Should delete a Appendix E Correlation Test Run record', async () => {
      const result = await service.deleteAppECorrelationTestRun(
        testSumId,
        appECorrTestSumId,
        appECorrTestRunId,
        userId,
      );
      expect(result).toEqual(undefined);
    });

    it('Should through error while deleting a Appendix E Correlation Test Run record', async () => {
      const error = new InternalServerErrorException(
        `Error deleting Appendix E Correlation Test Run record Id [${appECorrTestRunId}]`,
      );
      jest.spyOn(repository, 'delete').mockRejectedValue(error);

      let errored = false;
      try {
        await service.deleteAppECorrelationTestRun(
          testSumId,
          appECorrTestSumId,
          appECorrTestRunId,
          userId,
        );
      } catch (e) {
        errored = true;
      }
      expect(errored).toEqual(true);
    });
  });

  describe('import', () => {
    const importDTO = new AppECorrelationTestRunImportDTO();
    const recordDTO = new AppECorrelationTestRunRecordDTO();

    it('Should Import Appendix E Corrleation Test Run', async () => {
      jest
        .spyOn(service, 'createAppECorrelationTestRun')
        .mockResolvedValue(recordDTO);

      await service.import(
        locationId,
        testSumId,
        appECorrTestSumId,
        importDTO,
        userId,
        false,
      );
    });

    it('Should Import Appendix E Corrleation Test Run from Historical Record', async () => {
      importDTO.appEHeatInputFromGasData = [
        new AppEHeatInputFromGasImportDTO(),
      ];
      importDTO.appEHeatInputFromOilData = [
        new AppEHeatInputFromOilImportDTO(),
      ];

      jest
        .spyOn(service, 'createAppECorrelationTestRun')
        .mockResolvedValue(recordDTO);

      await service.import(
        locationId,
        testSumId,
        appECorrTestSumId,
        importDTO,
        userId,
        false,
      );
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
          .spyOn(
            service,
            'getAppECorrelationTestRunsByAppECorrelationTestSumId',
          )
          .mockResolvedValue([appECorrelationTestRunRecord]);
        const result = await service.export([testSumId]);
        expect(result).toEqual([appECorrelationTestRunRecord]);
      });
    });
  });
});
