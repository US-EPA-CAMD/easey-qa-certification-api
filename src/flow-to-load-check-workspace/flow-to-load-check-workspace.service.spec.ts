import { Test, TestingModule } from '@nestjs/testing';
import { FlowToLoadCheck } from '../entities/flow-to-load-check.entity';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import {
  FlowToLoadCheckBaseDTO,
  FlowToLoadCheckDTO,
  FlowToLoadCheckImportDTO,
} from '../dto/flow-to-load-check.dto';
import { FlowToLoadCheckWorkspaceRepository } from './flow-to-load-check-workspace.repository';
import { FlowToLoadCheckWorkspaceService } from './flow-to-load-check-workspace.service';
import { FlowToLoadCheckMap } from '../maps/flow-to-load-check.map';
import { InternalServerErrorException } from '@nestjs/common';
import { FlowToLoadCheckRepository } from '../flow-to-load-check/flow-to-load-check.repository';
import { Logger } from '@us-epa-camd/easey-common/logger';

const testSumId = '';
const userId = 'user';
const flowToLoadCheckId = '';
const entity = new FlowToLoadCheck();
const flowToLoadCheck = new FlowToLoadCheckDTO();

const payload = new FlowToLoadCheckBaseDTO();

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue([entity]),
  findOne: jest.fn().mockResolvedValue(entity),
  save: jest.fn().mockResolvedValue(entity),
  create: jest.fn().mockResolvedValue(entity),
  delete: jest.fn().mockResolvedValue(null),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(flowToLoadCheck),
  many: jest.fn().mockResolvedValue([flowToLoadCheck]),
});

const mockTestSumService = () => ({
  resetToNeedsEvaluation: jest.fn(),
});

const mockOfficialRepository = () => ({
  findOne: jest.fn(),
});

describe('FlowToLoadCheckWorkspaceService', () => {
  let service: FlowToLoadCheckWorkspaceService;
  let testSummaryService: TestSummaryWorkspaceService;
  let repository: FlowToLoadCheckWorkspaceRepository;
  let officialRepository: FlowToLoadCheckRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Logger,
        FlowToLoadCheckWorkspaceService,
        {
          provide: TestSummaryWorkspaceService,
          useFactory: mockTestSumService,
        },
        {
          provide: FlowToLoadCheckWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: FlowToLoadCheckRepository,
          useFactory: mockOfficialRepository,
        },
        {
          provide: FlowToLoadCheckMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get<FlowToLoadCheckWorkspaceService>(
      FlowToLoadCheckWorkspaceService,
    );
    testSummaryService = module.get<TestSummaryWorkspaceService>(
      TestSummaryWorkspaceService,
    );
    repository = module.get<FlowToLoadCheckWorkspaceRepository>(
      FlowToLoadCheckWorkspaceRepository,
    );
    officialRepository = module.get<FlowToLoadCheckRepository>(
      FlowToLoadCheckRepository,
    );
  });

  describe('getFlowToLoadCheck', () => {
    it('Calls repository.findOne({id}) to get a single Flow To Load Check record', async () => {
      const result = await service.getFlowToLoadCheck(flowToLoadCheckId);
      expect(result).toEqual(flowToLoadCheck);
      expect(repository.findOne).toHaveBeenCalled();
    });

    it('Should throw error when a Flow To Load Check record not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      let errored = false;

      try {
        await service.getFlowToLoadCheck(flowToLoadCheckId);
      } catch (err) {
        errored = true;
      }

      expect(errored).toBe(true);
    });
  });

  describe('getFlowToLoadChecks', () => {
    it('Calls Repository to find all Flow To Load Check records for a given Test Summary ID', async () => {
      const results = await service.getFlowToLoadChecks(flowToLoadCheckId);
      expect(results).toEqual([flowToLoadCheck]);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('createFlowToLoadCheck', () => {
    it('Calls the service to create a Flow To Load Check record', async () => {
      const result = await service.createFlowToLoadCheck(
        testSumId,
        payload,
        userId,
      );
      expect(result).toEqual(flowToLoadCheck);
      expect(testSummaryService.resetToNeedsEvaluation).toHaveBeenCalled();
    });
  });

  describe('editFlowToLoadCheck', () => {
    it('should update an Flow To Load Check record', async () => {
      const result = await service.editFlowToLoadCheck(
        testSumId,
        flowToLoadCheckId,
        payload,
        userId,
      );
      expect(result).toEqual(flowToLoadCheck);
    });

    it('should throw error with invalid Flow To Load Check', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);

      let errored = false;
      try {
        await service.editFlowToLoadCheck(
          testSumId,
          flowToLoadCheckId,
          payload,
          userId,
        );
      } catch (e) {
        errored = true;
      }
      expect(errored).toEqual(true);
    });
  });

  describe('deleteFlowToLoadCheck', () => {
    it('Should delete a Flow To Load Check record', async () => {
      const result = await service.deleteFlowToLoadCheck(
        testSumId,
        flowToLoadCheckId,
        userId,
      );

      expect(result).toEqual(undefined);
      expect(testSummaryService.resetToNeedsEvaluation).toHaveBeenCalled();
    });

    it('Should throw error when database throws an error while deleting a Flow To Load Check record', async () => {
      jest
        .spyOn(repository, 'delete')
        .mockRejectedValue(new InternalServerErrorException('Unknown Error'));
      let errored = false;

      try {
        await service.deleteFlowToLoadCheck(
          testSumId,
          flowToLoadCheckId,
          userId,
        );
      } catch (e) {
        errored = true;
      }

      expect(errored).toEqual(true);
    });
  });

  describe('Export', () => {
    it('Should Export Flow To Load Check', async () => {
      jest
        .spyOn(service, 'getFlowToLoadChecksByTestSumIds')
        .mockResolvedValue([flowToLoadCheck]);
      const result = await service.export([testSumId]);
      expect(result).toEqual([flowToLoadCheck]);

describe('Import', () => {
    it('Should Import Flow To Load Check', async () => {
      jest
        .spyOn(service, 'createFlowToLoadCheck')
        .mockResolvedValue(flowToLoadCheck);

      await service.import(
        testSumId,
        new FlowToLoadCheckImportDTO(),
        userId,
        true,
      );
    });
  });
});
