import { Test, TestingModule } from '@nestjs/testing';
import { HgSummaryWorkspaceService } from './hg-summary-workspace.service';

describe('HgSummaryWorkspaceService', () => {
  let service: HgSummaryWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HgSummaryWorkspaceService],
    }).compile();

    service = module.get<HgSummaryWorkspaceService>(HgSummaryWorkspaceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
