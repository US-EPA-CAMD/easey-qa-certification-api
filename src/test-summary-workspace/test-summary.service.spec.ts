import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { LinearitySummaryWorkspaceService } from '../linearity-summary-workspace/linearity-summary.service';
import { TestSummaryDTO, TestSummaryImportDTO } from '../dto/test-summary.dto';
import { TestSummaryMap } from '../maps/test-summary.map';
import { TestSummaryWorkspaceRepository } from './test-summary.repository';
import { TestSummaryWorkspaceService } from './test-summary.service';
import {
  LinearitySummaryDTO,
  LinearitySummaryImportDTO,
} from '../dto/linearity-summary.dto';
import { TestSummary } from '../entities/workspace/test-summary.entity';
import { MonitorLocation } from '../entities/monitor-location.entity';
import { StackPipe } from '../entities/workspace/stack-pipe.entity';
import { Unit } from '../entities/workspace/unit.entity';
import { InternalServerErrorException } from '@nestjs/common';
import { Rata } from '../entities/workspace/rata.entity';
import { RataWorkspaceService } from '../rata-workspace/rata-workspace.service';
import { ProtocolGasWorkspaceService } from '../protocol-gas-workspace/protocol-gas.service';
import { ProtocolGas } from '../entities/workspace/protocol-gas.entity';
import { AppECorrelationTestSummaryWorkspaceService } from '../app-e-correlation-test-summary-workspace/app-e-correlation-test-summary-workspace.service';
import { AppECorrelationTestSummary } from '../entities/workspace/app-e-correlation-test-summary.entity';
import { FuelFlowToLoadTestWorkspaceService } from '../fuel-flow-to-load-test-workspace/fuel-flow-to-load-test-workspace.service';
import { FlowToLoadCheckWorkspaceService } from '../flow-to-load-check-workspace/flow-to-load-check-workspace.service';

const locationId = '121';
const facilityId = 1;
const unitId = '121';
const testSumId = '1';
const historicalrecordId = '1';
const userId = 'testuser';

const testSummary = new TestSummary();
const testSummaryDto = new TestSummaryDTO();
const lineSumDto = new LinearitySummaryDTO();
const lineSumImportDto = new LinearitySummaryImportDTO();
lineSumDto.testSumId = testSumId;

const payload = new TestSummaryImportDTO();
payload.testTypeCode = 'code';
payload.testNumber = '1';
payload.unitId = '1';
payload.stackPipeId = '1';
payload.linearitySummaryData = [lineSumImportDto];

const mockRepository = () => ({
  getTestSummaryById: jest.fn().mockResolvedValue(testSummary),
  getTestSummariesByLocationId: jest.fn().mockResolvedValue([testSummary]),
  getTestSummariesByUnitStack: jest.fn().mockResolvedValue([testSummary]),
  getTestSummaryByLocationId: jest.fn().mockResolvedValue(testSummary),
  delete: jest.fn().mockResolvedValue(null),
  create: jest.fn().mockResolvedValue(testSummary),
  save: jest.fn().mockResolvedValue(testSummary),
});

const mockLinearitySummaryService = () => ({
  export: jest.fn().mockResolvedValue([lineSumDto]),
  import: jest.fn().mockResolvedValue(null),
});

const mockRataService = () => ({
  export: jest.fn().mockResolvedValue([new Rata()]),
  import: jest.fn().mockResolvedValue(null),
});

const mockProtocolGasService = () => ({
  export: jest.fn().mockResolvedValue([new ProtocolGas()]),
  import: jest.fn().mockResolvedValue(null),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(testSummaryDto),
  many: jest.fn().mockResolvedValue([testSummaryDto]),
});

const mockAppECorrelationTestSummaryService = () => ({
  export: jest.fn().mockResolvedValue([new AppECorrelationTestSummary()]),
  import: jest.fn().mockResolvedValue(null),
});
const mockFuelFlowToLoadTestWorkspaceService = () => ({
  import: jest.fn().mockResolvedValue(null),
});
const mockFlowToLoadCheckWorkspaceService = () => ({
  import: jest.fn().mockResolvedValue(null),
});

describe('TestSummaryWorkspaceService', () => {
  let service: TestSummaryWorkspaceService;
  let repository: TestSummaryWorkspaceRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        TestSummaryWorkspaceService,
        {
          provide: LinearitySummaryWorkspaceService,
          useFactory: mockLinearitySummaryService,
        },
        {
          provide: TestSummaryWorkspaceRepository,
          useFactory: mockRepository,
        },
        {
          provide: TestSummaryMap,
          useFactory: mockMap,
        },
        {
          provide: RataWorkspaceService,
          useFactory: mockRataService,
        },
        {
          provide: ProtocolGasWorkspaceService,
          useFactory: mockProtocolGasService,
        },
        {
          provide: AppECorrelationTestSummaryWorkspaceService,
          useFactory: mockAppECorrelationTestSummaryService,
        },
        {
          provide: FuelFlowToLoadTestWorkspaceService,
          useFactory: mockFuelFlowToLoadTestWorkspaceService,
        },
        {
          provide: FlowToLoadCheckWorkspaceService,
          useFactory: mockFlowToLoadCheckWorkspaceService,
        },
      ],
    }).compile();

    service = module.get(TestSummaryWorkspaceService);
    repository = module.get(TestSummaryWorkspaceRepository);
  });

  describe('getTestSummaryById', () => {
    it('calls the repository.getTestSummaryById() and get test summary by id', async () => {
      const result = await service.getTestSummaryById(testSumId);
      expect(result).toEqual(testSummaryDto);
    });

    it('should throw error when test summary not found', async () => {
      jest.spyOn(repository, 'getTestSummaryById').mockResolvedValue(null);

      let errored = false;

      try {
        await service.getTestSummaryById(testSumId);
      } catch (err) {
        errored = true;
      }

      expect(errored).toBe(true);
    });
  });

  describe('getTestSummariesByLocationId', () => {
    it('calls the repository.getTestSummariesByLocationId() and get test summaries by locationId', async () => {
      const result = await service.getTestSummariesByLocationId(locationId);
      expect(result).toEqual([testSummaryDto]);
    });
  });

  describe('getTestSummaries', () => {
    it('calls the repository.getTestSummariesByUnitStack() and get test summaries by locationId', async () => {
      const result = await service.getTestSummaries(facilityId, [unitId]);
      expect(result).toEqual([testSummaryDto]);
    });
  });

  describe('export', () => {
    it('calls the service.getTestSummaries() and get test summaries by locationId and unitId then export', async () => {
      const returnedSummary = testSummaryDto;
      returnedSummary.testTypeCode = 'LINE';
      returnedSummary.id = testSumId;

      const spySummaries = jest
        .spyOn(service, 'getTestSummaries')
        .mockResolvedValue([returnedSummary]);

      const result = await service.export(facilityId, [unitId]);

      expect(spySummaries).toHaveBeenCalled();
      expect(result).toEqual([testSummaryDto]);
    });
  });

  describe('import', () => {
    it('Should create test summary ', async () => {
      const returnedSummary = testSummaryDto;
      returnedSummary.id = testSumId;

      const creste = jest
        .spyOn(service, 'createTestSummary')
        .mockResolvedValue(returnedSummary);

      const result = await service.import(
        locationId,
        payload,
        userId,
        historicalrecordId,
      );

      expect(creste).toHaveBeenCalled();
      expect(result).toEqual(null);
    });
  });

  describe('createTestSummary', () => {
    it('should call the createTestSummary and create test summariy', async () => {
      const mockManager = {
        findOne: jest.fn().mockImplementation((entityType, params) => {
          if (entityType.name == 'StackPipe') {
            const pipe = new StackPipe();
            pipe.name = '1';
            return pipe;
          } else if (entityType.name == 'Unit') {
            return new Unit();
          } else if (entityType.name == 'MonitorLocation') {
            return new MonitorLocation();
          }
        }),
      };

      jest.spyOn(service, 'lookupValues').mockResolvedValue([]);

      // jest.spyOn(utils, 'getEntityManager').mockReturnValue(mockManager);

      jest
        .spyOn(repository, 'getTestSummaryById')
        .mockResolvedValue(testSummary);

      const result = await service.createTestSummary(
        locationId,
        payload,
        userId,
      );

      expect(result).toEqual(testSummaryDto);
    });

    it('should call the createTestSummary and throw error if Unit does not match', async () => {
      const mockManager = {
        findOne: jest.fn().mockImplementation((entityType, params) => {
          if (entityType.name == 'StackPipe') {
            const pipe = new StackPipe();
            pipe.name = '101';
            return pipe;
          } else if (entityType.name == 'Unit') {
            const unit = new Unit();
            unit.name = '101';
            return unit;
          } else if (entityType.name == 'MonitorLocation') {
            const loc = new MonitorLocation();
            loc.unitId = '11';
            return loc;
          }
        }),
      };

      jest.spyOn(service, 'lookupValues').mockResolvedValue([]);

      // jest.spyOn(utils, 'getEntityManager').mockReturnValue(mockManager);

      let errored = false;

      try {
        await service.createTestSummary(locationId, payload, userId);
      } catch (err) {
        errored = true;
      }

      expect(errored).toBe(true);
    });
  });

  describe('updateTestSummary', () => {
    it('should call the updateTestSummary and update test summariy', async () => {
      jest.spyOn(service, 'lookupValues').mockResolvedValue([]);

      jest
        .spyOn(repository, 'getTestSummaryById')
        .mockResolvedValue(testSummary);

      const result = await service.updateTestSummary(
        locationId,
        testSumId,
        payload,
        userId,
      );

      expect(result).toEqual(testSummaryDto);
    });
  });

  describe('deleteTestSummary', () => {
    it('should call the deleteTestSummary and delete test summariy', async () => {
      const result = await service.deleteTestSummary(testSumId);

      expect(result).toEqual(undefined);
    });

    it('should call the deleteTestSummary and throw error while deleting test summariy', async () => {
      jest
        .spyOn(repository, 'delete')
        .mockRejectedValue(new InternalServerErrorException());

      let errored = false;

      try {
        await service.deleteTestSummary(testSumId);
      } catch (err) {
        errored = true;
      }

      expect(errored).toBe(true);
    });
  });
});
