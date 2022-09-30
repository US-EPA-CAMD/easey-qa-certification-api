import { Test, TestingModule } from '@nestjs/testing';
import { AppECorrelationTestSummaryService } from './app-e-correlation-test-summary.service';

describe('AppECorrelationTestSummaryService', () => {
  let service: AppECorrelationTestSummaryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppECorrelationTestSummaryService],
    }).compile();

    service = module.get<AppECorrelationTestSummaryService>(
      AppECorrelationTestSummaryService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
