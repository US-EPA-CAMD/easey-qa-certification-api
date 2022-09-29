import { Test, TestingModule } from '@nestjs/testing';
import { AppECorrelationTestRunController } from './app-e-correlation-test-run.controller';
import { AppECorrelationTestRunService } from './app-e-correlation-test-run.service';

describe('AppECorrelationTestRunController', () => {
  let controller: AppECorrelationTestRunController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppECorrelationTestRunController],
      providers: [AppECorrelationTestRunService],
    }).compile();

    controller = module.get<AppECorrelationTestRunController>(
      AppECorrelationTestRunController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
