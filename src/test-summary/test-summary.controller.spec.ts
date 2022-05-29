import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { TestSummaryController } from './test-summary.controller';
import { TestSummaryService } from './test-summary.service';

describe('Event Controller', () => {
  let controller: TestSummaryController;
  let service: TestSummaryService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      controllers: [TestSummaryController],
      providers: [
        TestSummaryService,
        ConfigService,
      ],
    }).compile();

    controller = module.get(TestSummaryController);
    service = module.get(TestSummaryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});