import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';
import { LinearitySummaryChecksService } from './linearity-summary-checks.service';

import { LinearitySummaryWorkspaceController } from './linearity-summary.controller';
import { LinearitySummaryWorkspaceService } from './linearity-summary.service';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { ConfigService } from '@nestjs/config';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';

const user: CurrentUser = {
  userId: 'testUser',
  sessionId: '',
  expiration: '',
  clientIp: '',
  isAdmin: false,
  roles: [],
};

describe('Linearity Summary Controller', () => {
  let controller: LinearitySummaryWorkspaceController;
  let service: LinearitySummaryWorkspaceService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [LinearitySummaryWorkspaceController],
      providers: [
        ConfigService,
        AuthGuard,
        {
          provide: LinearitySummaryWorkspaceService,
          useFactory: () => ({}),
        },
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
