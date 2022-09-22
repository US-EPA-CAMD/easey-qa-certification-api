import { Test, TestingModule } from '@nestjs/testing';
import { RataTraverseMap } from '../maps/rata-traverse.map';
import { RataTraverseDTO } from '../dto/rata-traverse.dto';
import { RataTraverse } from '../entities/workspace/rata-traverse.entity';
import { RataTraverseWorkspaceRepository } from './rata-traverse-workspace.repository';
import { RataTraverseWorkspaceService } from './rata-traverse-workspace.service';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';

const flowRataRunId = '';
const rataTravarse = new RataTraverse();
const rataTravarseDto = new RataTraverseDTO();

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue([rataTravarse]),
  findOne: jest.fn().mockResolvedValue(rataTravarse),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(rataTravarseDto),
  many: jest.fn().mockResolvedValue([rataTravarseDto]),
});

const mockTestSummaryService = () => ({
  resetToNeedsEvaluation: jest.fn(),
});

describe('RataTraverseWorkspaceService', () => {
  let service: RataTraverseWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RataTraverseWorkspaceService,
        {
          provide: TestSummaryWorkspaceService,
          useFactory: mockTestSummaryService,
        },
        {
          provide: RataTraverseWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: RataTraverseMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get<RataTraverseWorkspaceService>(
      RataTraverseWorkspaceService,
    );
  });

  describe('getRataSummariesByRataIds', () => {
    it('Should get Rata Travarse records by flow rata run ids', async () => {
      const result = await service.getRatatravarsesByFlowRataRunIds([
        flowRataRunId,
      ]);
      expect(result).toEqual([rataTravarseDto]);
    });
  });

  describe('Export', () => {
    it('Should Export Rata Travarse', async () => {
      jest
        .spyOn(service, 'getRatatravarsesByFlowRataRunIds')
        .mockResolvedValue([rataTravarseDto]);
      const result = await service.export([flowRataRunId]);
      expect(result).toEqual([rataTravarseDto]);
    });
  });
});
