import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { StackPipe } from '../entities/workspace/stack-pipe.entity';
import { MonitorLocation } from '../entities/workspace/monitor-location.entity';
import { Unit } from '../entities/workspace/unit.entity';
import { LocationIdentifiers } from '../interfaces/location-identifiers.interface';
import { LocationChecksService } from './monitor-location-checks.service';
import { LocationWorkspaceRepository } from './monitor-location.repository';
import { MonitorSystem } from '../entities/workspace/monitor-system.entity';
import { Component } from '../entities/workspace/component.entity';
import { QACertificationImportDTO } from '../dto/qa-certification.dto';
import { TestSummaryImportDTO } from '../dto/test-summary.dto';

const MOCK_ERROR_MSG = 'MOCK_ERROR_MSG';

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

    jest.spyOn(service, 'getMessage').mockReturnValue(MOCK_ERROR_MSG);
  });

  describe('processLocations tests', () => {
    const payload = new QACertificationImportDTO();

    const testSummary = new TestSummaryImportDTO();
    testSummary.monitoringSystemId = '1';
    testSummary.componentId = '1';
    testSummary.unitId = '51';
    payload.testSummaryData = [testSummary];
    it('is able to return weith expected values', () => {
      const result = service.processLocations(payload);

      expect(result[0].componentIDs).toEqual(['1']);
      expect(result[0].systemIDs).toEqual(['1']);
      expect(result[0].unitId).toEqual('51');
    });
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

    const payload = new QACertificationImportDTO();
    payload.orisCode = 1;

    it('returns a response successfully', async () => {
      repository.getLocationsByUnitStackPipeIds.mockResolvedValue([]);

      jest.spyOn(service, 'processLocations').mockReturnValue(baseLocations);

      const result = await service.runChecks(payload);

      expect(result).not.toBeNull();
      expect(result[0]).toBe(baseLocations);
      expect(result[1]).toEqual([MOCK_ERROR_MSG]);
    });

    it('IMPORT-13: Tests stack/pipe prefix', async () => {
      repository.getLocationsByUnitStackPipeIds.mockResolvedValue([]);

      const locations = [{ ...baseLocations[0] }];
      locations[0].unitId = 'CS51';

      jest.spyOn(service, 'processLocations').mockReturnValue(locations);

      const result = await service.runChecks(payload);

      expect(result[1]).toEqual([MOCK_ERROR_MSG]);
    });

    it('IMPORT-13: Tests error message when database does not contain unit data for the facility', async () => {
      const mockedMonitorLoc = new MonitorLocation();
      mockedMonitorLoc.unit = new Unit();
      mockedMonitorLoc.unit.name = '52';

      repository.getLocationsByUnitStackPipeIds.mockResolvedValue([
        mockedMonitorLoc,
      ]);

      jest.spyOn(service, 'processLocations').mockReturnValue(baseLocations);

      const result = await service.runChecks(payload);

      expect(result[1]).toEqual([MOCK_ERROR_MSG]);
    });

    it('IMPORT-13: Tests error message when database does not contain Stack/Pipe data for the facility', async () => {
      const mockedMonitorLoc = new MonitorLocation();
      mockedMonitorLoc.stackPipe = new StackPipe();
      mockedMonitorLoc.stackPipe.name = 'sp52';

      const location: LocationIdentifiers[] = [
        { ...baseLocations[0], stackPipeId: 'sp53', unitId: null },
      ];
      repository.getLocationsByUnitStackPipeIds.mockResolvedValue([
        mockedMonitorLoc,
      ]);

      jest.spyOn(service, 'processLocations').mockReturnValue(location);

      const result = await service.runChecks(payload);

      expect(result[1]).toEqual([MOCK_ERROR_MSG]);
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

      repository.getLocationsByUnitStackPipeIds.mockResolvedValue([
        mockedMonitorLoc,
      ]);

      jest.spyOn(service, 'processLocations').mockReturnValue(baseLocations);

      const result = await service.runChecks(payload);

      // There should be 2 error messages since between both componentIds and systemIds specificed in location
      // 2 will match and 2 won't match the db. The errors we are testing below are for the ones that don't match
      expect(result).not.toBeNull();
      expect(result[1].length).toBe(2);
      expect(result[1].includes(MOCK_ERROR_MSG)).toBe(true);
      expect(result[1].includes(MOCK_ERROR_MSG)).toBe(true);
    });
  });
});
