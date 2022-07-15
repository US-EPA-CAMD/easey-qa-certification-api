import { Test, TestingModule } from '@nestjs/testing';
import { AnalyzerRangeService } from './analyzer-range.service';

describe('AnalyzerRangeService', () => {
  let service: AnalyzerRangeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnalyzerRangeService],
    }).compile();

    service = module.get<AnalyzerRangeService>(AnalyzerRangeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
