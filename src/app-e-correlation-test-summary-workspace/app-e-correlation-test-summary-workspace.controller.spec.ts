import { Test, TestingModule } from '@nestjs/testing';
import { AppendixETestSummaryWorkspaceController } from './app-e-correlation-test-summary-workspace.controller';
import { AppECorrelationTestSummaryWorkspaceService } from './app-e-correlation-test-summary-workspace.service';

describe('AppendixETestSummaryWorkspaceController', () => {
  let controller: AppendixETestSummaryWorkspaceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppendixETestSummaryWorkspaceController],
      providers: [AppECorrelationTestSummaryWorkspaceService],
    }).compile();

    controller = module.get<AppendixETestSummaryWorkspaceController>(
      AppendixETestSummaryWorkspaceController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});