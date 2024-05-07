import { InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@us-epa-camd/easey-common/logger';

import {
  FuelFlowToLoadBaselineBaseDTO,
  FuelFlowToLoadBaselineDTO,
  FuelFlowToLoadBaselineImportDTO,
} from '../dto/fuel-flow-to-load-baseline.dto';
import { FuelFlowToLoadBaseline } from '../entities/workspace/fuel-flow-to-load-baseline.entity';
import { FuelFlowToLoadBaselineRepository } from '../fuel-flow-to-load-baseline/fuel-flow-to-load-baseline.repository';
import { FuelFlowToLoadBaselineMap } from '../maps/fuel-flow-to-load-baseline.map';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { FuelFlowToLoadBaselineWorkspaceRepository } from './fuel-flow-to-load-baseline-workspace.repository';
import { FuelFlowToLoadBaselineWorkspaceService } from './fuel-flow-to-load-baseline-workspace.service';

const id = '';
const testSumId = '';
const userId = 'user';
const entity = new FuelFlowToLoadBaseline();
const dto = new FuelFlowToLoadBaselineDTO();

const payload = new FuelFlowToLoadBaselineBaseDTO();

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue([entity]),
  findOneBy: jest.fn().mockResolvedValue(entity),
  save: jest.fn().mockResolvedValue(entity),
  create: jest.fn().mockResolvedValue(entity),
  delete: jest.fn().mockResolvedValue(null),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(dto),
  many: jest.fn().mockResolvedValue([dto]),
});

const mockTestSumService = () => ({
  resetToNeedsEvaluation: jest.fn(),
});

const mockOfficialRepository = () => ({
  findOneBy: jest.fn(),
});

describe('FuelFlowToLoadBaselineWorkspaceService', () => {
  let service: FuelFlowToLoadBaselineWorkspaceService;
  let testSummaryService: TestSummaryWorkspaceService;
  let repository: FuelFlowToLoadBaselineWorkspaceRepository;
  let officialRepository: FuelFlowToLoadBaselineRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Logger,
        ConfigService,
        FuelFlowToLoadBaselineWorkspaceService,
        {
          provide: TestSummaryWorkspaceService,
          useFactory: mockTestSumService,
        },
        {
          provide: FuelFlowToLoadBaselineWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: FuelFlowToLoadBaselineRepository,
          useFactory: mockOfficialRepository,
        },
        {
          provide: FuelFlowToLoadBaselineMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get<FuelFlowToLoadBaselineWorkspaceService>(
      FuelFlowToLoadBaselineWorkspaceService,
    );
    testSummaryService = module.get<TestSummaryWorkspaceService>(
      TestSummaryWorkspaceService,
    );
    repository = module.get<FuelFlowToLoadBaselineWorkspaceRepository>(
      FuelFlowToLoadBaselineWorkspaceRepository,
    );
    officialRepository = module.get<FuelFlowToLoadBaselineRepository>(
      FuelFlowToLoadBaselineRepository,
    );
  });

  describe('getFuelFlowToLoadBaselines', () => {
    it('Should return Fuel Flow To Load Baseline records by Test Summary id', async () => {
      const result = await service.getFuelFlowToLoadBaselines(testSumId);

      expect(result).toEqual([dto]);
    });
  });

  describe('getFuelFlowToLoadBaseline', () => {
    it('Should return a Fuel Flow To Load Baseline record', async () => {
      const result = await service.getFuelFlowToLoadBaseline(id, testSumId);

      expect(result).toEqual(dto);
    });

    it('Should throw error when a Fuel Flow To Load Baseline record not found', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(undefined);
      let errored = false;

      try {
        await service.getFuelFlowToLoadBaseline(id, testSumId);
      } catch (e) {
        errored = true;
      }

      expect(errored).toEqual(true);
    });
  });

  describe('createFuelFlowToLoadBaseline', () => {
    it('Should create and return a new Fuel Flow To Load Baseline record', async () => {
      const result = await service.createFuelFlowToLoadBaseline(
        testSumId,
        payload,
        userId,
      );

      expect(result).toEqual(dto);
      expect(testSummaryService.resetToNeedsEvaluation).toHaveBeenCalled();
    });
  });

  describe('updateFuelFlowToLoadBaseline', () => {
    it('Should update and return the Fuel Flow To Load Baseline record', async () => {
      const result = await service.updateFuelFlowToLoadBaseline(
        testSumId,
        id,
        payload,
        userId,
      );

      expect(result).toEqual(dto);
      expect(testSummaryService.resetToNeedsEvaluation).toHaveBeenCalled();
    });

    it('Should throw error when a Fuel Flow To Load Baseline record not found', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(undefined);
      let errored = false;

      try {
        await service.updateFuelFlowToLoadBaseline(
          testSumId,
          id,
          payload,
          userId,
        );
      } catch (e) {
        errored = true;
      }

      expect(errored).toEqual(true);
    });
  });

  describe('deleteFuelFlowToLoadBaseline', () => {
    it('Should delete a Fuel Flow To Load Baseline record', async () => {
      const result = await service.deleteFuelFlowToLoadBaseline(
        testSumId,
        id,
        userId,
      );

      expect(result).toEqual(undefined);
      expect(testSummaryService.resetToNeedsEvaluation).toHaveBeenCalled();
    });

    it('Should throw error when database throws an error while deleting a Fuel Flow To Load Baseline record', async () => {
      jest
        .spyOn(repository, 'delete')
        .mockRejectedValue(new InternalServerErrorException('Unknown Error'));
      let errored = false;

      try {
        await service.deleteFuelFlowToLoadBaseline(testSumId, id, userId);
      } catch (e) {
        errored = true;
      }

      expect(errored).toEqual(true);
    });
  });

  describe('Import', () => {
    it('Should Import Fuel Flow To Load Baseline', async () => {
      jest
        .spyOn(service, 'createFuelFlowToLoadBaseline')
        .mockResolvedValue(dto);

      await service.import(
        testSumId,
        new FuelFlowToLoadBaselineImportDTO(),
        userId,
        true,
      );
    });
  });
});
