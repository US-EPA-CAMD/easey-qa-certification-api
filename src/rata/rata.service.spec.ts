import { Test, TestingModule } from '@nestjs/testing';
import { Rata } from '../entities/rata.entity';
import { RataMap } from '../maps/rata.map';
import { RataDTO, RataRecordDTO } from '../dto/rata.dto';
import { RataRepository } from './rata.repository';
import { RataService } from './rata.service';
import { RataSummaryService } from '../rata-summary/rata-summary.service';
import { RataSummaryDTO } from '../dto/rata-summary.dto';

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
  findOne: jest.fn().mockResolvedValue(rataEntity),
  find: jest.fn().mockResolvedValue([rataEntity]),
});

const mockRataSummaryService = () => ({
  export: jest.fn().mockResolvedValue([new RataSummaryDTO()]),
});

describe('RataService', () => {
  let service: RataService;
  let repository: RataRepository;

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
      ],
    }).compile();

    service = module.get<RataService>(RataService);
    repository = module.get<RataRepository>(RataRepository);
  });

  describe('getRataById', () => {
    it('calls the repository.findOne() and get one rata record', async () => {
      const result = await service.getRataById(rataId);
      expect(result).toEqual(rataRecord);
      expect(repository.findOne).toHaveBeenCalled();
    });

    it('Should through error while not finding a Rata record', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);

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
    it('calls the repository.find() and get many rata record', async () => {
      const result = await service.getRatasByTestSumId(rataId);
      expect(result).toEqual([rataRecord]);
      expect(repository.find).toHaveBeenCalled();
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
