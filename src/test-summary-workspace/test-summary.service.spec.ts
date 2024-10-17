import { InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';

import { AirEmissionTestingWorkspaceService } from '../air-emission-testing-workspace/air-emission-testing-workspace.service';
import { AppECorrelationTestSummaryWorkspaceService } from '../app-e-correlation-test-summary-workspace/app-e-correlation-test-summary-workspace.service';
import { CalibrationInjectionWorkspaceService } from '../calibration-injection-workspace/calibration-injection-workspace.service';
import { ComponentWorkspaceRepository } from '../component-workspace/component.repository';
import { CycleTimeSummaryWorkspaceService } from '../cycle-time-summary-workspace/cycle-time-summary-workspace.service';
import { FlowToLoadCheckDTO } from '../dto/flow-to-load-check.dto';
import { FlowToLoadReferenceDTO } from '../dto/flow-to-load-reference.dto';
import { FuelFlowToLoadBaselineDTO } from '../dto/fuel-flow-to-load-baseline.dto';
import { FuelFlowmeterAccuracyDTO } from '../dto/fuel-flowmeter-accuracy.dto';
import {
  LinearitySummaryDTO,
  LinearitySummaryImportDTO,
} from '../dto/linearity-summary.dto';
import { OnlineOfflineCalibrationDTO } from '../dto/online-offline-calibration.dto';
import { TestSummaryDTO, TestSummaryImportDTO } from '../dto/test-summary.dto';
import { TransmitterTransducerAccuracyDTO } from '../dto/transmitter-transducer-accuracy.dto';
import { ReportingPeriod } from '../entities/reporting-period.entity';
import { UnitDefaultTest } from '../entities/unit-default-test.entity';
import { AirEmissionTesting } from '../entities/workspace/air-emission-test.entity';
import { AppECorrelationTestSummary } from '../entities/workspace/app-e-correlation-test-summary.entity';
import { CalibrationInjection } from '../entities/workspace/calibration-injection.entity';
import { Component } from '../entities/workspace/component.entity';
import { CycleTimeSummary } from '../entities/workspace/cycle-time-summary.entity';
import { FuelFlowToLoadTest } from '../entities/workspace/fuel-flow-to-load-test.entity';
import { HgSummary } from '../entities/workspace/hg-summary.entity';
import { MonitorLocation } from '../entities/workspace/monitor-location.entity';
import { MonitorSystem } from '../entities/workspace/monitor-system.entity';
import { ProtocolGas } from '../entities/workspace/protocol-gas.entity';
import { Rata } from '../entities/workspace/rata.entity';
import { StackPipe } from '../entities/workspace/stack-pipe.entity';
import { TestQualification } from '../entities/workspace/test-qualification.entity';
import { TestSummary } from '../entities/workspace/test-summary.entity';
import { Unit } from '../entities/workspace/unit.entity';
import { FlowToLoadCheckWorkspaceService } from '../flow-to-load-check-workspace/flow-to-load-check-workspace.service';
import { FlowToLoadReferenceWorkspaceService } from '../flow-to-load-reference-workspace/flow-to-load-reference-workspace.service';
import { FuelFlowToLoadBaselineWorkspaceService } from '../fuel-flow-to-load-baseline-workspace/fuel-flow-to-load-baseline-workspace.service';
import { FuelFlowToLoadTestWorkspaceService } from '../fuel-flow-to-load-test-workspace/fuel-flow-to-load-test-workspace.service';
import { FuelFlowmeterAccuracyWorkspaceService } from '../fuel-flowmeter-accuracy-workspace/fuel-flowmeter-accuracy-workspace.service';
import { HgSummaryWorkspaceService } from '../hg-summary-workspace/hg-summary-workspace.service';
import { LinearitySummaryWorkspaceService } from '../linearity-summary-workspace/linearity-summary.service';
import { TestSummaryMap } from '../maps/test-summary.map';
import { MonitorLocationRepository } from '../monitor-location/monitor-location.repository';
import { MonitorSystemWorkspaceRepository } from '../monitor-system-workspace/monitor-system-workspace.repository';
import { MonitorSystemRepository } from '../monitor-system/monitor-system.repository';
import { OnlineOfflineCalibrationWorkspaceService } from '../online-offline-calibration-workspace/online-offline-calibration.service';
import { ProtocolGasWorkspaceService } from '../protocol-gas-workspace/protocol-gas.service';
import { QASuppDataWorkspaceService } from '../qa-supp-data-workspace/qa-supp-data.service';
import { RataWorkspaceService } from '../rata-workspace/rata-workspace.service';
import { ReportingPeriodRepository } from '../reporting-period/reporting-period.repository';
import { TestQualificationWorkspaceService } from '../test-qualification-workspace/test-qualification-workspace.service';
import { TransmitterTransducerAccuracyWorkspaceService } from '../transmitter-transducer-accuracy-workspace/transmitter-transducer-accuracy.service';
import { UnitDefaultTestWorkspaceService } from '../unit-default-test-workspace/unit-default-test-workspace.service';
import { TestSummaryWorkspaceRepository } from './test-summary.repository';
import { TestSummaryWorkspaceService } from './test-summary.service';
import { ReviewAndSubmitTestSummaryDTO } from '../dto/review-and-submit-test-summary.dto';
import { TestSummaryReviewAndSubmitService } from '../qa-certification-workspace/test-summary-review-and-submit.service';

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

const reviewAndSubmitTestSummaryDTO = new ReviewAndSubmitTestSummaryDTO();
reviewAndSubmitTestSummaryDTO.testSumId = testSumId;
reviewAndSubmitTestSummaryDTO.evalStatusCode = 'PENDING'; 

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
  findOneBy: jest.fn().mockResolvedValue(testSummary),
  create: jest.fn().mockResolvedValue(testSummary),
  save: jest.fn().mockResolvedValue(testSummary),
});

const mockTestSummaryReviewAndSubmitService = () => ({
  getTestSummaryRecordsByTestSumIds: jest.fn().mockResolvedValue([reviewAndSubmitTestSummaryDTO]),
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

const mockCycleTimeSummaryWorkspaceService = () => ({
  export: jest.fn().mockResolvedValue([new CycleTimeSummary()]),
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
  export: jest.fn().mockResolvedValue([new FuelFlowToLoadBaselineDTO()]),
  import: jest.fn().mockResolvedValue(null),
});

const mockFuelFlowmeterAccuracyWorkspaceService = () => ({
  export: jest.fn().mockResolvedValue([new FuelFlowmeterAccuracyDTO()]),
  import: jest.fn().mockResolvedValue(null),
});

const mockOnlineOfflineCalibrationWorkspaceService = () => ({
  export: jest.fn().mockResolvedValue([new OnlineOfflineCalibrationDTO()]),
});

const mockTransmitterTransducerAccuracyWorkspaceService = () => ({
  export: jest.fn().mockResolvedValue([new TransmitterTransducerAccuracyDTO()]),
  import: jest.fn().mockResolvedValue(null),
});

const mockUnitDefaultTestWorkspaceService = () => ({
  export: jest.fn().mockResolvedValue([new UnitDefaultTest()]),
  import: jest.fn().mockResolvedValue(null),
});

const mockAirEmissionTestingWorkspaceService = () => ({
  export: jest.fn().mockResolvedValue([new AirEmissionTesting()]),
  import: jest.fn().mockResolvedValue(null),
});

const mockTestQualificationWorkspaceService = () => ({
  export: jest.fn().mockResolvedValue([new TestQualification()]),
  import: jest.fn().mockResolvedValue(null),
});

const mockHgSummaryWorkspaceService = () => ({
  export: jest.fn().mockResolvedValue([new HgSummary()]),
  import: jest.fn().mockResolvedValue(null),
});

const mockQASuppDataWorkspaceService = () => ({
  setSubmissionAvailCodeToRequire: jest.fn(),
});

const monLocation = new MonitorLocation();
const unit = new Unit();
unit.name = '1';
monLocation.unit = unit;
const stackPipe = new StackPipe();
stackPipe.name = '1';
monLocation.stackPipe = stackPipe;
const rp = new ReportingPeriod();
rp.id = 1;
const ms = new MonitorSystem();
ms.id = '1';
const comp = new Component();
comp.id = '1';

describe('TestSummaryWorkspaceService', () => {
  let service: TestSummaryWorkspaceService;
  let repository: TestSummaryWorkspaceRepository;
  let locationRepository: MonitorLocationRepository;
  let monitorSystemRepository: MonitorSystemRepository;
  let monitorSystemWorkspaceRepository: MonitorSystemWorkspaceRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        TestSummaryWorkspaceService,
        {
          provide: TestSummaryReviewAndSubmitService,
          useFactory: mockTestSummaryReviewAndSubmitService,
        },
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
          provide: FuelFlowmeterAccuracyWorkspaceService,
          useFactory: mockFuelFlowmeterAccuracyWorkspaceService,
        },
        {
          provide: CalibrationInjectionWorkspaceService,
          useFactory: mockCalibrationInjectionWorkspaceService,
        },
        {
          provide: CycleTimeSummaryWorkspaceService,
          useFactory: mockCycleTimeSummaryWorkspaceService,
        },
        {
          provide: OnlineOfflineCalibrationWorkspaceService,
          useFactory: mockOnlineOfflineCalibrationWorkspaceService,
        },
        {
          provide: MonitorLocationRepository,
          useFactory: () => ({
            getLocationByIdUnitIdStackPipeId: jest
              .fn()
              .mockResolvedValue(monLocation),
          }),
        },
        {
          provide: ReportingPeriodRepository,
          useFactory: () => ({
            findOneBy: jest.fn().mockResolvedValue(rp),
          }),
        },
        {
          provide: MonitorSystemRepository,
          useFactory: () => ({
            findOneBy: jest.fn().mockResolvedValue(ms),
          }),
        },
        {
          provide: MonitorSystemWorkspaceRepository,
          useFactory: () => ({
            findOneBy: jest.fn().mockResolvedValue(ms),
          }),
        },
        {
          provide: ComponentWorkspaceRepository,
          useFactory: () => ({
            findOneBy: jest.fn().mockResolvedValue(comp),
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
        {
          provide: TransmitterTransducerAccuracyWorkspaceService,
          useFactory: mockTransmitterTransducerAccuracyWorkspaceService,
        },
        {
          provide: UnitDefaultTestWorkspaceService,
          useFactory: mockUnitDefaultTestWorkspaceService,
        },
        {
          provide: AirEmissionTestingWorkspaceService,
          useFactory: mockAirEmissionTestingWorkspaceService,
        },
        {
          provide: TestQualificationWorkspaceService,
          useFactory: mockTestQualificationWorkspaceService,
        },
        {
          provide: HgSummaryWorkspaceService,
          useFactory: mockHgSummaryWorkspaceService,
        },
        {
          provide: QASuppDataWorkspaceService,
          useFactory: mockQASuppDataWorkspaceService,
        },
      ],
    }).compile();

    service = module.get(TestSummaryWorkspaceService);
    repository = module.get(TestSummaryWorkspaceRepository);
    locationRepository = module.get(MonitorLocationRepository);
    monitorSystemWorkspaceRepository = module.get(
      MonitorSystemWorkspaceRepository,
    );
  });

  describe('getTestSummaryById', () => {
    it('calls the repository.getTestSummaryById() and get test summary by id', async () => {
      const result = await service.getTestSummaryById(testSumId);
      expect(result).toEqual(testSummaryDto);
    });
  });

  describe('getTestSummariesByLocationId', () => {
    it('calls the repository.getTestSummariesByLocationId() and get test summaries by locationId', async () => {
      testSummaryDto.id = testSumId;
      const result = await service.getTestSummariesByLocationId(locationId);
      expect(result.length).toEqual(1);
      expect(result[0].id).toEqual(testSumId);
      expect(result[0].evalStatusCode).toEqual(reviewAndSubmitTestSummaryDTO.evalStatusCode);
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

      const loc = new MonitorLocation();
      loc.stackPipe = new StackPipe();
      loc.stackPipe.name = '101';
      loc.unit = new Unit();
      loc.unit.name = '101';

      jest
        .spyOn(locationRepository, 'getLocationByIdUnitIdStackPipeId')
        .mockResolvedValue(null);

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
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(testSummary);

      const result = await service.updateTestSummary(
        locationId,
        testSumId,
        payload,
        userId,
      );

      expect(result).toEqual(testSummaryDto);
    });

    it('should call updateTestSummary and throw error while test summariy not found', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(undefined);

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
      expect(repository.findOneBy).toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalled();
    });
  });

  describe('lookupValues', () => {
    it('should return reportPeriodId, componentRecordId, monitorSystem', async () => {
      payload.year = 2022;
      payload.quarter = 1;
      payload.componentId = '1';
      payload.monitoringSystemId = 'abc';

      const result = await service.lookupValues(locationId, payload);

      expect(result).toEqual([1, '1', '1']);
    });

    it('should return reportPeriodId, componentRecordId, monitorSystem from a workspace monitor system record', async () => {
      payload.year = 2022;
      payload.quarter = 1;
      payload.componentId = '1';
      payload.monitoringSystemId = 'abc';

      const monSysData = new MonitorSystem();
      monSysData.id = '1';

      const monSysWksFindOne = jest
        .spyOn(monitorSystemWorkspaceRepository, 'findOneBy')
        .mockResolvedValue(monSysData);

      const result = await service.lookupValues(locationId, payload);

      expect(result).toEqual([1, '1', '1']);
      expect(monSysWksFindOne).toHaveBeenCalled();
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
