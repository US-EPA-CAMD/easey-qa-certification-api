import { Test, TestingModule } from '@nestjs/testing';

import { FlowRataRunDTO } from '../dto/flow-rata-run.dto';
import { RataRunDTO } from '../dto/rata-run.dto';
import { RataRun } from '../entities/rata-run.entity';
import { FlowRataRunService } from '../flow-rata-run/flow-rata-run.service';
import { RataRunMap } from '../maps/rata-run.map';
import { RataRunRepository } from './rata-run.repository';
import { RataRunService } from './rata-run.service';
import { DataSource } from 'typeorm';
import { useSlaveRepository } from '@us-epa-camd/easey-common/connection';

jest.mock('@us-epa-camd/easey-common/connection');

const rataRunId = 'a1b2c3';
const rataSumId = 'd4e5f6';
const rataRun = new RataRun();
const rataRunDTO = new RataRunDTO();

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(rataRunDTO),
  many: jest.fn().mockResolvedValue([rataRunDTO]),
});

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue([rataRun]),
  findOneBy: jest.fn().mockResolvedValue(rataRun),
});

const mockFlowRataRunService = () => ({
  export: jest.fn().mockResolvedValue([new FlowRataRunDTO()]),
});

describe('RataRunService', () => {
  let service: RataRunService;
  let repository: RataRunRepository;
  let dataSource: DataSource;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RataRunService,
        RataRunMap,
        {
          provide: RataRunRepository,
          useFactory: mockRepository,
        },
        {
          provide: RataRunMap,
          useFactory: mockMap,
        },
        {
          provide: FlowRataRunService,
          useFactory: mockFlowRataRunService,
        },
        { provide: DataSource, useValue: dataSource },
      ],
    }).compile();

    service = module.get<RataRunService>(RataRunService);
    repository = module.get<RataRunRepository>(RataRunRepository);
  });

  describe('getRataRun', () => {
    it('Calls repository.findOneBy({id}) to get a single Rata Run record', async () => {
      const repo = mockRepository(); 
      (useSlaveRepository as jest.Mock).mockImplementation(
          async (_dataSource, _repo, callback) =>
            callback(repo) 
        );
      const result = await service.getRataRun(rataRunId);
      expect(result).toEqual(rataRunDTO);
      expect(repo.findOneBy).toHaveBeenCalled();
    });

    it('Should throw error when Rata Run record not found', async () => {
        (useSlaveRepository as jest.Mock).mockImplementation(
          async (_dataSource, _repo, callback) =>
            callback(jest.spyOn(repository, 'findOneBy').mockResolvedValue(null)) 
        );
      let errored = false;

      try {
        await service.getRataRun(rataRunId);
      } catch (err) {
        errored = true;
      }

      expect(errored).toBe(true);
    });
  });

  describe('getRataRuns', () => {
    it('Should return an array of Rata Run records', async () => {
      const repo = mockRepository();
      (useSlaveRepository as jest.Mock).mockImplementation(
          async (_dataSource, _repo, callback) =>
            callback(repo) 
        );
      const result = await service.getRataRuns(rataSumId);
      expect(result).toEqual([rataRun]);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('getRataRunsByRataSumIds', () => {
    it('Should get Rata Run records by rata summary ids', async () => {
      const result = await service.getRataRunsByRataSumIds([rataSumId]);
      expect(result).toEqual([rataRunDTO]);
    });
  });

  describe('Export', () => {
    it('Should Export Rata Run', async () => {
      jest
        .spyOn(service, 'getRataRunsByRataSumIds')
        .mockResolvedValue([rataRunDTO]);
      const result = await service.export([rataSumId]);
      expect(result).toEqual([rataRunDTO]);
    });
  });
});
