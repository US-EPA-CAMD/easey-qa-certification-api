import { Test, TestingModule } from '@nestjs/testing';
import { CycleTimeSummaryWorkspaceController } from './cycle-time-summary-workspace.controller';
import { CycleTimeSummaryWorkspaceService } from './cycle-time-summary-workspace.service';

describe('CycleTimeSummaryWorkspaceController', () => {
  let controller: CycleTimeSummaryWorkspaceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CycleTimeSummaryWorkspaceController],
      providers: [CycleTimeSummaryWorkspaceService],
    }).compile();

    controller = module.get<CycleTimeSummaryWorkspaceController>(
      CycleTimeSummaryWorkspaceController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
