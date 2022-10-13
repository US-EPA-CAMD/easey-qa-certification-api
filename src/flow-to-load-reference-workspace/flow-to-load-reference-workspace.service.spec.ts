import { Test, TestingModule } from '@nestjs/testing';
import { FlowToLoadReferenceMap } from '../maps/flow-to-load-reference.map';
import {
  FlowToLoadReferenceBaseDTO,
  FlowToLoadReferenceDTO,
} from '../dto/flow-to-load-reference.dto';
import { FlowToLoadReference } from '../entities/flow-to-load-reference.entity';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { FlowToLoadReferenceWorkspaceRepository } from './flow-to-load-reference-workspace.repository';
import { FlowToLoadReferenceWorkspaceService } from './flow-to-load-reference-workspace.service';
import { FlowToLoadCheckWorkspaceRepository } from '../flow-to-load-check-workspace/flow-to-load-check-workspace.repository';

const testSumId = '';
const userId = 'user';
const flowToLoadReferenceId = '';
const entity = new FlowToLoadReference();
const flowToLoadReference = new FlowToLoadReferenceDTO();
const payload = new FlowToLoadReferenceBaseDTO();

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue([entity]),
  findOne: jest.fn().mockResolvedValue(entity),
  save: jest.fn().mockResolvedValue(entity),
  create: jest.fn().mockResolvedValue(entity),
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
    it('Calls repository.findOne({id}) to get a single Flow To Load Check record', async () => {
      const result = await service.getFlowToLoadReference(
        flowToLoadReferenceId,
      );
      expect(result).toEqual(flowToLoadReference);
      expect(repository.findOne).toHaveBeenCalled();
    });

    it('Should throw error when a Flow To Load Check record not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

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
});
