import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { QACertificationWorkspaceController } from './qa-certification.controller';
import { QACertificationWorkspaceService } from './qa-certification.service';

describe('Event Controller', () => {
  let controller: QACertificationWorkspaceController;
  let service: QACertificationWorkspaceService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      controllers: [QACertificationWorkspaceController],
      providers: [QACertificationWorkspaceService, ConfigService],
    }).compile();

    controller = module.get(QACertificationWorkspaceController);
    service = module.get(QACertificationWorkspaceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
