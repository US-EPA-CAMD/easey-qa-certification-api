import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { TestSummaryWorkspaceController } from './test-summary.controller';
import { TestSummaryWorkspaceService } from './test-summary.service';

describe('Event Controller', () => {
  let controller: TestSummaryWorkspaceController;
  let service: TestSummaryWorkspaceService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      controllers: [TestSummaryWorkspaceController],
      providers: [
        TestSummaryWorkspaceService,
        ConfigService,
      ],
    }).compile();

    controller = module.get(TestSummaryWorkspaceController);
    service = module.get(TestSummaryWorkspaceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});