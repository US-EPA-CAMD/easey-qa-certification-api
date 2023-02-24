import { Test, TestingModule } from '@nestjs/testing';

import { QACertificationEventWorkspaceService } from './qa-certification-event-workspace.service';
import { QACertificationEventWorkspaceRepository } from './qa-certification-event-workspace.repository';
import { MonitorLocationRepository } from '../monitor-location/monitor-location.repository';
import { ComponentWorkspaceRepository } from '../component-workspace/component.repository';
import { MonitorSystemWorkspaceRepository } from '../monitor-system-workspace/monitor-system-workspace.repository';
import {
  QACertificationEventBaseDTO,
  QACertificationEventDTO,
} from '../dto/qa-certification-event.dto';
import { QACertificationEventMap } from '../maps/qa-certification-event.map';
import { QACertificationEvent } from '../entities/workspace/qa-certification-event.entity';
import { Unit } from '../entities/workspace/unit.entity';
import { StackPipe } from '../entities/workspace/stack-pipe.entity';
import { MonitorLocation } from '../entities/workspace/monitor-location.entity';
import { Component } from '../entities/workspace/component.entity';
import { MonitorSystem } from '../entities/workspace/monitor-system.entity';
import { InternalServerErrorException } from '@nestjs/common';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

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

const monLoc = new MonitorLocation();
const unit = new Unit();
unit.name = '1';
const stackPipe = new StackPipe();
stackPipe.name = '1';
monLoc.unit = unit;
monLoc.stackPipe = stackPipe;
const monitoringSystem = new MonitorSystem();
monitoringSystem.id = '1';
const component = new Component();
component.id = '1';
const lookupValuesResult = {
  componentRecordId: '1',
  monitoringSystemRecordId: '1',
};

const mockRepository = () => ({
  getQaCertEventsByUnitStack: jest.fn().mockResolvedValue([entity]),
  getQACertificationEventsByLocationId: jest.fn().mockResolvedValue([entity]),
  getQACertificationEventById: jest.fn().mockResolvedValue(entity),
  findOne: jest.fn().mockResolvedValue(entity),
  create: jest.fn().mockResolvedValue(entity),
  save: jest.fn().mockResolvedValue(entity),
  delete: jest.fn().mockResolvedValue(null),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(qaCertEventDTO),
  many: jest.fn().mockResolvedValue([qaCertEventDTO]),
});

describe('QACertificationEventWorkspaceService', () => {
  let service: QACertificationEventWorkspaceService;
  let repository: QACertificationEventWorkspaceRepository;
  let locationRepository: MonitorLocationRepository;
  let componentRepository: ComponentWorkspaceRepository;
  let monSysRepository: MonitorSystemWorkspaceRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        QACertificationEventWorkspaceService,
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
            findOne: jest.fn().mockResolvedValue(monLoc),
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

    service = module.get<QACertificationEventWorkspaceService>(
      QACertificationEventWorkspaceService,
    );
    repository = module.get<QACertificationEventWorkspaceRepository>(
      QACertificationEventWorkspaceRepository,
    );
    locationRepository = module.get<MonitorLocationRepository>(
      MonitorLocationRepository,
    );
    componentRepository = module.get<ComponentWorkspaceRepository>(
      ComponentWorkspaceRepository,
    );
    monSysRepository = module.get<MonitorSystemWorkspaceRepository>(
      MonitorSystemWorkspaceRepository,
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

    it('should call the createQACertEvent and create QA Certification Event with stackPipeId', async () => {
      jest.spyOn(service, 'lookupValues').mockResolvedValue(lookupValuesResult);

      const loc = new MonitorLocation();
      loc.stackPipe = new StackPipe();
      loc.stackPipeId = '1';
      loc.stackPipe.name = '1';

      jest.spyOn(locationRepository, 'findOne').mockResolvedValue(loc);

      const result = await service.createQACertEvent(
        locationId,
        payload,
        userId,
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
      loc.unit = unit;
      loc.stackPipe = pipe;

      jest.spyOn(locationRepository, 'findOne').mockResolvedValue(loc);

      let errored = false;

      try {
        await service.createQACertEvent(locationId, payload, userId);
      } catch (err) {
        errored = true;
      }

      expect(errored).toBe(true);
    });

    it('should call the createQACertEvent and throw error if StackPipe does not match', async () => {
      jest.spyOn(service, 'lookupValues').mockResolvedValue(lookupValuesResult);

      const pipe = new StackPipe();
      pipe.name = '101';
      const loc = new MonitorLocation();
      loc.stackPipe = pipe;

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
    it('calls the repository.getQACertEventById() and get QA Certification Event by id', async () => {
      const result = await service.getQACertEvent(qaCertEventId);
      expect(result).toEqual(qaCertEventDTO);
    });

    it('should throw error when QA Certification Event not found', async () => {
      jest
        .spyOn(repository, 'getQACertificationEventById')
        .mockResolvedValue(null);

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
        componentRecordId: '1',
        monitoringSystemRecordId: '1',
      });
    });

    it('should return componentID, monitoringSystemID as null value', async () => {
      payload.componentID = '1';
      payload.monitoringSystemID = 'abc';

      jest.spyOn(componentRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(monSysRepository, 'findOne').mockResolvedValue(null);

      const result = await service.lookupValues(locationId, payload);

      expect(result).toEqual({
        componentRecordId: null,
        monitoringSystemRecordId: null,
      });
    });
  });

  describe('getQACertEvents', () => {
    it('calls the repository.getQACertEventsByUnitStack() and get qa certification events by locationId', async () => {
      const result = await service.getQACertEvents(facilityId, [unitId]);
      expect(result).toEqual([qaCertEventDTO]);
    });
  });

  describe('updateQACertEvent', () => {
    it('should update a QA Certification Event record', async () => {
      const result = await service.updateQACertEvent(
        locationId,
        qaCertEventId,
        payload,
        userId,
      );

      expect(result).toEqual(qaCertEventDTO);
    });

    it('should throw an error while updating a QA Certification Event record', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);

      let errored = false;

      try {
        await service.updateQACertEvent(
          locationId,
          qaCertEventId,
          payload,
          userId,
        );
      } catch (e) {
        errored = true;
      }

      expect(errored).toEqual(true);
    });
  });

  describe('export', () => {
    it('calls the repository.getQACertEventsByUnitStack() and get qa certification events by locationId', async () => {
      const returnedQaCertEvent = qaCertEventDTO;
      returnedQaCertEvent.id = qaCertEventId;

      const spySummaries = jest
        .spyOn(service, 'getQACertEvents')
        .mockResolvedValue([returnedQaCertEvent]);

      const result = await service.export(facilityId, [unitId]);

      expect(spySummaries).toHaveBeenCalled();
      expect(result).toEqual([qaCertEventDTO]);
    });
  });

  describe('import', () => {
    it('Should create QA Cert Event ', async () => {
      const importPayload = payload;
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      const result = await service.import(locationId, importPayload, userId);

      expect(result).toEqual(null);
    });

    it('Should update QA Cert Event ', async () => {
      entity.id = '1';

      jest.spyOn(repository, 'findOne').mockResolvedValue(entity);

      const importPayload = payload;

      const result = await service.import(locationId, importPayload, userId);

      expect(result).toEqual(null);
    });
  });
});
