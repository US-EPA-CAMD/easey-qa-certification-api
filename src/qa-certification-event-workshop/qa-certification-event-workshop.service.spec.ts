import { Test, TestingModule } from '@nestjs/testing';
import { QaCertificationEventWorkshopService } from './qa-certification-event-workshop.service';

describe('QaCertificationEventWorkshopService', () => {
  let service: QaCertificationEventWorkshopService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QaCertificationEventWorkshopService],
    }).compile();

    service = module.get<QaCertificationEventWorkshopService>(QaCertificationEventWorkshopService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
