import { InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import {
  FlowToLoadReferenceBaseDTO,
  FlowToLoadReferenceDTO,
} from '../dto/flow-to-load-reference.dto';
import { FlowToLoadReference as FlowToLoadReferenceOfficial } from '../entities/flow-to-load-reference.entity';
import { FlowToLoadReference } from '../entities/workspace/flow-to-load-reference.entity';
import { FlowToLoadReferenceRepository } from '../flow-to-load-reference/flow-to-load-reference.repository';
import { FlowToLoadReferenceMap } from '../maps/flow-to-load-reference.map';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { FlowToLoadReferenceWorkspaceRepository } from './flow-to-load-reference-workspace.repository';
import { FlowToLoadReferenceWorkspaceService } from './flow-to-load-reference-workspace.service';

const testSumId = '';
const userId = 'user';
const flowToLoadReferenceId = '';
const entity = new FlowToLoadReference();
const flowToLoadReference = new FlowToLoadReferenceDTO();
const payload = new FlowToLoadReferenceBaseDTO();

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue([entity]),
  findOneBy: jest.fn().mockResolvedValue(entity),
  save: jest.fn().mockResolvedValue(entity),
  create: jest.fn().mockResolvedValue(entity),
  delete: jest.fn().mockResolvedValue(null),
});

const mockOfficialRepository = () => ({
  findOneBy: jest.fn().mockResolvedValue(new FlowToLoadReferenceOfficial()),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(flowToLoadReference),
  many: jest.fn().mockResolvedValue([flowToLoadReference]),
});

const mockTestSumService = () => ({
  resetToNeedsEvaluation: jest.fn(),
});

describe('FlowToLoadReferenceWorkspaceService', () => {
  let service: FlowToLoadReferenceWorkspaceService;
  let testSummaryService: TestSummaryWorkspaceService;
  let repository: FlowToLoadReferenceWorkspaceRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        FlowToLoadReferenceWorkspaceService,
        {
          provide: TestSummaryWorkspaceService,
          useFactory: mockTestSumService,
        },
        {
          provide: FlowToLoadReferenceWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: FlowToLoadReferenceRepository,
          useFactory: mockOfficialRepository,
        },
        {
          provide: FlowToLoadReferenceMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get<FlowToLoadReferenceWorkspaceService>(
      FlowToLoadReferenceWorkspaceService,
    );
    testSummaryService = module.get<TestSummaryWorkspaceService>(
      TestSummaryWorkspaceService,
    );
    repository = module.get<FlowToLoadReferenceWorkspaceRepository>(
      FlowToLoadReferenceWorkspaceRepository,
    );
  });

  describe('getFlowToLoadReference', () => {
    it('Calls repository.findOneBy({id}) to get a single Flow To Load Check record', async () => {
      const result = await service.getFlowToLoadReference(
        flowToLoadReferenceId,
      );
      expect(result).toEqual(flowToLoadReference);
      expect(repository.findOneBy).toHaveBeenCalled();
    });

    it('Should throw error when a Flow To Load Check record not found', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

      let errored = false;

      try {
        await service.getFlowToLoadReference(flowToLoadReferenceId);
      } catch (err) {
        errored = true;
      }

      expect(errored).toBe(true);
    });
  });

  describe('getFlowToLoadChecks', () => {
    it('Calls Repository to find all Flow To Load Reference records for a given Test Summary ID', async () => {
      const results = await service.getFlowToLoadReferences(
        flowToLoadReferenceId,
      );
      expect(results).toEqual([flowToLoadReference]);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('createFlowToLoadCheck', () => {
    it('Calls the service to create a Flow To Load Reference record', async () => {
      const result = await service.createFlowToLoadReference(
        testSumId,
        payload,
        userId,
      );
      expect(result).toEqual(flowToLoadReference);
      expect(testSummaryService.resetToNeedsEvaluation).toHaveBeenCalled();
    });
  });

  describe('editFlowToLoadReference', () => {
    it('should update an Flow To Load Reference record', async () => {
      const result = await service.editFlowToLoadReference(
        testSumId,
        flowToLoadReferenceId,
        payload,
        userId,
      );
      expect(result).toEqual(flowToLoadReference);
    });

    it('should throw error with invalid Flow To Load Reference', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(undefined);

      let errored = false;
      try {
        await service.editFlowToLoadReference(
          testSumId,
          flowToLoadReferenceId,
          payload,
          userId,
        );
      } catch (e) {
        errored = true;
      }
      expect(errored).toEqual(true);
    });
  });

  describe('deleteFlowToLoadReference', () => {
    it('Should delete a Flow To Load Reference record', async () => {
      const result = await service.deleteFlowToLoadReference(
        testSumId,
        flowToLoadReferenceId,
        userId,
      );

      expect(result).toEqual(undefined);
      expect(testSummaryService.resetToNeedsEvaluation).toHaveBeenCalled();
    });

    it('Should throw error when database throws an error while deleting a Flow To Load Reference record', async () => {
      jest
        .spyOn(repository, 'delete')
        .mockRejectedValue(new InternalServerErrorException('Unknown Error'));
      let errored = false;

      try {
        await service.deleteFlowToLoadReference(
          testSumId,
          flowToLoadReferenceId,
          userId,
        );
      } catch (e) {
        errored = true;
      }

      expect(errored).toEqual(true);
    });
  });
});
