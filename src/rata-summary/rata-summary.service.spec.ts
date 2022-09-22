import { Test, TestingModule } from '@nestjs/testing';
import { RataSummaryMap } from '../maps/rata-summary.map';
import { RataSummaryDTO } from '../dto/rata-summary.dto';
import { RataSummary } from '../entities/rata-summary.entity';
import { RataSummaryRepository } from './rata-summary.repository';
import { RataSummaryService } from './rata-summary.service';
import { RataRunService } from '../rata-run/rata-run.service';
import { RataRunDTO } from '../dto/rata-run.dto';

const rataId = '';
const entity = new RataSummary();
const dto = new RataSummaryDTO();

const mockRepository = () => ({
  create: jest.fn().mockResolvedValue(entity),
  save: jest.fn().mockResolvedValue(entity),
  find: jest.fn().mockResolvedValue([entity]),
  findOne: jest.fn().mockResolvedValue(entity),
  delete: jest.fn().mockResolvedValue(null),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(dto),
  many: jest.fn().mockResolvedValue([dto]),
});

const mockRataRunService = () => ({
  export: jest.fn().mockResolvedValue([new RataRunDTO()]),
});

describe('RataSummaryService', () => {
  let service: RataSummaryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RataSummaryService,
        {
          provide: RataSummaryRepository,
          useFactory: mockRepository,
        },
        {
          provide: RataSummaryMap,
          useFactory: mockMap,
        },
        {
          provide: RataRunService,
          useFactory: mockRataRunService,
        },
      ],
    }).compile();

    service = module.get<RataSummaryService>(RataSummaryService);
  });

  describe('getRataSummariesByRataIds', () => {
    it('Should get Rata Summary records by rata ids', async () => {
      const result = await service.getRataSummariesByRataIds([rataId]);
      expect(result).toEqual([dto]);
    });
  });

  describe('Export', () => {
    it('Should Export Rata Summary', async () => {
      jest.spyOn(service, 'getRataSummariesByRataIds').mockResolvedValue([dto]);
      const result = await service.export([rataId]);
      expect(result).toEqual([dto]);
    });
  });
});
