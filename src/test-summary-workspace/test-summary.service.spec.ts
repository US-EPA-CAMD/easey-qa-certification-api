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
import { MonitorLocation } from '../entities/workspace/monitor-location.entity';
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
import { CalibrationInjectionWorkspaceService } from '../calibration-injection-workspace/calibration-injection-workspace.service';
import { CalibrationInjection } from '../entities/workspace/calibration-injection.entity';
import { FuelFlowToLoadTest } from '../entities/workspace/fuel-flow-to-load-test.entity';
import { UnitRepository } from '../unit/unit.repository';
import { StackPipeRepository } from '../stack-pipe/stack-pipe.repository';
import { MonitorLocationRepository } from '../monitor-location/monitor-location.repository';
import { ReportingPeriodRepository } from '../reporting-period/reporting-period.repository';
import { ReportingPeriod } from '../entities/workspace/reporting-period.entity';
import { MonitorSystemRepository } from '../monitor-system/monitor-system.repository';
import { MonitorSystem } from '../entities/workspace/monitor-system.entity';
import { Component } from '../entities/workspace/component.entity';
import { ComponentWorkspaceRepository } from '../component-workspace/component.repository';
import { FlowToLoadCheck } from '../entities/workspace/flow-to-load-check.entity';
import { FlowToLoadCheckWorkspaceService } from '../flow-to-load-check-workspace/flow-to-load-check-workspace.service';
import { FuelFlowToLoadBaselineWorkspaceService } from '../fuel-flow-to-load-baseline-workspace/fuel-flow-to-load-baseline-workspace.service';
import { FuelFlowToLoadBaseline } from '../entities/workspace/fuel-flow-to-load-baseline.entity';
import { FlowToLoadReferenceWorkspaceService } from '../flow-to-load-reference-workspace/flow-to-load-reference-workspace.service';
import { OnlineOfflineCalibrationWorkspaceService } from '../online-offline-calibration-workspace/online-offline-calibration.service';
import { FlowToLoadCheckDTO } from '../dto/flow-to-load-check.dto';
import { FlowToLoadReferenceDTO } from '../dto/flow-to-load-reference.dto';
import { OnlineOfflineCalibrationDTO } from '../dto/online-offline-calibration.dto';

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
  findOne: jest.fn().mockResolvedValue(testSummary),
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

const mockCalibrationInjectionWorkspaceService = () => ({
  export: jest.fn().mockResolvedValue([new CalibrationInjection()]),
  import: jest.fn().mockResolvedValue(null),
});

const mockFuelFlowToLoadTestWorkspaceService = () => ({
  export: jest.fn().mockResolvedValue([new FuelFlowToLoadTest()]),
  import: jest.fn().mockResolvedValue(null),
});

const mockFlowToLoadReferenceWorkspaceService = () => ({
  export: jest.fn().mockResolvedValue([new FlowToLoadReferenceDTO()]),
});

const mockFlowToLoadCheckWorkspaceService = () => ({
  import: jest.fn().mockResolvedValue(null),
  export: jest.fn().mockResolvedValue([new FlowToLoadCheckDTO()]),
});
const mockFuelFlowToLoadBaselineService = () => ({
  export: jest.fn().mockResolvedValue([new FuelFlowToLoadBaseline()]),
  import: jest.fn().mockResolvedValue(null),
});

const mockOnlineOfflineCalibrationWorkspaceService = () => ({
  export: jest.fn().mockResolvedValue([new OnlineOfflineCalibrationDTO()]),
});

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

describe('TestSummaryWorkspaceService', () => {
  let service: TestSummaryWorkspaceService;
  let repository: TestSummaryWorkspaceRepository;
  let unitRepository: UnitRepository;
  let stackPipeRepository: StackPipeRepository;
  let locationRepository: MonitorLocationRepository;

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
          provide: CalibrationInjectionWorkspaceService,
          useFactory: mockCalibrationInjectionWorkspaceService,
        },
        {
          provide: OnlineOfflineCalibrationWorkspaceService,
          useFactory: mockOnlineOfflineCalibrationWorkspaceService,
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
        {
          provide: FlowToLoadCheckWorkspaceService,
          useFactory: mockFlowToLoadCheckWorkspaceService,
        },
        {
          provide: FlowToLoadReferenceWorkspaceService,
          useFactory: mockFlowToLoadReferenceWorkspaceService,
        },
        {
          provide: FuelFlowToLoadBaselineWorkspaceService,
          useFactory: mockFuelFlowToLoadBaselineService,
        },
      ],
    }).compile();

    service = module.get(TestSummaryWorkspaceService);
    repository = module.get(TestSummaryWorkspaceRepository);
    unitRepository = module.get(UnitRepository);
    stackPipeRepository = module.get(StackPipeRepository);
    locationRepository = module.get(MonitorLocationRepository);
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

  describe('createTestSummary', () => {
    it('should call the createTestSummary and create test summariy', async () => {
      jest.spyOn(service, 'lookupValues').mockResolvedValue([]);

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

    it('should call updateTestSummary and throw error while test summariy not found', async () => {
      jest.spyOn(repository, 'getTestSummaryById').mockResolvedValue(undefined);

      let errored = false;

      try {
        await service.updateTestSummary(locationId, testSumId, payload, userId);
      } catch (err) {
        errored = true;
      }

      expect(errored).toBe(true);
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

  describe('resetToNeedsEvaluation', () => {
    it('should update eval status', async () => {
      const result = await service.resetToNeedsEvaluation(testSumId, userId);

      expect(result).toEqual(undefined);
      expect(repository.findOne).toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalled();
    });
  });

  describe('lookupValues', () => {
    it('should return reportPeriodId, componentRecordId, monitorSystem', async () => {
      payload.year = 2022;
      payload.quarter = 1;
      payload.componentID = '1';
      payload.monitoringSystemID = 'abc';

      const result = await service.lookupValues(locationId, payload);

      expect(result).toEqual([1, '1', ms]);
    });
  });

  describe('import', () => {
    it('Should create test summary ', async () => {
      const returnedSummary = testSummaryDto;
      returnedSummary.id = testSumId;

      const creste = jest
        .spyOn(service, 'createTestSummary')
        .mockResolvedValue(returnedSummary);

      const importPayload = payload;
      const calInj = new CalibrationInjection();

      importPayload.calibrationInjectionData = [calInj];

      const result = await service.import(
        locationId,
        importPayload,
        userId,
        historicalrecordId,
      );

      expect(creste).toHaveBeenCalled();
      expect(result).toEqual(null);
      expect(creste).toHaveBeenCalled();
    });
  });
});
