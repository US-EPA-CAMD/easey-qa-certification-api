import { Test, TestingModule } from '@nestjs/testing';
import { QaCertificationEventService } from './qa-certification-event.service';

describe('QaCertificationEventService', () => {
  let service: QaCertificationEventService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QaCertificationEventService],
    }).compile();

    service = module.get<QaCertificationEventService>(QaCertificationEventService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
