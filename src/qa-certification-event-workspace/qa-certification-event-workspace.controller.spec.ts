import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';
import { DataSource } from 'typeorm';

import {
  QACertificationEventBaseDTO,
  QACertificationEventDTO,
} from '../dto/qa-certification-event.dto';
import { QACertificationEventChecksService } from './qa-certification-event-checks.service';
import { QACertificationEventWorkspaceController } from './qa-certification-event-workspace.controller';
import { QACertificationEventWorkspaceService } from './qa-certification-event-workspace.service';

const locationId = '';
const payload = new QACertificationEventBaseDTO();
const qaCertEvent = new QACertificationEventDTO();

const user: CurrentUser = {
  userId: 'testUser',
  sessionId: '',
  expiration: '',
  clientIp: '',
  facilities: [],
  roles: [],
};

const mockChecksService = () => ({
  runChecks: jest.fn().mockResolvedValue([]),
});

const mockService = () => ({
  createQACertEvent: jest.fn().mockResolvedValue(qaCertEvent),
  getQACertEvent: jest.fn().mockResolvedValue(qaCertEvent),
  getQACertEventsByLocationId: jest.fn().mockResolvedValue([qaCertEvent]),
  deleteQACertEvent: jest.fn().mockResolvedValue(''),
});

describe('QACertificationEventWorkspaceController', () => {
  let controller: QACertificationEventWorkspaceController;
  let service: QACertificationEventWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [QACertificationEventWorkspaceController],
      providers: [
        ConfigService,
        AuthGuard,
        {
          provide: DataSource,
          useValue: {},
        },
        {
          provide: QACertificationEventWorkspaceService,
          useFactory: mockService,
        },
        {
          provide: QACertificationEventChecksService,
          useFactory: mockChecksService,
        },
      ],
    }).compile();

    controller = module.get<QACertificationEventWorkspaceController>(
      QACertificationEventWorkspaceController,
    );
    service = module.get(QACertificationEventWorkspaceService);
  });

  describe('getQACertEventsByLocationId', () => {
    it('should call the QACertificationEventWorkspaceService.getQACertEvents', async () => {
      const spyService = jest.spyOn(service, 'getQACertEventsByLocationId');
      const result = await controller.getQACertEvents('1');
      expect(result).toEqual([qaCertEvent]);
      expect(spyService).toHaveBeenCalled();
    });
  });

  describe('getQACertEvent', () => {
    it('should call the QACertificationEventWorkspaceService.getQACertEvent', async () => {
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
