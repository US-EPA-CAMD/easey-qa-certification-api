import { Test, TestingModule } from '@nestjs/testing';
import { RataSummaryMap } from '../maps/rata-summary.map';
import { RataSummaryDTO } from '../dto/rata-summary.dto';
import { RataSummary } from '../entities/rata-summary.entity';
import { RataSummaryRepository } from './rata-summary.repository';
import { RataSummaryService } from './rata-summary.service';

const entity = new RataSummary();
const dto = new RataSummaryDTO();

const mockRepository = () => ({
  create: jest.fn().mockResolvedValue(entity),
  save: jest.fn().mockResolvedValue(entity),
  findOne: jest.fn().mockResolvedValue(entity),
  delete: jest.fn().mockResolvedValue(null),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(dto),
  many: jest.fn().mockResolvedValue([dto]),
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
      ],
    }).compile();

    service = module.get<RataSummaryService>(RataSummaryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
