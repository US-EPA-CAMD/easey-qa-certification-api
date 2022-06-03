import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { LinearityInjectionWorkspaceController } from './linearity-injection.controller';
import { LinearityInjectionWorkspaceService } from './linearity-injection.service';

describe('Event Controller', () => {
  let controller: LinearityInjectionWorkspaceController;
  let service: LinearityInjectionWorkspaceService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      controllers: [LinearityInjectionWorkspaceController],
      providers: [
        LinearityInjectionWorkspaceService,
        ConfigService,
      ],
    }).compile();

    controller = module.get(LinearityInjectionWorkspaceController);
    service = module.get(LinearityInjectionWorkspaceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});