import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { StackPipe } from '../entities/workspace/stack-pipe.entity';
import { MonitorLocation } from '../entities/workspace/monitor-location.entity';
import { Unit } from '../entities/workspace/unit.entity';
import { LocationIdentifiers } from '../interfaces/location-identifiers.interface';
import { LocationChecksService } from './location-checks.service';
import { LocationWorkspaceRepository } from './location.repository';
import { MonitorSystem } from '../entities/workspace/monitor-system.entity';
import { Component } from '../entities/workspace/component.entity';

describe('location checks service tests', () => {
  let service: LocationChecksService;
  let repository: any;

  const mockRepository = () => ({
    getLocationsByUnitStackPipeIds: jest.fn(),
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        LocationChecksService,
        {
          provide: LocationWorkspaceRepository,
          useFactory: mockRepository,
        },
      ],
    }).compile();

    service = module.get(LocationChecksService);
    repository = module.get(LocationWorkspaceRepository);
  });

  describe('runChecks tests', () => {
    const baseLocations: LocationIdentifiers[] = [
      {
        unitId: '51',
        locationId: '1',
        stackPipeId: null,
        systemIDs: ['1', '2'],
        componentIDs: ['3', '4'],
      },
    ];

    it('returns a response successfully', async () => {
      repository.getLocationsByUnitStackPipeIds.mockResolvedValue([]);
      const facilityId = 1;

      const result = await service.runChecks(facilityId, baseLocations);
      expect(result).not.toBeNull();
      expect(result[0]).toBe(baseLocations);
      expect(result[1]).toEqual([
        `The database does not contain Unit [${baseLocations[0].unitId}] for Facility [${facilityId}]`,
      ]);
    });

    it('IMPORT-13: Tests stack/pipe prefix', async () => {
      const facilityId = 1;
      repository.getLocationsByUnitStackPipeIds.mockResolvedValue([]);

      const locations = [{ ...baseLocations[0] }];
      locations[0].unitId = 'CS51';

      const result = await service.runChecks(facilityId, locations);

      expect(result[1]).toEqual([
        `The following Stack/Pipe was misidentified as a unit [${locations[0].unitId}]`,
      ]);
    });

    it('IMPORT-13: Tests error message when database does not contain unit data for the facility', async () => {
      const mockedMonitorLoc = new MonitorLocation();
      mockedMonitorLoc.unit = new Unit();
      mockedMonitorLoc.unit.name = '52';

      const facilityId = 1;
      repository.getLocationsByUnitStackPipeIds.mockResolvedValue([
        mockedMonitorLoc,
      ]);
      const result = await service.runChecks(facilityId, baseLocations);

      expect(result[1]).toEqual([
        `The database does not contain Unit [${baseLocations[0].unitId}] for Facility [${facilityId}]`,
      ]);
    });

    it('IMPORT-13: Tests error message when database does not contain Stack/Pipe data for the facility', async () => {
      const mockedMonitorLoc = new MonitorLocation();
      mockedMonitorLoc.stackPipe = new StackPipe();
      mockedMonitorLoc.stackPipe.name = 'sp52';

      const location: LocationIdentifiers[] = [
        { ...baseLocations[0], stackPipeId: 'sp53', unitId: null },
      ];
      const facilityId = 1;
      repository.getLocationsByUnitStackPipeIds.mockResolvedValue([
        mockedMonitorLoc,
      ]);
      const result = await service.runChecks(facilityId, location);

      expect(result[1]).toEqual([
        `The database does not contain Stack/Pipe [${location[0].stackPipeId}] for Facility [${facilityId}]`,
      ]);
    });

    it('IMPORT-14 & IMPORT-15: Tests error message when database does not contain one of the system ids and component ids', async () => {
      const mockedMonitorLoc = new MonitorLocation();
      mockedMonitorLoc.unit = new Unit();
      mockedMonitorLoc.unit.name = '51';

      const ms = new MonitorSystem();
      ms.monitoringSystemID = '2';
      const component = new Component();
      component.componentID = '4';

      mockedMonitorLoc.systems = [ms];
      mockedMonitorLoc.components = [component];

      const facilityId = 1;
      repository.getLocationsByUnitStackPipeIds.mockResolvedValue([
        mockedMonitorLoc,
      ]);
      const result = await service.runChecks(facilityId, baseLocations);

      // There should be 2 error messages since between both componentIds and systemIds specificed in location
      // 2 will match and 2 won't match the db. The errors we are testing below are for the ones that don't match
      expect(result).not.toBeNull();
      expect(result[1].length).toBe(2);
      expect(
        result[1].includes(
          `The database does not contain System [${baseLocations[0].systemIDs[0]}] for Unit [${baseLocations[0].unitId}] and Facility [${facilityId}]`,
        ),
      ).toBe(true);
      expect(
        result[1].includes(
          `The database does not contain Component [${baseLocations[0].componentIDs[0]}] for Unit [${baseLocations[0].unitId}] and Facility [${facilityId}]`,
        ),
      ).toBe(true);
    });
  });
});
