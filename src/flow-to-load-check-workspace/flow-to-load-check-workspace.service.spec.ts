import { Test, TestingModule } from '@nestjs/testing';
import { FlowToLoadCheck } from '../entities/flow-to-load-check.entity';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import {
  FlowToLoadCheckBaseDTO,
  FlowToLoadCheckDTO,
} from '../dto/flow-to-load-check.dto';
import { FlowToLoadCheckWorkspaceRepository } from './flow-to-load-check-workspace.repository';
import { FlowToLoadCheckWorkspaceService } from './flow-to-load-check-workspace.service';
import { FlowToLoadCheckMap } from '../maps/flow-to-load-check.map';

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
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(flowToLoadCheck),
  many: jest.fn().mockResolvedValue([flowToLoadCheck]),
});

const mockTestSumService = () => ({
  resetToNeedsEvaluation: jest.fn(),
});

describe('AppECorrelationTestSummaryWorkspaceService', () => {
  let service: FlowToLoadCheckWorkspaceService;
  let testSummaryService: TestSummaryWorkspaceService;
  let repository: FlowToLoadCheckWorkspaceRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
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
});
