import { Test, TestingModule } from '@nestjs/testing';

import { QaCertificationEventWorkshopService } from './qa-certification-event-workshop.service';
import { QACertificationEventWorkspaceRepository } from './qa-certification-event-workshop.repository';
import { MonitorLocationRepository } from '../monitor-location/monitor-location.repository';
import { UnitRepository } from '../unit/unit.repository';
import { StackPipeRepository } from '../stack-pipe/stack-pipe.repository';
import { ComponentWorkspaceRepository } from '../component-workspace/component.repository';
import { MonitorSystemWorkspaceRepository } from '../monitor-system-workspace/monitor-system-workspace.repository';
import {
  QACertificationEventBaseDTO,
  QACertificationEventDTO,
} from '../dto/qa-certification-event.dto';
import { QACertificationEventMap } from '../maps/qa-certification-event.map';

const locationId = '';
const payload = new QACertificationEventBaseDTO();
const usersId = '';
const qaCertEvent = new QACertificationEventDTO();

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue([qaCertEvent]),
  create: jest.fn().mockResolvedValue(qaCertEvent),
  save: jest.fn().mockResolvedValue(qaCertEvent),
  findOne: jest.fn().mockResolvedValue(qaCertEvent),
});

const mockMonitorLocationRepository = () => ({
  findOne: jest.fn().mockResolvedValue({}),
});

const mockUnitRepository = () => ({
  findOne: jest.fn().mockResolvedValue({}),
});

const mockStackPipeRepository = () => ({
  findOne: jest.fn().mockResolvedValue({}),
});

const mockComponentRepository = () => ({
  findOne: jest.fn().mockResolvedValue({}),
});

const mockMonitoringSystemRepository = () => ({
  findOne: jest.fn().mockResolvedValue({}),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(qaCertEvent),
  many: jest.fn().mockResolvedValue([qaCertEvent]),
});

describe('QaCertificationEventWorkshopService', () => {
  let service: QaCertificationEventWorkshopService;
  let repository: QACertificationEventWorkspaceRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QaCertificationEventWorkshopService,
        {
          provide: QACertificationEventMap,
          useFactory: mockMap,
        },
        {
          provide: QACertificationEventWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: MonitorLocationRepository,
          useFactory: mockMonitorLocationRepository,
        },
        {
          provide: UnitRepository,
          useFactory: mockUnitRepository,
        },
        {
          provide: StackPipeRepository,
          useFactory: mockStackPipeRepository,
        },
        {
          provide: ComponentWorkspaceRepository,
          useFactory: mockComponentRepository,
        },
        {
          provide: MonitorSystemWorkspaceRepository,
          useFactory: mockMonitoringSystemRepository,
        },
      ],
    }).compile();

    service = module.get<QaCertificationEventWorkshopService>(
      QaCertificationEventWorkshopService,
    );
    repository = module.get<QACertificationEventWorkspaceRepository>(
      QACertificationEventWorkspaceRepository,
    );
  });

  describe('createQAEventCert', () => {
    it('calls the repository.create() and inserts a QA Certification Event', async () => {
      const result = await service.createQACertEvent(
        locationId,
        payload,
        usersId,
      );
      expect(result).toEqual(qaCertEvent);
      expect(repository.create).toHaveBeenCalled();
    });
  });
});
