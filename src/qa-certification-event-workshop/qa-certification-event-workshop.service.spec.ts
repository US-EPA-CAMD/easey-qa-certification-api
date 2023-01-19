import { Test, TestingModule } from '@nestjs/testing';

import { QaCertificationEventWorkshopService } from './qa-certification-event-workshop.service';
import { QACertificationEventWorkspaceRepository } from './qa-certification-event-workshop.repository';
import { MonitorLocationRepository } from '../monitor-location/monitor-location.repository';
import { StackPipeRepository } from '../stack-pipe/stack-pipe.repository';
import { ComponentWorkspaceRepository } from '../component-workspace/component.repository';
import { MonitorSystemWorkspaceRepository } from '../monitor-system-workspace/monitor-system-workspace.repository';
import {
  QACertificationEventBaseDTO,
  QACertificationEventDTO,
} from '../dto/qa-certification-event.dto';
import { QACertificationEventMap } from '../maps/qa-certification-event.map';
import { QACertificationEvent } from '../entities/workspace/qa-certification-event.entity';
import { Unit } from '../entities/workspace/unit.entity';
import { UnitRepository } from '../unit/unit.repository';
import { StackPipe } from '../entities/workspace/stack-pipe.entity';
import { MonitorLocation } from '../entities/workspace/monitor-location.entity';
import { Component } from '../entities/workspace/component.entity';
import { MonitorSystem } from '../entities/workspace/monitor-system.entity';

const locationId = '';
const qaCertEventId = '';
const payload = new QACertificationEventBaseDTO();
const usersId = '';
const entity = new QACertificationEvent();
const qaCertEventDTO = new QACertificationEventDTO();

const unit = new Unit();
unit.name = '1';
const stackPipe = new StackPipe();
stackPipe.name = '1';

const mockRepository = () => ({
  find: jest.fn().mockResolvedValue([entity]),
  findOne: jest.fn().mockResolvedValue(entity),
  create: jest.fn().mockResolvedValue(entity),
  save: jest.fn().mockResolvedValue(entity),
  delete: jest.fn().mockResolvedValue(null),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(qaCertEventDTO),
  many: jest.fn().mockResolvedValue([qaCertEventDTO]),
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
          useFactory: () => ({
            findOne: jest.fn().mockResolvedValue(new MonitorLocation()),
          }),
        },
        {
          provide: UnitRepository,
          useFactory: () => ({
            findOne: jest.fn().mockResolvedValue(unit),
          }),
        },
        {
          provide: StackPipeRepository,
          useFactory: () => ({
            findOne: jest.fn().mockResolvedValue(new StackPipe()),
          }),
        },
        {
          provide: ComponentWorkspaceRepository,
          useFactory: () => ({
            findOne: jest.fn().mockResolvedValue(new Component()),
          }),
        },
        {
          provide: MonitorSystemWorkspaceRepository,
          useFactory: () => ({
            findOne: jest.fn().mockResolvedValue(new MonitorSystem()),
          }),
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
      expect(result).toEqual(qaCertEventDTO);
      expect(repository.create).toHaveBeenCalled();
    });
  });

  describe('getCertEvent', () => {
    it('calls the repository.findOne() and get QA Certification Event by id', async () => {
      const result = await service.getQACertEvent(qaCertEventId);
      expect(result).toEqual(qaCertEventDTO);
    });

    it('should throw error when QA Certification Event not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      let errored = false;

      try {
        await service.getQACertEvent(qaCertEventId);
      } catch (err) {
        errored = true;
      }

      expect(errored).toBe(true);
    });
  });

  describe('getQACertEvents', () => {
    it('calls the repository.getQACertEvents() and get test Extension Exemptions by locationId', async () => {
      const result = await service.getQACertEvents(locationId);
      expect(result).toEqual([qaCertEventDTO]);
    });
  });
});
