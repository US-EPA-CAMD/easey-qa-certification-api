import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { LinearityInjectionChecksService } from './linearity-injection-checks.service';

import { LinearityInjectionWorkspaceController } from './linearity-injection.controller';
import { LinearityInjectionWorkspaceRepository } from './linearity-injection.repository';
import { LinearityInjectionWorkspaceService } from './linearity-injection.service';

describe('Linearity Injection Controller', () => {
  let controller: LinearityInjectionWorkspaceController;
  let service: LinearityInjectionWorkspaceService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      controllers: [LinearityInjectionWorkspaceController],
      providers: [
        LinearityInjectionWorkspaceRepository,
        {
          provide: LinearityInjectionWorkspaceService,
          useFactory: () => ({}),
        },
        ConfigService,
        {
          provide: LinearityInjectionChecksService,
          useFactory: () => ({}),
        },
      ],
    }).compile();

    controller = module.get(LinearityInjectionWorkspaceController);
    service = module.get(LinearityInjectionWorkspaceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
