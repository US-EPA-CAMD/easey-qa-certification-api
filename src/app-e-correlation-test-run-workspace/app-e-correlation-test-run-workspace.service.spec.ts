import { Test, TestingModule } from '@nestjs/testing';
import { AppECorrelationTestRunWorkspaceService } from './app-e-correlation-test-run-workspace.service';

describe('AppECorrelationTestRunWorkspaceService', () => {
  let service: AppECorrelationTestRunWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppECorrelationTestRunWorkspaceService],
    }).compile();

    service = module.get<AppECorrelationTestRunWorkspaceService>(
      AppECorrelationTestRunWorkspaceService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
