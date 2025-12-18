import { Test, TestingModule } from '@nestjs/testing';

import { RataSummaryDTO } from '../dto/rata-summary.dto';
import { RataDTO, RataRecordDTO } from '../dto/rata.dto';
import { Rata } from '../entities/rata.entity';
import { RataMap } from '../maps/rata.map';
import { RataSummaryService } from '../rata-summary/rata-summary.service';
import { RataRepository } from './rata.repository';
import { RataService } from './rata.service';
import { DataSource } from 'typeorm';
import { useSlaveRepository } from '@us-epa-camd/easey-common/connection';

jest.mock('@us-epa-camd/easey-common/connection');

const rataId = '';
const testSumId = '';
const rataRecord = new RataRecordDTO();
const rataDto = new RataDTO();
const rataEntity = new Rata();

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(rataDto),
  many: jest.fn().mockResolvedValue([rataDto]),
});

const mockRepository = () => ({
  findOneBy: jest.fn().mockResolvedValue(rataEntity),
  findBy: jest.fn().mockResolvedValue([rataEntity]),
});

const mockRataSummaryService = () => ({
  export: jest.fn().mockResolvedValue([new RataSummaryDTO()]),
});

describe('RataService', () => {
  let service: RataService;
  let repository: RataRepository;
  let dataSource: DataSource;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RataService,
        {
          provide: RataSummaryService,
          useFactory: mockRataSummaryService,
        },
        {
          provide: RataRepository,
          useFactory: mockRepository,
        },
        {
          provide: RataMap,
          useFactory: mockMap,
        },
        { provide: DataSource, useValue: dataSource },
      ],
    }).compile();

    service = module.get<RataService>(RataService);
    repository = module.get<RataRepository>(RataRepository);
  });

  describe('getRataById', () => {
    it('calls the repository.findOneBy() and get one rata record', async () => {
      const repo = mockRepository();  
      (useSlaveRepository as jest.Mock).mockImplementation(
          async (_dataSource, _repo, callback) =>
            callback(repo) 
        );      
      const result = await service.getRataById(rataId);
      expect(result).toEqual(rataRecord);
      expect(repo.findOneBy).toHaveBeenCalled();
    });

    it('Should through error while not finding a Rata record', async () => {
      
        (useSlaveRepository as jest.Mock).mockImplementation(
          async (_dataSource, _repo, callback) =>
            callback(jest.spyOn(repository, 'findOneBy').mockResolvedValue(undefined)) 
        );
      let errored = false;
      try {
        await service.getRataById(rataId);
      } catch (e) {
        errored = true;
      }
      expect(errored).toEqual(true);
    });
  });

  describe('getRatasByTestSumId', () => {
    it('calls the repository.findBy() and get many rata record', async () => {
      const repo = mockRepository();  
      (useSlaveRepository as jest.Mock).mockImplementation(
          async (_dataSource, _repo, callback) =>
            callback(repo) 
        ); 
      const result = await service.getRatasByTestSumId(rataId);
      expect(result).toEqual([rataRecord]);
      expect(repo.findBy).toHaveBeenCalled();
    });
  });

  describe('getRatasByTestSumIds', () => {
    it('Should get Rata records by test summary ids', async () => {
      const result = await service.getRatasByTestSumIds([testSumId]);
      expect(result).toEqual([rataDto]);
    });
  });

  describe('Export', () => {
    it('Should Export Rata', async () => {
      jest.spyOn(service, 'getRatasByTestSumIds').mockResolvedValue([rataDto]);
      const result = await service.export([testSumId]);
      expect(result).toEqual([rataDto]);
    });
  });
});
