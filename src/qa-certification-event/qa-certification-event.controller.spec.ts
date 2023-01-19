import { Test, TestingModule } from '@nestjs/testing';
import { QaCertificationEventController } from './qa-certification-event.controller';
import { QaCertificationEventService } from './qa-certification-event.service';
import { QACertificationEventDTO } from '../dto/qa-certification-event.dto';

const locationId = '';
const qaCertEventId = '';

const qaCertEventDTO = new QACertificationEventDTO();

const mockService = () => ({
  getQACertEvent: jest.fn().mockResolvedValue(qaCertEventDTO),
  getQACertEvents: jest.fn().mockResolvedValue([qaCertEventDTO]),
});

describe('QaCertificationEventController', () => {
  let controller: QaCertificationEventController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QaCertificationEventController],
      providers: [
        {
          provide: QaCertificationEventService,
          useFactory: mockService,
        },
      ],
    }).compile();

    controller = module.get<QaCertificationEventController>(
      QaCertificationEventController,
    );
  });

  describe('getCycleTimeSummary', () => {
    it('Calls the service to get a QA Certification Event record', async () => {
      const result = await controller.getQACertEvent(locationId, qaCertEventId);
      expect(result).toEqual(qaCertEventDTO);
    });
  });

  describe('getCycleTimeSummaries', () => {
    it('Calls the service to many QA Certification Event records by Location Id', async () => {
      const result = await controller.getQACertEvents(locationId);
      expect(result).toEqual([qaCertEventDTO]);
    });
  });
});
