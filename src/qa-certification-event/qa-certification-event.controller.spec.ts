import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { QaCertificationEventController } from './qa-certification-event.controller';
import { QaCertificationEventService } from './qa-certification-event.service';
import { QACertificationEventDTO } from '../dto/qa-certification-event.dto';

const locationId = '';
const qaCertEventId = '';

const qaCertEventDTO = new QACertificationEventDTO();

const mockService = () => ({
  getQACertEvent: jest.fn().mockResolvedValue(qaCertEventDTO),
  getQACertEventsByLocationId: jest.fn().mockResolvedValue([qaCertEventDTO]),
});

describe('QaCertificationEventController', () => {
  let controller: QaCertificationEventController;
  let service: QaCertificationEventService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [QaCertificationEventController],
      providers: [
        ConfigService,
        AuthGuard,
        {
          provide: QaCertificationEventService,
          useFactory: mockService,
        },
      ],
    }).compile();

    controller = module.get<QaCertificationEventController>(
      QaCertificationEventController,
    );
    service = module.get(QaCertificationEventService);
  });

  describe('getQACertEvent', () => {
    it('should call the QACertificationEventService.getQACertEvent', async () => {
      const spyService = jest.spyOn(service, 'getQACertEvent');
      const result = await controller.getQACertEvent(locationId, qaCertEventId);
      expect(result).toEqual(qaCertEventDTO);
      expect(spyService).toHaveBeenCalled();
    });
  });

  describe('getQACertEventsByLocationId', () => {
    it('should call the QACertificationEventWorkspaceService.getQACertEvents', async () => {
      const spyService = jest.spyOn(service, 'getQACertEventsByLocationId');
      const result = await controller.getQACertEvents('1');
      expect(result).toEqual([qaCertEventDTO]);
      expect(spyService).toHaveBeenCalled();
    });
  });
});
