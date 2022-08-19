import { Test, TestingModule } from '@nestjs/testing';
import { RataSummaryService } from './rata-summary.service';

describe('RataSummaryService', () => {
  let service: RataSummaryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RataSummaryService],
    }).compile();

    service = module.get<RataSummaryService>(RataSummaryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
