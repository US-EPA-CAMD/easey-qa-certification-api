import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@us-epa-camd/easey-common/logger';

import {
  RataTraverseDTO,
  RataTraverseImportDTO,
} from '../dto/rata-traverse.dto';
import { RataTraverse as RataTraverseOfficial } from '../entities/rata-traverse.entity';
import { RataTraverse } from '../entities/workspace/rata-traverse.entity';
import { RataTraverseMap } from '../maps/rata-traverse.map';
import { RataTraverseRepository } from '../rata-traverse/rata-traverse.repository';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { RataTraverseWorkspaceRepository } from './rata-traverse-workspace.repository';
import { RataTraverseWorkspaceService } from './rata-traverse-workspace.service';

const testSumId = '';
const userId = '';
const flowRataRunId = '';
const rataTravarse = new RataTraverse();
const rataTravarseDto = new RataTraverseDTO();

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue([rataTravarse]),
  findOneBy: jest.fn().mockResolvedValue(rataTravarse),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(rataTravarseDto),
  many: jest.fn().mockResolvedValue([rataTravarseDto]),
});

const mockTestSummaryService = () => ({
  resetToNeedsEvaluation: jest.fn(),
});

const officialRecord = new RataTraverseOfficial();
officialRecord.id = 'uuid';
const mockOfficialRepository = () => ({
  findOneBy: jest.fn(),
});

describe('RataTraverseWorkspaceService', () => {
  let service: RataTraverseWorkspaceService;
  let officialRepository: RataTraverseRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Logger,
        ConfigService,
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
        {
          provide: RataTraverseRepository,
          useFactory: mockOfficialRepository,
        },
      ],
    }).compile();

    service = module.get<RataTraverseWorkspaceService>(
      RataTraverseWorkspaceService,
    );
    officialRepository = module.get<RataTraverseRepository>(
      RataTraverseRepository,
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

  describe('import', () => {
    const importPayload = new RataTraverseImportDTO();

    it('Should import Rata Travarse', async () => {
      jest
        .spyOn(service, 'createRataTraverse')
        .mockResolvedValue(rataTravarseDto);
      const result = await service.import(
        testSumId,
        flowRataRunId,
        importPayload,
        userId,
      );
      expect(result).toEqual(null);
    });

    it('Should import Rata Traverse with historical data', async () => {
      jest
        .spyOn(service, 'createRataTraverse')
        .mockResolvedValue(rataTravarseDto);
      jest
        .spyOn(officialRepository, 'findOneBy')
        .mockResolvedValue(officialRecord);
      const result = await service.import(
        testSumId,
        flowRataRunId,
        importPayload,
        userId,
        true,
      );
      expect(result).toEqual(null);
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
