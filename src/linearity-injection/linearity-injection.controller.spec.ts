import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { LinearityInjectionController } from './linearity-injection.controller';
import { LinearityInjectionService } from './linearity-injection.service';

describe('Event Controller', () => {
  let controller: LinearityInjectionController;
  let service: LinearityInjectionService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      controllers: [LinearityInjectionController],
      providers: [LinearityInjectionService, ConfigService],
    }).compile();

    controller = module.get(LinearityInjectionController);
    service = module.get(LinearityInjectionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
