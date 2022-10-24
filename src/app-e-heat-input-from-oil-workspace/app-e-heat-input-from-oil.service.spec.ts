import { Test, TestingModule } from '@nestjs/testing';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import {
  AppEHeatInputFromOilDTO,
  AppEHeatInputFromOilImportDTO,
  AppEHeatInputFromOilRecordDTO,
} from '../dto/app-e-heat-input-from-oil.dto';
import { AppEHeatInputFromOil } from '../entities/workspace/app-e-heat-input-from-oil.entity';
import { AppEHeatInputFromOilMap } from '../maps/app-e-heat-input-from-oil.map';
import { AppEHeatInputFromOilWorkspaceRepository } from './app-e-heat-input-from-oil.repository';
import { AppEHeatInputFromOilWorkspaceService } from './app-e-heat-input-from-oil.service';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { AppEHeatInputFromGasRecordDTO } from '../dto/app-e-heat-input-from-gas.dto';
import { AppEHeatInputFromOilRepository } from '../app-e-heat-input-from-oil/app-e-heat-input-from-oil.repository';

const aeHiOilId = 'a1b2c3';
const appECorrTestRunId = 'd4e6f7';
const testSumId = '1';
const userId = 'testuser';
const mockAeHiFromOil = new AppEHeatInputFromOil();
const mockAeHiFromOilDTO = new AppEHeatInputFromOilDTO();

const payload = new AppEHeatInputFromOilDTO();

const mockTestSumService = () => ({
  resetToNeedsEvaluation: jest.fn(),
});

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue([mockAeHiFromOil]),
  create: jest.fn().mockResolvedValue(mockAeHiFromOil),
  save: jest.fn().mockResolvedValue(mockAeHiFromOil),
  findOne: jest.fn().mockResolvedValue(mockAeHiFromOil),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(mockAeHiFromOilDTO),
  many: jest.fn().mockResolvedValue([mockAeHiFromOilDTO]),
});

const mockHistoricalRepo = () => ({
  findOne: jest.fn().mockResolvedValue(new AppEHeatInputFromGasRecordDTO()),
});

describe('AppEHeatInputOilWorkspaceService', () => {
  let service: AppEHeatInputFromOilWorkspaceService;
  let repository: AppEHeatInputFromOilWorkspaceRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Logger,
        AppEHeatInputFromOilWorkspaceService,
        {
          provide: TestSummaryWorkspaceService,
          useFactory: mockTestSumService,
        },
        {
          provide: AppEHeatInputFromOilWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: AppEHeatInputFromOilMap,
          useFactory: mockMap,
        },
        {
          provide: AppEHeatInputFromOilRepository,
          useFactory: mockHistoricalRepo,
        },
      ],
    }).compile();

    service = module.get<AppEHeatInputFromOilWorkspaceService>(
      AppEHeatInputFromOilWorkspaceService,
    );
    repository = module.get<AppEHeatInputFromOilWorkspaceRepository>(
      AppEHeatInputFromOilWorkspaceRepository,
    );
  });

  describe('getAppEHeatInputFromOilRecords', () => {
    it('calls the repository.find() to get Appendix E Heat Input from Oil records by Appendix E Correlation Test Run Id', async () => {
      const result = await service.getAppEHeatInputFromOilRecords(
        appECorrTestRunId,
      );
      expect(result).toEqual([mockAeHiFromOilDTO]);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('getAppEHeatInputFromOilRecord', () => {
    it('Calls repository.findOne({id}) to get a Appendix E Heat Input from Oil record', async () => {
      const result = await service.getAppEHeatInputFromOilRecord(aeHiOilId);
      expect(result).toEqual(mockAeHiFromOilDTO);
      expect(repository.findOne).toHaveBeenCalled();
    });

    it('Should throw error when record not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      let errored = false;

      try {
        await service.getAppEHeatInputFromOilRecord(aeHiOilId);
      } catch (err) {
        errored = true;
      }

      expect(errored).toBe(true);
    });
  });

  describe('createAppEHeatInputFromOilRecord', () => {
    it('calls the repository.create() and insert an Appendix E Heat Input from Oil record', async () => {
      const result = await service.createAppEHeatInputFromOilRecord(
        testSumId,
        appECorrTestRunId,
        payload,
        userId,
      );
      expect(result).toEqual(mockAeHiFromOilDTO);
      expect(repository.create).toHaveBeenCalled();
    });
  });

  describe('updateAppEHeatInputFromOilRecord', () => {
    it('Copies input values onto an existing Appendix E Heat Input from Oil record and saves it', async () => {
      const result = await service.updateAppEHeatInputFromOilRecord(
        testSumId,
        appECorrTestRunId,
        payload,
        userId,
      );
      expect(result).toEqual(mockAeHiFromOilDTO);
      expect(repository.save).toHaveBeenCalled();
    });
  });

  describe('import', () => {
    const importDTO = new AppEHeatInputFromOilImportDTO();
    const recordDTO = new AppEHeatInputFromOilRecordDTO();

    it('Should import Appendix E Heat Input from Oil', async () => {
      jest
        .spyOn(service, 'createAppEHeatInputFromOilRecord')
        .mockResolvedValue(recordDTO);

      const result = await service.import(
        testSumId,
        appECorrTestRunId,
        importDTO,
        userId,
        false,
      );

      expect(result).toBeUndefined();
    });

    it('Should import Appendix E Heat Input from Oil with historical data', async () => {
      jest
        .spyOn(service, 'createAppEHeatInputFromOilRecord')
        .mockResolvedValue(recordDTO);

      const result = await service.import(
        testSumId,
        appECorrTestRunId,
        importDTO,
        userId,
        true,
      );

      expect(result).toBeUndefined();
    });
  });

  describe('getAppEHeatInputFromGasByTestRunIds', () => {
    it('Should get Appendix E Heat Input From Oil records by test sum ids', async () => {
      const result = await service.getAppEHeatInputFromOilRecordsByTestRunIds([
        appECorrTestRunId,
      ]);
      expect(result).toEqual([mockAeHiFromOil]);
    });
  });

  describe('export', () => {
    it('Should export Appendix E Heat Input From Oil Record', async () => {
      jest
        .spyOn(service, 'getAppEHeatInputFromOilRecordsByTestRunIds')
        .mockResolvedValue([]);

      const result = await service.export([appECorrTestRunId]);
      expect(result).toEqual([]);
    });
  });
});
