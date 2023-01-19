import { Test, TestingModule } from '@nestjs/testing';
import { QaCertificationEventController } from './qa-certification-event.controller';
import { QaCertificationEventService } from './qa-certification-event.service';

describe('QaCertificationEventController', () => {
  let controller: QaCertificationEventController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QaCertificationEventController],
      providers: [QaCertificationEventService],
    }).compile();

    controller = module.get<QaCertificationEventController>(QaCertificationEventController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
