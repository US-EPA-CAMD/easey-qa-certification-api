import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { LinearitySummaryChecksService } from './linearity-summary-checks.service';

import { LinearitySummaryWorkspaceController } from './linearity-summary.controller';
import { LinearitySummaryWorkspaceService } from './linearity-summary.service';

describe('Linearity Summary Controller', () => {
  let controller: LinearitySummaryWorkspaceController;
  let service: LinearitySummaryWorkspaceService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      controllers: [LinearitySummaryWorkspaceController],
      providers: [
        {
          provide: LinearitySummaryWorkspaceService,
          useFactory: () => ({}),
        },
        ConfigService,
        {
          provide: LinearitySummaryChecksService,
          useFactory: () => ({}),
        },
      ],
    }).compile();

    controller = module.get(LinearitySummaryWorkspaceController);
    service = module.get(LinearitySummaryWorkspaceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
