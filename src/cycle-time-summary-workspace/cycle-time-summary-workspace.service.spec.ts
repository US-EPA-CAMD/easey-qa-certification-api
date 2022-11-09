import { Test, TestingModule } from '@nestjs/testing';
import { CycleTimeSummaryWorkspaceService } from './cycle-time-summary-workspace.service';

describe('CycleTimeSummaryWorkspaceService', () => {
  let service: CycleTimeSummaryWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CycleTimeSummaryWorkspaceService],
    }).compile();

    service = module.get<CycleTimeSummaryWorkspaceService>(
      CycleTimeSummaryWorkspaceService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
