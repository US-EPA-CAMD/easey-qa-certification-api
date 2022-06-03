import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { LinearitySummaryController } from './linearity-summary.controller';
import { LinearitySummaryService } from './linearity-summary.service';

describe('Event Controller', () => {
  let controller: LinearitySummaryController;
  let service: LinearitySummaryService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      controllers: [LinearitySummaryController],
      providers: [
        LinearitySummaryService,
        ConfigService,
      ],
    }).compile();

    controller = module.get(LinearitySummaryController);
    service = module.get(LinearitySummaryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});