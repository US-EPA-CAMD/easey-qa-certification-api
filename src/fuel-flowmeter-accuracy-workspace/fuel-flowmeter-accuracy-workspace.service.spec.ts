import { InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { Logger, LoggerModule } from '@us-epa-camd/easey-common/logger';
import {
  FuelFlowmeterAccuracyBaseDTO,
  FuelFlowmeterAccuracyDTO,
  FuelFlowmeterAccuracyImportDTO,
} from '../dto/fuel-flowmeter-accuracy.dto';
import { FuelFlowmeterAccuracyWorkspaceRepository } from './fuel-flowmeter-accuracy-workspace.repository';
import { FuelFlowmeterAccuracyWorkspaceService } from './fuel-flowmeter-accuracy-workspace.service';
import { FuelFlowmeterAccuracyRepository } from '../fuel-flowmeter-accuracy/fuel-flowmeter-accuracy.repository';
import { FuelFlowmeterAccuracyMap } from '../maps/fuel-flowmeter-accuracy.map';
import { FuelFlowmeterAccuracy } from '../entities/fuel-flowmeter-accuracy.entity';
import { ConfigService } from '@nestjs/config';

const testSumId = '';
const userId = 'user';
const fuelFlowmeterAccuracyId = '';
const entity = new FuelFlowmeterAccuracy();
const fuelFlowmeterAccuracy = new FuelFlowmeterAccuracyDTO();
const payload = new FuelFlowmeterAccuracyBaseDTO();

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue([entity]),
  findOne: jest.fn().mockResolvedValue(entity),
  save: jest.fn().mockResolvedValue(entity),
  create: jest.fn().mockResolvedValue(entity),
  delete: jest.fn().mockResolvedValue(null),
});

const mockOfficialRepository = () => ({
  findOne: jest.fn().mockResolvedValue(new FuelFlowmeterAccuracy()),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(fuelFlowmeterAccuracy),
  many: jest.fn().mockResolvedValue([fuelFlowmeterAccuracy]),
});

const mockTestSumService = () => ({
  resetToNeedsEvaluation: jest.fn(),
});

describe('FuelFlowmeterWorkspaceService', () => {
  let service: FuelFlowmeterAccuracyWorkspaceService;
  let testSummaryService: TestSummaryWorkspaceService;
  let repository: FuelFlowmeterAccuracyWorkspaceRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        Logger,
        ConfigService,
        FuelFlowmeterAccuracyWorkspaceService,
        {
          provide: TestSummaryWorkspaceService,
          useFactory: mockTestSumService,
        },
        {
          provide: FuelFlowmeterAccuracyWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: FuelFlowmeterAccuracyRepository,
          useFactory: mockOfficialRepository,
        },
        {
          provide: FuelFlowmeterAccuracyMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get<FuelFlowmeterAccuracyWorkspaceService>(
      FuelFlowmeterAccuracyWorkspaceService,
    );
    testSummaryService = module.get<TestSummaryWorkspaceService>(
      TestSummaryWorkspaceService,
    );
    repository = module.get<FuelFlowmeterAccuracyWorkspaceRepository>(
      FuelFlowmeterAccuracyWorkspaceRepository,
    );
  });

  describe('getFuelFlowmeterAccuracy', () => {
    it('Calls repository.findOne({id}) to get a single Fuel Flowmeter Accuracy record', async () => {
      const result = await service.getFuelFlowmeterAccuracy(
        fuelFlowmeterAccuracyId,
      );
      expect(result).toEqual(fuelFlowmeterAccuracy);
      expect(repository.findOne).toHaveBeenCalled();
    });

    it('Should throw error when a Fuel Flowmeter Accuracy record not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      let errored = false;

      try {
        await service.getFuelFlowmeterAccuracy(fuelFlowmeterAccuracyId);
      } catch (err) {
        errored = true;
      }

      expect(errored).toBe(true);
    });
  });

  describe('getFuelFlowmeterAccuracies', () => {
    it('Calls Repository to find all Fuel Flowmeter Accuracy records for a given Test Summary ID', async () => {
      const results = await service.getFuelFlowmeterAccuracies(
        fuelFlowmeterAccuracyId,
      );
      expect(results).toEqual([fuelFlowmeterAccuracy]);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('createFlowToLoadCheck', () => {
    it('Calls the service to create a Fuel Flowmeter Accuracy record', async () => {
      const result = await service.createFuelFlowmeterAccuracy(
        testSumId,
        payload,
        userId,
      );
      expect(result).toEqual(fuelFlowmeterAccuracy);
      expect(testSummaryService.resetToNeedsEvaluation).toHaveBeenCalled();
    });

    it('Should create and return a new Fuel Flowmeter Accuracy record with Historical Record Id', async () => {
      const result = await service.createFuelFlowmeterAccuracy(
        testSumId,
        payload,
        userId,
        false,
        'historicalId',
      );

      expect(result).toEqual(fuelFlowmeterAccuracy);
    });
  });

  describe('editFuelFlowmeterAccuracy', () => {
    it('should update an Fuel Flowmeter Accuracy record', async () => {
      const result = await service.editFuelFlowmeterAccuracy(
        testSumId,
        fuelFlowmeterAccuracyId,
        payload,
        userId,
      );
      expect(result).toEqual(fuelFlowmeterAccuracy);
    });

    it('should throw error with invalid Fuel Flowmeter Accuracy', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);

      let errored = false;
      try {
        await service.editFuelFlowmeterAccuracy(
          testSumId,
          fuelFlowmeterAccuracyId,
          payload,
          userId,
        );
      } catch (e) {
        errored = true;
      }
      expect(errored).toEqual(true);
    });
  });

  describe('deleteFuelFlowmeterAccuracy', () => {
    it('Should delete a Fuel Flowmeter Accuracy record', async () => {
      const result = await service.deleteFuelFlowmeterAccuracy(
        testSumId,
        fuelFlowmeterAccuracyId,
        userId,
      );

      expect(result).toEqual(undefined);
    });

    it('Should throw error when database throws an error while deleting a Fuel Flowmeter Accuracy record', async () => {
      jest
        .spyOn(repository, 'delete')
        .mockRejectedValue(new InternalServerErrorException('Unknown Error'));
      let errored = false;

      try {
        await service.deleteFuelFlowmeterAccuracy(
          testSumId,
          fuelFlowmeterAccuracyId,
          userId,
        );
      } catch (e) {
        errored = true;
      }

      expect(errored).toEqual(true);
    });
  });

  describe('getFuelFlowmeterAccuraciesByTestSumIds', () => {
    it('Should get Fuel Flowmeter Accuracy records by test sum ids', async () => {
      const result = await service.getFuelFlowmeterAccuraciesByTestSumIds([
        testSumId,
      ]);
      expect(result).toEqual([fuelFlowmeterAccuracy]);
    });
  });

  describe('Export', () => {
    it('Should Export Fuel Flowmeter Accuracy Record', async () => {
      jest
        .spyOn(service, 'getFuelFlowmeterAccuraciesByTestSumIds')
        .mockResolvedValue([]);
      const result = await service.export([testSumId]);
      expect(result).toEqual([]);
    });
  });

  describe('Import', () => {
    it('Should Import Fuel Flowmeter Accuracy', async () => {
      jest
        .spyOn(service, 'createFuelFlowmeterAccuracy')
        .mockResolvedValue(fuelFlowmeterAccuracy);

      await service.import(
        testSumId,
        new FuelFlowmeterAccuracyImportDTO(),
        userId,
        false,
      );
    });
    it('Should Import Fuel Flowmeter Accuracy from Historical Record', async () => {
      jest
        .spyOn(service, 'createFuelFlowmeterAccuracy')
        .mockResolvedValue(fuelFlowmeterAccuracy);

      await service.import(testSumId, payload, userId, true);
    });
  });
});
