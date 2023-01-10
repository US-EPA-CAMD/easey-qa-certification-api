import { Test, TestingModule } from '@nestjs/testing';
import { QaCertificationEventWorkshopController } from './qa-certification-event-workshop.controller';
import { QaCertificationEventWorkshopService } from './qa-certification-event-workshop.service';

describe('QaCertificationEventWorkshopController', () => {
  let controller: QaCertificationEventWorkshopController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QaCertificationEventWorkshopController],
      providers: [QaCertificationEventWorkshopService],
    }).compile();

    controller = module.get<QaCertificationEventWorkshopController>(QaCertificationEventWorkshopController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
