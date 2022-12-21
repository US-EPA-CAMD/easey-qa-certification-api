import { Test, TestingModule } from '@nestjs/testing';
import { HgSummaryWorkspaceController } from './hg-summary-workspace.controller';
import { HgSummaryWorkspaceService } from './hg-summary-workspace.service';

describe('HgSummaryWorkspaceController', () => {
  let controller: HgSummaryWorkspaceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HgSummaryWorkspaceController],
      providers: [HgSummaryWorkspaceService],
    }).compile();

    controller = module.get<HgSummaryWorkspaceController>(
      HgSummaryWorkspaceController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
