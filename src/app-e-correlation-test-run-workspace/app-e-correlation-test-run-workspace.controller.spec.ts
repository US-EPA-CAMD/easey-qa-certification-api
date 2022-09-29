import { Test, TestingModule } from '@nestjs/testing';
import { AppECorrelationTestRunWorkspaceController } from './app-e-correlation-test-run-workspace.controller';
import { AppECorrelationTestRunWorkspaceService } from './app-e-correlation-test-run-workspace.service';

describe('AppECorrelationTestRunWorkspaceController', () => {
  let controller: AppECorrelationTestRunWorkspaceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppECorrelationTestRunWorkspaceController],
      providers: [AppECorrelationTestRunWorkspaceService],
    }).compile();

    controller = module.get<AppECorrelationTestRunWorkspaceController>(
      AppECorrelationTestRunWorkspaceController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
