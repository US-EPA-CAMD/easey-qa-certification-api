import { Test, TestingModule } from '@nestjs/testing';
import { CycleTimeSummaryService } from './cycle-time-summary.service';

describe('CycleTimeSummaryService', () => {
  let service: CycleTimeSummaryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CycleTimeSummaryService],
    }).compile();

    service = module.get<CycleTimeSummaryService>(CycleTimeSummaryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
