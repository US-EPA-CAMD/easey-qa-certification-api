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
import { InternalServerErrorException } from '@nestjs/common';

const locationId = '';
const qaCertEventId = '';
const facilityId = 1;
const unitId = '121';
const payload = new QACertificationEventBaseDTO();
payload.unitId = '1';
payload.stackPipeId = '1';
const userId = '';
const entity = new QACertificationEvent();
const qaCertEventDTO = new QACertificationEventDTO();

const unit = new Unit();
unit.name = '1';
const stackPipe = new StackPipe();
stackPipe.name = '1';
const monitoringSystem = new MonitorSystem();
monitoringSystem.id = '1';
const component = new Component();
component.id = '1';
const lookupValuesResult = {
  componentID: '1',
  monitoringSystemID: '1',
};

const mockRepository = () => ({
  getQaCertEventsByUnitStack: jest.fn().mockResolvedValue([entity]),
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
  let unitRepository: UnitRepository;
  let stackPipeRepository: StackPipeRepository;
  let locationRepository: MonitorLocationRepository;

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
            findOne: jest.fn().mockResolvedValue(stackPipe),
          }),
        },
        {
          provide: ComponentWorkspaceRepository,
          useFactory: () => ({
            findOne: jest.fn().mockResolvedValue(component),
          }),
        },
        {
          provide: MonitorSystemWorkspaceRepository,
          useFactory: () => ({
            findOne: jest.fn().mockResolvedValue(monitoringSystem),
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
    unitRepository = module.get<UnitRepository>(UnitRepository);
    stackPipeRepository = module.get<StackPipeRepository>(StackPipeRepository);
    locationRepository = module.get<MonitorLocationRepository>(
      MonitorLocationRepository,
    );
  });

  describe('createQAEventCert', () => {
    it('calls the createQACertEvent and inserts a QA Certification Event', async () => {
      jest.spyOn(service, 'lookupValues').mockResolvedValue(lookupValuesResult);

      const result = await service.createQACertEvent(
        locationId,
        payload,
        userId,
      );
      expect(result).toEqual(qaCertEventDTO);
    });

    it('should call the createQACertEvent and create QA Certification Event with historicalRecordId', async () => {
      jest.spyOn(service, 'lookupValues').mockResolvedValue(lookupValuesResult);

      jest.spyOn(repository, 'findOne').mockResolvedValue(entity);

      const result = await service.createQACertEvent(
        locationId,
        payload,
        userId,
        'historicalRecordId',
      );

      expect(result).toEqual(qaCertEventDTO);
    });

    it('should call the createQACertEvent and throw error if Unit does not match', async () => {
      jest.spyOn(service, 'lookupValues').mockResolvedValue(lookupValuesResult);

      const pipe = new StackPipe();
      pipe.name = '101';
      const unit = new Unit();
      unit.name = '101';
      const loc = new MonitorLocation();
      loc.unitId = '11';

      jest.spyOn(unitRepository, 'findOne').mockResolvedValue(unit);
      jest.spyOn(stackPipeRepository, 'findOne').mockResolvedValue(stackPipe);
      jest.spyOn(locationRepository, 'findOne').mockResolvedValue(loc);

      let errored = false;

      try {
        await service.createQACertEvent(locationId, payload, userId);
      } catch (err) {
        errored = true;
      }

      expect(errored).toBe(true);
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

  describe('getQACertEventsByLocationId', () => {
    it('calls the repository.find() and gets QA Certification Events by locationId', async () => {
      const result = await service.getQACertEventsByLocationId(locationId);
      expect(result).toEqual([qaCertEventDTO]);
    });
  });

  describe('deleteQACertEvent', () => {
    it('should call the repository.delete() and deletes QA Certification Event', async () => {
      const result = await service.deleteQACertEvent(qaCertEventId);

      expect(result).toEqual(undefined);
    });

    it('should call the deleteQACertEvent and throw error while deleting QA Certification Event record', async () => {
      jest
        .spyOn(repository, 'delete')
        .mockRejectedValue(new InternalServerErrorException());

      let errored = false;

      try {
        await service.deleteQACertEvent(qaCertEventId);
      } catch (err) {
        errored = true;
      }

      expect(errored).toBe(true);
    });
  });

  describe('lookupValues', () => {
    it('should return componentID, monitoringSystemID', async () => {
      payload.componentID = '1';
      payload.monitoringSystemID = 'abc';

      const result = await service.lookupValues(locationId, payload);

      expect(result).toEqual({
        componentID: '1',
        monitoringSystemID: '1',
      });
    });
  });

  describe('getQACertEvents', () => {
    it('calls the repository.getQACertEventsByUnitStack() and get qa certification events by locationId', async () => {
      const result = await service.getQACertEvents(facilityId, [unitId]);
      expect(result).toEqual([qaCertEventDTO]);
    });
  });

  describe('export', () => {
    it('calls the repository.getQACertEventsByUnitStack() and get qa certification events by locationId', async () => {
      const returnedSummary = qaCertEventDTO;
      returnedSummary.id = qaCertEventId;

      const spySummaries = jest
        .spyOn(service, 'getQACertEvents')
        .mockResolvedValue([returnedSummary]);

      const result = await service.export(facilityId, [unitId]);

      expect(spySummaries).toHaveBeenCalled();
      expect(result).toEqual([qaCertEventDTO]);
    });
  });
});
