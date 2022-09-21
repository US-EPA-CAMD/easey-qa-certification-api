import { Test, TestingModule } from '@nestjs/testing';
import { FlowRataRunMap } from '../maps/flow-rata-run.map';
import { FlowRataRunWorkspaceRepository } from './flow-rata-run-workspace.repository';
import { FlowRataRunWorkspaceService } from './flow-rata-run-workspace.service';
import { FlowRataRun } from '../entities/flow-rata-run.entity';
import { FlowRataRunDTO } from '../dto/flow-rata-run.dto';
import { RataTraverseDTO } from '../dto/rata-traverse.dto';
import { RataTraverseWorkspaceService } from '../rata-traverse-workspace/rata-traverse-workspace.service';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';

const flowRataRunId = 'a1b2c3';
const rataRunId = 'd4e5f6';
const flowRataRun = new FlowRataRun();
const flowRataRunDTO = new FlowRataRunDTO();

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(flowRataRunDTO),
  many: jest.fn().mockResolvedValue([flowRataRunDTO]),
});

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue([flowRataRun]),
  findOne: jest.fn().mockResolvedValue(flowRataRun),
});

const mockRataTraverseService = () => ({
  export: jest.fn().mockResolvedValue([new RataTraverseDTO()]),
  import: jest.fn().mockResolvedValue(null),
});

const mockTestSummaryService = () => ({
  resetToNeedsEvaluation: jest.fn(),
});

describe('FlowRataRunWorkspaceService', () => {
  let service: FlowRataRunWorkspaceService;
  let repository: FlowRataRunWorkspaceRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FlowRataRunWorkspaceService,
        {
          provide: TestSummaryWorkspaceService,
          useFactory: mockTestSummaryService,
        },
        {
          provide: FlowRataRunWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: RataTraverseWorkspaceService,
          useFactory: mockRataTraverseService,
        },
        {
          provide: FlowRataRunMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get<FlowRataRunWorkspaceService>(
      FlowRataRunWorkspaceService,
    );
    repository = module.get<FlowRataRunWorkspaceRepository>(
      FlowRataRunWorkspaceRepository,
    );
  });

  describe('getFlowRataRun', () => {
    it('Calls repository.findOne({id}) to get a single Flow Rata Run record', async () => {
      const result = await service.getFlowRataRun(flowRataRunId);
      expect(result).toEqual(flowRataRunDTO);
      expect(repository.findOne).toHaveBeenCalled();
    });

    it('Should throw error when Flow Rata Run record not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      let errored = false;

      try {
        await service.getFlowRataRun(flowRataRunId);
      } catch (err) {
        errored = true;
      }

      expect(errored).toBe(true);
    });
  });

  describe('getFlowRataRuns', () => {
    it('Should return an array of Flow Rata Run records', async () => {
      const result = await service.getFlowRataRuns(rataRunId);
      expect(result).toEqual([flowRataRun]);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('getRataSummariesByRataIds', () => {
    it('Should get Rata Travarse records by flow rata run ids', async () => {
      const result = await service.getFlowRataRunsByRataRunIds([rataRunId]);
      expect(result).toEqual([flowRataRunDTO]);
    });
  });

  describe('Export', () => {
    it('Should Export Rata Run', async () => {
      jest
        .spyOn(service, 'getFlowRataRunsByRataRunIds')
        .mockResolvedValue([flowRataRunDTO]);
      const result = await service.export([rataRunId]);
      expect(result).toEqual([flowRataRunDTO]);
    });
  });
});
