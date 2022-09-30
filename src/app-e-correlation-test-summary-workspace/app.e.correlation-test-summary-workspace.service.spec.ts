import { Test, TestingModule } from '@nestjs/testing';
import { AppECorrelationTestSummaryWorkspaceService } from './app-e-correlation-test-summary-workspace.service';

describe('AppECorrelationTestSummaryWorkspaceService', () => {
  let service: AppECorrelationTestSummaryWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppECorrelationTestSummaryWorkspaceService],
    }).compile();

    service = module.get<AppECorrelationTestSummaryWorkspaceService>(
      AppECorrelationTestSummaryWorkspaceService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});