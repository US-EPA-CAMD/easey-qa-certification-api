import { Test, TestingModule } from '@nestjs/testing';
import { AppEHeatInputFromOilDTO } from '../dto/app-e-heat-input-from-oil.dto';
import { AppEHeatInputFromOil } from '../entities/workspace/app-e-heat-input-from-oil.entity';
import { AppEHeatInputFromOilMap } from '../maps/app-e-heat-input-from-oil.map';
import { Logger } from '@us-epa-camd/easey-common/logger';
import { AppEHeatInputFromOilService } from './app-e-heat-input-from-oil.service';
import { AppEHeatInputFromOilRepository } from './app-e-heat-input-from-oil.repository';
import { TestSummaryService } from '../test-summary/test-summary.service';

const aeHiOilId = 'a1b2c3';
const appECorrTestRunId = 'd4e6f7';
const mockAeHiFromOil = new AppEHeatInputFromOil();
const mockAeHiFromOilDTO = new AppEHeatInputFromOilDTO();

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

describe('AppEHeatInputOilWorkspaceService', () => {
  let service: AppEHeatInputFromOilService;
  let repository: AppEHeatInputFromOilRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Logger,
        AppEHeatInputFromOilService,
        {
          provide: TestSummaryService,
          useFactory: mockTestSumService,
        },
        {
          provide: AppEHeatInputFromOilRepository,
          useFactory: mockRepository,
        },
        {
          provide: AppEHeatInputFromOilMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get<AppEHeatInputFromOilService>(
      AppEHeatInputFromOilService,
    );
    repository = module.get<AppEHeatInputFromOilRepository>(
      AppEHeatInputFromOilRepository,
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
