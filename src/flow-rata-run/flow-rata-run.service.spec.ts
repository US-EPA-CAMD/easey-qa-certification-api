import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { FlowRataRunDTO } from '../dto/flow-rata-run.dto';
import { RataTraverseDTO } from '../dto/rata-traverse.dto';
import { FlowRataRun } from '../entities/flow-rata-run.entity';
import { FlowRataRunMap } from '../maps/flow-rata-run.map';
import { RataTraverseService } from '../rata-traverse/rata-traverse.service';
import { FlowRataRunRepository } from './flow-rata-run.repository';
import { FlowRataRunService } from './flow-rata-run.service';

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
  findOneBy: jest.fn().mockResolvedValue(flowRataRun),
});

const mockRataTraverseService = () => ({
  export: jest.fn().mockResolvedValue([new RataTraverseDTO()]),
});

describe('FlowRataRunService', () => {
  let service: FlowRataRunService;
  let repository: FlowRataRunRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FlowRataRunService,
        FlowRataRunMap,
        ConfigService,
        {
          provide: FlowRataRunRepository,
          useFactory: mockRepository,
        },
        {
          provide: FlowRataRunMap,
          useFactory: mockMap,
        },
        {
          provide: RataTraverseService,
          useFactory: mockRataTraverseService,
        },
      ],
    }).compile();

    service = module.get<FlowRataRunService>(FlowRataRunService);
    repository = module.get<FlowRataRunRepository>(FlowRataRunRepository);
  });

  describe('getFlowRataRun', () => {
    it('Calls repository.findOneBy({id}) to get a single Flow Rata Run record', async () => {
      const result = await service.getFlowRataRun(flowRataRunId);
      expect(result).toEqual(flowRataRunDTO);
      expect(repository.findOneBy).toHaveBeenCalled();
    });

    it('Should throw error when Flow Rata Run record not found', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

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
