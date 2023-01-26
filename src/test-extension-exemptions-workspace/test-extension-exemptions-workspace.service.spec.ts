import { InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ComponentWorkspaceRepository } from '../component-workspace/component.repository';
import {
  TestExtensionExemptionBaseDTO,
  TestExtensionExemptionDTO,
  TestExtensionExemptionRecordDTO,
} from '../dto/test-extension-exemption.dto';
import { Component } from '../entities/workspace/component.entity';
import { MonitorLocation } from '../entities/workspace/monitor-location.entity';
import { MonitorSystem } from '../entities/workspace/monitor-system.entity';
import { ReportingPeriod } from '../entities/reporting-period.entity';
import { StackPipe } from '../entities/workspace/stack-pipe.entity';
import { TestExtensionExemption } from '../entities/workspace/test-extension-exemption.entity';
import { Unit } from '../entities/workspace/unit.entity';
import { TestExtensionExemptionMap } from '../maps/test-extension-exemption.map';
import { MonitorLocationRepository } from '../monitor-location/monitor-location.repository';
import { MonitorSystemRepository } from '../monitor-system/monitor-system.repository';
import { ReportingPeriodRepository } from '../reporting-period/reporting-period.repository';
import { StackPipeRepository } from '../stack-pipe/stack-pipe.repository';
import { UnitRepository } from '../unit/unit.repository';
import { TestExtensionExemptionsWorkspaceRepository } from './test-extension-exemptions-workspace.repository';
import { TestExtensionExemptionsWorkspaceService } from './test-extension-exemptions-workspace.service';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { MonitorSystemWorkspaceRepository } from '../monitor-system-workspace/monitor-system-workspace.repository';

const locationId = '121';
const testExtExpId = '1';
const facilityId = 1;
const unitId = '121';
const payload = new TestExtensionExemptionBaseDTO();
payload.unitId = '1';
payload.stackPipeId = '1';
const userId = 'testuser';

const unit = new Unit();
unit.name = '1';
const stackPipe = new StackPipe();
stackPipe.name = '1';
const rp = new ReportingPeriod();
rp.id = 1;
const ms = new MonitorSystem();
ms.id = '1';
const comp = new Component();
comp.id = '1';
const lookupValuesResult = {
  reportPeriodId: 1,
  monitoringSystemRecordId: '1',
  componentRecordId: '1',
};

const entity = new TestExtensionExemption();
const dto = new TestExtensionExemptionRecordDTO();
const testExtensionExemptionDTO = new TestExtensionExemptionDTO();

const mockRepository = () => ({
  getTestExtensionExemptionById: jest.fn().mockResolvedValue(entity),
  getTestExtensionExemptionsByLocationId: jest.fn().mockResolvedValue([entity]),
  getTestExtensionsByUnitStack: jest.fn().mockResolvedValue([entity]),
  delete: jest.fn().mockResolvedValue(null),
  findOne: jest.fn().mockResolvedValue(entity),
  create: jest.fn().mockResolvedValue(entity),
  save: jest.fn().mockResolvedValue(entity),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(dto),
  many: jest.fn().mockResolvedValue([dto]),
});

describe('TestExtensionExemptionsWorkspaceService', () => {
  let service: TestExtensionExemptionsWorkspaceService;
  let repository: TestExtensionExemptionsWorkspaceRepository;
  let unitRepository: UnitRepository;
  let stackPipeRepository: StackPipeRepository;
  let locationRepository: MonitorLocationRepository;
  let componentRepository: ComponentWorkspaceRepository;
  let monSysRepository: MonitorSystemWorkspaceRepository;
  let reportingPeriodRepository: ReportingPeriodRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        TestExtensionExemptionsWorkspaceService,
        {
          provide: TestExtensionExemptionMap,
          useFactory: mockMap,
        },
        {
          provide: TestExtensionExemptionsWorkspaceRepository,
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
          provide: ReportingPeriodRepository,
          useFactory: () => ({
            findOne: jest.fn().mockResolvedValue(rp),
          }),
        },
        {
          provide: MonitorSystemWorkspaceRepository,
          useFactory: () => ({
            findOne: jest.fn().mockResolvedValue(ms),
          }),
        },
        {
          provide: ComponentWorkspaceRepository,
          useFactory: () => ({
            findOne: jest.fn().mockResolvedValue(comp),
          }),
        },
      ],
    }).compile();

    service = module.get<TestExtensionExemptionsWorkspaceService>(
      TestExtensionExemptionsWorkspaceService,
    );
    repository = module.get<TestExtensionExemptionsWorkspaceRepository>(
      TestExtensionExemptionsWorkspaceRepository,
    );
    unitRepository = module.get<UnitRepository>(UnitRepository);
    stackPipeRepository = module.get<StackPipeRepository>(StackPipeRepository);
    locationRepository = module.get<MonitorLocationRepository>(
      MonitorLocationRepository,
    );
    componentRepository = module.get<ComponentWorkspaceRepository>(
      ComponentWorkspaceRepository,
    );
    monSysRepository = module.get<MonitorSystemWorkspaceRepository>(
      MonitorSystemWorkspaceRepository,
    );
    reportingPeriodRepository = module.get<ReportingPeriodRepository>(
      ReportingPeriodRepository,
    );
  });

  describe('getTestExtensionExemptionById', () => {
    it('calls the repository.getTestExtensionExemptionById() and get Test Extension Exemption by id', async () => {
      const result = await service.getTestExtensionExemptionById(testExtExpId);
      expect(result).toEqual(dto);
    });

    it('should throw error when Test Extension Exemption not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);

      let errored = false;

      try {
        await service.getTestExtensionExemptionById(testExtExpId);
      } catch (err) {
        errored = true;
      }

      expect(errored).toBe(true);
    });
  });

  describe('getTestExtensionExemptionsByLocationId', () => {
    it('calls the repository.getTestExtensionExemptionsByLocationId() and get Test Extension Exemptions by locationId', async () => {
      const result = await service.getTestExtensionExemptionsByLocationId(
        locationId,
      );
      expect(result).toEqual([dto]);
    });
  });

  describe('createTestExtensionExemption', () => {
    it('should call the createTestExtensionExemption and create test extension', async () => {
      jest.spyOn(service, 'lookupValues').mockResolvedValue(lookupValuesResult);

      jest
        .spyOn(repository, 'getTestExtensionExemptionById')
        .mockResolvedValue(entity);

      const result = await service.createTestExtensionExemption(
        locationId,
        payload,
        userId,
      );

      expect(result).toEqual(testExtensionExemptionDTO);
    });

    it('should call the createTestExtensionExemption and create test extension with historicalRecordId', async () => {
      jest.spyOn(service, 'lookupValues').mockResolvedValue(lookupValuesResult);

      jest
        .spyOn(repository, 'getTestExtensionExemptionById')
        .mockResolvedValue(entity);

      const result = await service.createTestExtensionExemption(
        locationId,
        payload,
        userId,
      );

      expect(result).toEqual(dto);
    });

    it('should call the createTestExtensionExemption and throw error if Unit does not match', async () => {
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
        await service.createTestExtensionExemption(locationId, payload, userId);
      } catch (err) {
        errored = true;
      }

      expect(errored).toBe(true);
    });
    it('should call the createTestExtensionExemption and throw error if StackPipe does not match', async () => {
      jest.spyOn(service, 'lookupValues').mockResolvedValue(lookupValuesResult);

      const pipe = new StackPipe();
      pipe.name = '101';
      const loc = new MonitorLocation();
      loc.stackPipeId = '11';

      jest.spyOn(unitRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(stackPipeRepository, 'findOne').mockResolvedValue(pipe);
      jest.spyOn(locationRepository, 'findOne').mockResolvedValue(loc);

      let errored = false;

      try {
        await service.createTestExtensionExemption(locationId, payload, userId);
      } catch (err) {
        errored = true;
      }

      expect(errored).toBe(true);
    });
  });

  describe('updateTestExtensionExemption', () => {
    it('should call the updateTestExtensionExemption and update Test Extension Exemption', async () => {
      jest.spyOn(service, 'lookupValues').mockResolvedValue(lookupValuesResult);
      jest.spyOn(repository, 'findOne').mockResolvedValue(entity);

      const result = await service.updateTestExtensionExemption(
        locationId,
        testExtExpId,
        payload,
        userId,
      );

      expect(result).toEqual(dto);
    });

    it('should call updateTestExtensionExemption and throw error while Test Extension Exemption not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);

      let errored = false;

      try {
        await service.updateTestExtensionExemption(
          locationId,
          testExtExpId,
          payload,
          userId,
        );
      } catch (err) {
        errored = true;
      }

      expect(errored).toBe(true);
    });
  });

  describe('deleteExtensionExemption', () => {
    it('should call the deleteExtensionExemption and delete test extension exemption', async () => {
      const result = await service.deleteTestExtensionExemption(testExtExpId);

      expect(result).toEqual(undefined);
    });

    it('should call the deleteTestExtensionExemption and throw error while deleting test Extension Exemption', async () => {
      jest
        .spyOn(repository, 'delete')
        .mockRejectedValue(new InternalServerErrorException());

      let errored = false;

      try {
        await service.deleteTestExtensionExemption(testExtExpId);
      } catch (err) {
        errored = true;
      }

      expect(errored).toBe(true);
    });
  });

  describe('lookupValues', () => {
    it('should return reportPeriodId, componentRecordId, monitorSystemRecordId', async () => {
      payload.year = 2022;
      payload.quarter = 1;
      payload.componentID = '1';
      payload.monitoringSystemID = 'abc';

      const result = await service.lookupValues(locationId, payload);

      expect(result).toEqual({
        componentRecordId: '1',
        monitoringSystemRecordId: '1',
        reportPeriodId: 1,
      });
    });
    it('should return componentID, monitoringSystemID, and reportingPeriodId as null value', async () => {
      payload.year = 2022;
      payload.quarter = 1;
      payload.componentID = '1';
      payload.monitoringSystemID = 'abc';

      jest.spyOn(componentRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(monSysRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(reportingPeriodRepository, 'findOne').mockResolvedValue(null);

      const result = await service.lookupValues(locationId, payload);

      expect(result).toEqual({
        componentRecordId: null,
        monitoringSystemRecordId: null,
        reportPeriodId: null,
      });
    });
  });

  describe('getTestExtensions', () => {
    it('calls the repository.getTestExtensionsByUnitStack() and get QA Test Extension Exemption by locationId', async () => {
      const result = await service.getTestExtensions(facilityId, [unitId]);
      expect(result).toEqual([dto]);
    });
  });

  describe('export', () => {
    it('calls the repository.getTestExtensionsByUnitStack() and get QA Test Extension Exemption by locationId', async () => {
      const returnedSummary = dto;
      returnedSummary.id = testExtExpId;

      const spySummaries = jest
        .spyOn(service, 'getTestExtensions')
        .mockResolvedValue([returnedSummary]);

      const result = await service.export(facilityId, [unitId]);

      expect(spySummaries).toHaveBeenCalled();
      expect(result).toEqual([dto]);
    });
  });

  describe('import', () => {
    it('Should create QA Test Extension Exemption ', async () => {
      const importPayload = payload;
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      const result = await service.import(locationId, importPayload, userId);

      expect(result).toEqual(null);
    });

    it('Should update QA Test Extension Exemption ', async () => {
      entity.id = '1';

      jest.spyOn(repository, 'findOne').mockResolvedValue(entity);

      const importPayload = payload;

      const result = await service.import(locationId, importPayload, userId);

      expect(result).toEqual(null);
    });
  });
});
