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
});

describe('QaCertificationEventWorkshopController', () => {
  let controller: QaCertificationEventWorkshopController;

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
});
