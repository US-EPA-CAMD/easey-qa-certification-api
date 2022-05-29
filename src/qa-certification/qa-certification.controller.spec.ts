import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { QACertificationController } from './qa-certification.controller';
import { QACertificationService } from './qa-certification.service';

describe('Event Controller', () => {
  let controller: QACertificationController;
  let service: QACertificationService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      controllers: [QACertificationController],
      providers: [
        QACertificationService,
        ConfigService,
      ],
    }).compile();

    controller = module.get(QACertificationController);
    service = module.get(QACertificationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});