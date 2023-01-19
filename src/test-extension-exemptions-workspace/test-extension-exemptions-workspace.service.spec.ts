import { InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ComponentWorkspaceRepository } from '../component-workspace/component.repository';
import {
  TestExtensionExemptionBaseDTO,
  TestExtensionExemptionRecordDTO,
} from '../dto/test-extension-exemption.dto';
import { Component } from '../entities/workspace/component.entity';
import { MonitorLocation } from '../entities/workspace/monitor-location.entity';
import { MonitorSystem } from '../entities/workspace/monitor-system.entity';
import { ReportingPeriod } from '../entities/workspace/reporting-period.entity';
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

const locationId = '121';
const payload = new TestExtensionExemptionBaseDTO();
payload.unitId = '1';
payload.stackPipeId = '1';
const userId = 'testuser';
const testExtensionExemptionId = 'testExtensionExemptionId';

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

const entity = new TestExtensionExemption();
const dto = new TestExtensionExemptionRecordDTO();

const mockRepository = () => ({
  getTestExtensionExemptionById: jest.fn().mockResolvedValue(entity),
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
          provide: MonitorSystemRepository,
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
    repository = module.get(TestExtensionExemptionsWorkspaceRepository);
    unitRepository = module.get(UnitRepository);
    stackPipeRepository = module.get(StackPipeRepository);
    locationRepository = module.get(MonitorLocationRepository);
  });

  describe('createTestExtensionExemption', () => {
    it('should call the createTestExtensionExemption and create test summariy', async () => {
      jest.spyOn(service, 'lookupValues').mockResolvedValue([]);

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

    it('should call the createTestExtensionExemption and create test summariy with historicalRecordId', async () => {
      jest.spyOn(service, 'lookupValues').mockResolvedValue([]);

      jest
        .spyOn(repository, 'getTestExtensionExemptionById')
        .mockResolvedValue(entity);

      const result = await service.createTestExtensionExemption(
        locationId,
        payload,
        userId,
        'historicalRecordId',
      );

      expect(result).toEqual(dto);
    });

    it('should call the createTestExtensionExemption and throw error if Unit does not match', async () => {
      jest.spyOn(service, 'lookupValues').mockResolvedValue([]);

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
  });

  describe('deleteExtensionExemption', () => {
    it('should call the deleteExtensionExemption and delete test extension exemption', async () => {
      const result = await service.deleteTestExtensionExemption(testExtensionExemptionId);

      expect(result).toEqual(undefined);
    });

    it('should call the deleteTestSummary and throw error while deleting test summariy', async () => {
      jest
        .spyOn(repository, 'delete')
        .mockRejectedValue(new InternalServerErrorException());

      let errored = false;

      try {
        await service.deleteTestExtensionExemption(testExtensionExemptionId);
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

      expect(result).toEqual([1, '1', '1']);
    });
  });
});
