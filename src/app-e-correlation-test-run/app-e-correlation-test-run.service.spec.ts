import { Test, TestingModule } from '@nestjs/testing';
import { AppECorrelationTestRunService } from './app-e-correlation-test-run.service';

describe('AppECorrelationTestRunService', () => {
  let service: AppECorrelationTestRunService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppECorrelationTestRunService],
    }).compile();

    service = module.get<AppECorrelationTestRunService>(
      AppECorrelationTestRunService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
