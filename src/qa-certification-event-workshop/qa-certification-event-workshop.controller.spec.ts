import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';

import { QaCertificationEventWorkshopController } from './qa-certification-event-workshop.controller';
import { QaCertificationEventWorkshopService } from './qa-certification-event-workshop.service';
import {
  QACertificationEventBaseDTO,
  QACertificationEventDTO,
} from '../dto/qa-certification-event.dto';

const locationId = '';
const payload = new QACertificationEventBaseDTO();
const qaCertEvent = new QACertificationEventDTO();

const user: CurrentUser = {
  userId: 'testUser',
  sessionId: '',
  expiration: '',
  clientIp: '',
  isAdmin: false,
  roles: [],
};

const mockService = () => ({
  createQACertEvent: jest.fn().mockResolvedValue(qaCertEvent),
  getQACertEvent: jest.fn().mockResolvedValue(qaCertEvent),
  getQACertEvents: jest.fn().mockResolvedValue([qaCertEvent]),
  deleteQACertEvent: jest.fn().mockResolvedValue(''),
});

describe('QaCertificationEventWorkshopController', () => {
  let controller: QaCertificationEventWorkshopController;
  let service: QaCertificationEventWorkshopService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [QaCertificationEventWorkshopController],
      providers: [
        ConfigService,
        AuthGuard,
        {
          provide: QaCertificationEventWorkshopService,
          useFactory: mockService,
        },
      ],
    }).compile();

    controller = module.get<QaCertificationEventWorkshopController>(
      QaCertificationEventWorkshopController,
    );
    service = module.get(QaCertificationEventWorkshopService);
  });

  describe('getQACertEvents', () => {
    it('should call the QaCertificationEventWorkshopService.getQACertEvents', async () => {
      const spyService = jest.spyOn(service, 'getQACertEvents');
      const result = await controller.getQACertEvents('1');
      expect(result).toEqual([qaCertEvent]);
      expect(spyService).toHaveBeenCalled();
    });
  });

  describe('getQACertEvent', () => {
    it('should call the QaCertificationEventWorkshopService.getQACertEvent', async () => {
      const spyService = jest.spyOn(service, 'getQACertEvent');
      const result = await controller.getQACertEvent('1', '1');
      expect(result).toEqual(qaCertEvent);
      expect(spyService).toHaveBeenCalled();
    });
  });

  describe('createQACertEvent', () => {
    it('Call the service createQAEvent', async () => {
      const result = await controller.createQACertEvent(
        locationId,
        payload,
        user,
      );
      expect(result).toEqual(qaCertEvent);
    });
  });

  describe('deleteQACertEvent', () => {
    it('should delete QA Certification Event record', async () => {
      const spyService = jest.spyOn(service, 'deleteQACertEvent');
      const result = await controller.deleteTestExtensionExemption(
        '1',
        '1',
        user,
      );
      expect(result).toEqual('');
      expect(spyService).toHaveBeenCalled();
    });
  });
});
