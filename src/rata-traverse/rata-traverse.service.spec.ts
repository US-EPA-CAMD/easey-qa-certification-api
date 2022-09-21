import { Test, TestingModule } from '@nestjs/testing';
import { RataTraverseDTO } from '../dto/rata-traverse.dto';
import { RataTraverse } from '../entities/rata-traverse.entity';
import { RataTraverseMap } from '../maps/rata-traverse.map';
import { RataTraverseRepository } from './rata-traverse.repository';
import { RataTraverseService } from './rata-traverse.service';

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

describe('RataTraverseService', () => {
  let service: RataTraverseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RataTraverseService,
        {
          provide: RataTraverseRepository,
          useFactory: mockRepository,
        },
        {
          provide: RataTraverseMap,
          useFactory: mockMap,
        },
      ],
    }).compile();

    service = module.get<RataTraverseService>(RataTraverseService);
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
