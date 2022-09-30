import { Test, TestingModule } from '@nestjs/testing';
import { AppendixETestSummaryController } from './app-e-correlation-test-summary.controller';
import { AppECorrelationTestSummaryService } from './app-e-correlation-test-summary.service';

describe('AppendixETestSummaryController', () => {
  let controller: AppendixETestSummaryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppendixETestSummaryController],
      providers: [AppECorrelationTestSummaryService],
    }).compile();

    controller = module.get<AppendixETestSummaryController>(
      AppendixETestSummaryController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
