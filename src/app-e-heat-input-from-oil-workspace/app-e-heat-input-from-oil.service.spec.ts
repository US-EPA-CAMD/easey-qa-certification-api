import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@us-epa-camd/easey-common/logger';

import { AppEHeatInputFromOilRepository } from '../app-e-heat-input-from-oil/app-e-heat-input-from-oil.repository';
import { AppEHeatInputFromGasRecordDTO } from '../dto/app-e-heat-input-from-gas.dto';
import {
  AppEHeatInputFromOilDTO,
  AppEHeatInputFromOilImportDTO,
  AppEHeatInputFromOilRecordDTO,
} from '../dto/app-e-heat-input-from-oil.dto';
import { AppEHeatInputFromOil } from '../entities/workspace/app-e-heat-input-from-oil.entity';
import { MonitorSystem } from '../entities/workspace/monitor-system.entity';
import { AppEHeatInputFromOilMap } from '../maps/app-e-heat-input-from-oil.map';
import { MonitorSystemWorkspaceRepository } from '../monitor-system-workspace/monitor-system-workspace.repository';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { AppEHeatInputFromOilWorkspaceRepository } from './app-e-heat-input-from-oil.repository';
import { AppEHeatInputFromOilWorkspaceService } from './app-e-heat-input-from-oil.service';

const locationId = '5';
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
  getAppEHeatInputFromOilsByTestRunId: jest
    .fn()
    .mockResolvedValue([mockAeHiFromOil]),
  getAppEHeatInputFromOilsByTestRunIds: jest
    .fn()
    .mockResolvedValue([mockAeHiFromOil]),
  create: jest.fn().mockResolvedValue(mockAeHiFromOil),
  save: jest.fn().mockResolvedValue(mockAeHiFromOil),
  getAppEHeatInputFromOilById: jest.fn().mockResolvedValue(mockAeHiFromOil),
});

const mockMonSysWorkspaceRepository = () => ({
  findOneBy: jest.fn().mockResolvedValue(new MonitorSystem()),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(mockAeHiFromOilDTO),
  many: jest.fn().mockResolvedValue([mockAeHiFromOilDTO]),
});

const mockHistoricalRepo = () => ({
  getAppEHeatInputFromOilByTestRunIdAndMonSysID: jest
    .fn()
    .mockResolvedValue(new AppEHeatInputFromGasRecordDTO()),
});

describe('AppEHeatInputOilWorkspaceService', () => {
  let service: AppEHeatInputFromOilWorkspaceService;
  let repository: AppEHeatInputFromOilWorkspaceRepository;
  let monSysWorkspaceRepository: MonitorSystemWorkspaceRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Logger,
        ConfigService,
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
          provide: MonitorSystemWorkspaceRepository,
          useFactory: mockMonSysWorkspaceRepository,
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
    monSysWorkspaceRepository = module.get<MonitorSystemWorkspaceRepository>(
      MonitorSystemWorkspaceRepository,
    );
  });

  describe('getAppEHeatInputFromOilRecords', () => {
    it('calls the repository.find() to get Appendix E Heat Input from Oil records by Appendix E Correlation Test Run Id', async () => {
      const result = await service.getAppEHeatInputFromOilRecords(
        appECorrTestRunId,
      );
      expect(result).toEqual([mockAeHiFromOilDTO]);
    });
  });

  describe('getAppEHeatInputFromOilRecord', () => {
    it('Calls repository.findOneBy({id}) to get a Appendix E Heat Input from Oil record', async () => {
      const result = await service.getAppEHeatInputFromOilRecord(aeHiOilId);
      expect(result).toEqual(mockAeHiFromOilDTO);
    });

    it('Should throw error when record not found', async () => {
      jest
        .spyOn(repository, 'getAppEHeatInputFromOilById')
        .mockResolvedValue(null);

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
        locationId,
        testSumId,
        appECorrTestRunId,
        payload,
        userId,
      );
      expect(result).toEqual(mockAeHiFromOilDTO);
      expect(repository.create).toHaveBeenCalled();
    });

    it('Should throw error with invalid monSysID', async () => {
      jest
        .spyOn(monSysWorkspaceRepository, 'findOneBy')
        .mockResolvedValue(null);

      let errored = false;

      try {
        await service.createAppEHeatInputFromOilRecord(
          locationId,
          testSumId,
          appECorrTestRunId,
          payload,
          userId,
        );
      } catch (err) {
        errored = true;
      }

      expect(errored).toBe(true);
    });
  });

  describe('updateAppEHeatInputFromOilRecord', () => {
    it('Copies input values onto an existing Appendix E Heat Input from Oil record and saves it', async () => {
      const result = await service.updateAppEHeatInputFromOilRecord(
        locationId,
        testSumId,
        appECorrTestRunId,
        payload,
        userId,
      );
      expect(result).toEqual(mockAeHiFromOilDTO);
      expect(repository.save).toHaveBeenCalled();
    });

    it('Should throw error when record not found', async () => {
      jest
        .spyOn(repository, 'getAppEHeatInputFromOilById')
        .mockResolvedValue(null);

      let errored = false;

      try {
        await service.updateAppEHeatInputFromOilRecord(
          locationId,
          testSumId,
          appECorrTestRunId,
          payload,
          userId,
        );
      } catch (err) {
        errored = true;
      }

      expect(errored).toBe(true);
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
        locationId,
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
        locationId,
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
      expect(result).toEqual([mockAeHiFromOilDTO]);
    });
  });

  describe('export', () => {
    it('Should export Appendix E Heat Input From Oil Record', async () => {
      jest
        .spyOn(service, 'getAppEHeatInputFromOilRecordsByTestRunIds')
        .mockResolvedValue([mockAeHiFromOilDTO]);

      const result = await service.export([appECorrTestRunId]);
      expect(result).toEqual([mockAeHiFromOilDTO]);
    });
  });
});
