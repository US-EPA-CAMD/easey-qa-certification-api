import { InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@us-epa-camd/easey-common/logger';

import {
  FuelFlowToLoadTestBaseDTO,
  FuelFlowToLoadTestDTO,
  FuelFlowToLoadTestImportDTO,
} from '../dto/fuel-flow-to-load-test.dto';
import { FuelFlowToLoadTest } from '../entities/fuel-flow-to-load-test.entity';
import { FuelFlowToLoadTestRepository } from '../fuel-flow-to-load-test/fuel-flow-to-load-test.repository';
import { FuelFlowToLoadTestMap } from '../maps/fuel-flow-to-load-test.map';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { FuelFlowToLoadTestWorkspaceRepository } from './fuel-flow-to-load-test-workspace.repository';
import { FuelFlowToLoadTestWorkspaceService } from './fuel-flow-to-load-test-workspace.service';

const id = '';
const testSumId = '';
const userId = 'user';
const entity = new FuelFlowToLoadTest();
const fuelFlowToLoadTestRecord = new FuelFlowToLoadTestDTO();
const fuelFlowToLoadTests = [fuelFlowToLoadTestRecord];

const payload = new FuelFlowToLoadTestBaseDTO();

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue([entity]),
  findOneBy: jest.fn().mockResolvedValue(entity),
  save: jest.fn().mockResolvedValue(entity),
  create: jest.fn().mockResolvedValue(entity),
  delete: jest.fn().mockResolvedValue(null),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(fuelFlowToLoadTestRecord),
  many: jest.fn().mockResolvedValue(fuelFlowToLoadTests),
});

const mockTestSumService = () => ({
  resetToNeedsEvaluation: jest.fn(),
});

const mockOfficialRepository = () => ({
  findOneBy: jest.fn(),
});

describe('FuelFlowToLoadTestWorkspaceService', () => {
  let service: FuelFlowToLoadTestWorkspaceService;
  let testSummaryService: TestSummaryWorkspaceService;
  let repository: FuelFlowToLoadTestWorkspaceRepository;
  let officialRepository: FuelFlowToLoadTestRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Logger,
        ConfigService,
        FuelFlowToLoadTestWorkspaceService,
        {
          provide: TestSummaryWorkspaceService,
          useFactory: mockTestSumService,
        },
        {
          provide: FuelFlowToLoadTestWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: FuelFlowToLoadTestMap,
          useFactory: mockMap,
        },
        {
          provide: FuelFlowToLoadTestRepository,
          useFactory: mockOfficialRepository,
        },
      ],
    }).compile();

    service = module.get<FuelFlowToLoadTestWorkspaceService>(
      FuelFlowToLoadTestWorkspaceService,
    );
    testSummaryService = module.get<TestSummaryWorkspaceService>(
      TestSummaryWorkspaceService,
    );
    repository = module.get<FuelFlowToLoadTestWorkspaceRepository>(
      FuelFlowToLoadTestWorkspaceRepository,
    );
    officialRepository = module.get<FuelFlowToLoadTestRepository>(
      FuelFlowToLoadTestRepository,
    );
  });

  describe('Import', () => {
    it('Should Import Fuel Flow To Load Test', async () => {
      jest
        .spyOn(service, 'createFuelFlowToLoadTest')
        .mockResolvedValue(fuelFlowToLoadTestRecord);

      await service.import(
        testSumId,
        new FuelFlowToLoadTestImportDTO(),
        userId,
        true,
      );
    });
  });

  describe('getFuelFlowToLoadTests', () => {
    it('Should return Fuel Flow To Load Test records by Test Summary id', async () => {
      const result = await service.getFuelFlowToLoadTests(testSumId);

      expect(result).toEqual([fuelFlowToLoadTestRecord]);
    });
  });

  describe('getFuelFlowToLoadBaseline', () => {
    it('Should return a Fuel Flow To Load Test record', async () => {
      const result = await service.getFuelFlowToLoadTest(id, testSumId);

      expect(result).toEqual(fuelFlowToLoadTestRecord);
    });

    it('Should throw error when a Fuel Flow To Load Test record not found', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(undefined);
      let errored = false;

      try {
        await service.getFuelFlowToLoadTest(id, testSumId);
      } catch (e) {
        errored = true;
      }

      expect(errored).toEqual(true);
    });
  });

  describe('createFuelFlowToLoadTest', () => {
    it('Should create and return a new Fuel Flow To Load Test record', async () => {
      const result = await service.createFuelFlowToLoadTest(
        testSumId,
        payload,
        userId,
      );

      expect(result).toEqual(fuelFlowToLoadTestRecord);
      expect(testSummaryService.resetToNeedsEvaluation).toHaveBeenCalled();
    });
  });

  describe('editFuelFlowToLoadTest', () => {
    it('Should update and return a new Fuel Flow To Load Test record', async () => {
      const result = await service.editFuelFlowToLoadTest(
        testSumId,
        id,
        payload,
        userId,
      );

      expect(result).toEqual(fuelFlowToLoadTestRecord);
      expect(testSummaryService.resetToNeedsEvaluation).toHaveBeenCalled();
    });

    it('Should throw error when a Fuel Flow To Load Test record not found', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(undefined);
      let errored = false;

      try {
        await service.editFuelFlowToLoadTest(testSumId, id, payload, userId);
      } catch (e) {
        errored = true;
      }

      expect(errored).toEqual(true);
    });
  });

  describe('deleteFuelFlowToLoadTest', () => {
    it('Should delete a Fuel Flow To Load Test record', async () => {
      const result = await service.deleteFuelFlowToLoadTest(
        testSumId,
        id,
        userId,
      );

      expect(result).toEqual(undefined);
      expect(testSummaryService.resetToNeedsEvaluation).toHaveBeenCalled();
    });

    it('Should throw error when database throws an error while deleting a Fuel Flow To Load Test record', async () => {
      jest
        .spyOn(repository, 'delete')
        .mockRejectedValue(new InternalServerErrorException('Unknown Error'));
      let errored = false;

      try {
        await service.deleteFuelFlowToLoadTest(testSumId, id, userId);
      } catch (e) {
        errored = true;
      }

      expect(errored).toEqual(true);
    });
  });
});
