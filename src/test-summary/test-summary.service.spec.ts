import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { Rata } from '../entities/rata.entity';
import { RataService } from '../rata/rata.service';
import { LinearitySummaryDTO } from '../dto/linearity-summary.dto';
import { TestSummaryDTO } from '../dto/test-summary.dto';
import { TestSummary } from '../entities/test-summary.entity';
import { LinearitySummaryService } from '../linearity-summary/linearity-summary.service';
import { TestSummaryMap } from '../maps/test-summary.map';
import { TestSummaryRepository } from './test-summary.repository';

import { TestSummaryService } from './test-summary.service';
import { ProtocolGas } from '../entities/protocol-gas.entity';
import { ProtocolGasService } from '../protocol-gas/protocol-gas.service';
import { AppECorrelationTestSummary } from '../entities/app-e-correlation-test-summary.entity';
import { AppECorrelationTestSummaryService } from '../app-e-correlation-test-summary/app-e-correlation-test-summary.service';
import { FuelFlowToLoadTestService } from '../fuel-flow-to-load-test/fuel-flow-to-load-test.service';
import { FuelFlowToLoadTest } from '../entities/fuel-flow-to-load-test.entity';
import { CalibrationInjection } from '../entities/calibration-injection.entity';
import { CalibrationInjectionService } from '../calibration-injection/calibration-injection.service';
import { TestTypeCodes } from '../enums/test-type-code.enum';
import { FlowToLoadCheck } from '../entities/flow-to-load-check.entity';
import { FlowToLoadCheckService } from '../flow-to-load-check/flow-to-load-check.service';
import { OnlineOfflineCalibrationDTO } from '../dto/online-offline-calibration.dto';
import { OnlineOfflineCalibrationService } from '../online-offline-calibration/online-offline-calibration.service';
import { FlowToLoadReference } from '../entities/flow-to-load-reference.entity';
import { FlowToLoadReferenceService } from '../flow-to-load-reference/flow-to-load-reference.service';
import { FuelFlowToLoadBaselineService } from '../fuel-flow-to-load-baseline/fuel-flow-to-load-baseline.service';
import { FuelFlowToLoadBaselineDTO } from '../dto/fuel-flow-to-load-baseline.dto';
import { CycleTimeSummary } from '../entities/cycle-time-summary.entity';
import { CycleTimeSummaryService } from '../cycle-time-summary/cycle-time-summary.service';
import { FuelFlowmeterAccuracy } from '../entities/fuel-flowmeter-accuracy.entity';
import { FuelFlowmeterAccuracyService } from '../fuel-flowmeter-accuracy/fuel-flowmeter-accuracy.service';
import { UnitDefaultTest } from '../entities/unit-default-test.entity';
import { UnitDefaultTestService } from '../unit-default-test/unit-default-test.service';

const locationId = '121';
const facilityId = 1;
const unitId = '121';
const testSumId = '1';

const testSumaary = new TestSummary();
const testSumaaryDto = new TestSummaryDTO();
const lineSumDto = new LinearitySummaryDTO();
lineSumDto.testSumId = testSumId;

const mockRepository = () => ({
  getTestSummaryById: jest.fn().mockResolvedValue(testSumaary),
  getTestSummariesByLocationId: jest.fn().mockResolvedValue([testSumaary]),
  getTestSummariesByUnitStack: jest.fn().mockResolvedValue([testSumaary]),
});

const mockLinearitySummaryService = () => ({
  export: jest.fn().mockResolvedValue([lineSumDto]),
});

const mockMap = () => ({
  one: jest.fn().mockResolvedValue(testSumaaryDto),
  many: jest.fn().mockResolvedValue([testSumaaryDto]),
});

const mockRataService = () => ({
  export: jest.fn().mockResolvedValue([new Rata()]),
});

const mockProtocolGasService = () => ({
  export: jest.fn().mockResolvedValue([new ProtocolGas()]),
});

const mockFlowToLoadCheckService = () => ({
  export: jest.fn().mockResolvedValue([new FlowToLoadCheck()]),
});

const mockAppECorrelationTestSummaryService = () => ({
  export: jest.fn().mockResolvedValue([new AppECorrelationTestSummary()]),
});

const mockFuelFlowToLoadTestService = () => ({
  export: jest.fn().mockResolvedValue([new FuelFlowToLoadTest()]),
});

const mockCalibrationInjectionService = () => ({
  export: jest.fn().mockResolvedValue([new CalibrationInjection()]),
});

const mockCycleTimeSummaryService = () => ({
  export: jest.fn().mockResolvedValue([new CycleTimeSummary()]),
});

const mockFlowToLoadReferenceService = () => ({
  export: jest.fn().mockResolvedValue([new FlowToLoadReference()]),
});

const mockOnlineOfflineCalibrationService = () => ({
  export: jest.fn().mockResolvedValue([new OnlineOfflineCalibrationDTO()]),
});

const mockFuelFlowToLoadBaselineService = () => ({
  export: jest.fn().mockResolvedValue([new FuelFlowToLoadBaselineDTO()]),
});
const mockFuelFlowmeterAccuracyService = () => ({
  export: jest.fn().mockResolvedValue([new FuelFlowmeterAccuracy()]),
});

const mockUnitDefaultTestService = () => ({
  export: jest.fn().mockResolvedValue([new UnitDefaultTest()]),
})

describe('TestSummaryService', () => {
  let service: TestSummaryService;
  let repository: TestSummaryRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        TestSummaryService,
        {
          provide: LinearitySummaryService,
          useFactory: mockLinearitySummaryService,
        },
        {
          provide: TestSummaryRepository,
          useFactory: mockRepository,
        },
        {
          provide: TestSummaryMap,
          useFactory: mockMap,
        },
        {
          provide: RataService,
          useFactory: mockRataService,
        },
        {
          provide: ProtocolGasService,
          useFactory: mockProtocolGasService,
        },
        {
          provide: AppECorrelationTestSummaryService,
          useFactory: mockAppECorrelationTestSummaryService,
        },
        {
          provide: FuelFlowToLoadTestService,
          useFactory: mockFuelFlowToLoadTestService,
        },
        {
          provide: CalibrationInjectionService,
          useFactory: mockCalibrationInjectionService,
        },
        {
          provide: CycleTimeSummaryService,
          useFactory: mockCycleTimeSummaryService,
        },
        {
          provide: FlowToLoadCheckService,
          useFactory: mockFlowToLoadCheckService,
        },
        {
          provide: FlowToLoadReferenceService,
          useFactory: mockFlowToLoadReferenceService,
        },
        {
          provide: FuelFlowmeterAccuracyService,
          useFactory: mockFuelFlowmeterAccuracyService,
        },
        {
          provide: OnlineOfflineCalibrationService,
          useFactory: mockOnlineOfflineCalibrationService,
        },
        {
          provide: FuelFlowToLoadBaselineService,
          useFactory: mockFuelFlowToLoadBaselineService,
        },
        {
          provide: UnitDefaultTestService,
          useFactory: mockUnitDefaultTestService,
        },
      ],
    }).compile();

    service = module.get(TestSummaryService);
    repository = module.get(TestSummaryRepository);
  });

  describe('getTestSummaryById', () => {
    it('calls the repository.getTestSummaryById() and get test summary by id', async () => {
      const result = await service.getTestSummaryById(testSumId);
      expect(result).toEqual(testSumaaryDto);
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
      expect(result).toEqual([testSumaaryDto]);
    });
  });

  describe('getTestSummaries', () => {
    it('calls the repository.getTestSummariesByUnitStack() and get test summaries by locationId', async () => {
      const result = await service.getTestSummaries(facilityId, [unitId]);
      expect(result).toEqual([testSumaaryDto]);
    });
  });

  describe('export', () => {
    it('calls the repository.getTestSummariesByUnitStack() and get test summaries by locationId', async () => {
      const returnedSummary = testSumaaryDto;
      returnedSummary.testTypeCode = TestTypeCodes.LINE;
      returnedSummary.id = testSumId;

      const spySummaries = jest
        .spyOn(service, 'getTestSummaries')
        .mockResolvedValue([returnedSummary]);

      const result = await service.export(facilityId, [unitId]);

      expect(spySummaries).toHaveBeenCalled();
      expect(result).toEqual([testSumaaryDto]);
    });

    it('calls the repository.getTestSummariesByUnitStack() and get test summaries by locationId and TestTypeCodes', async () => {
      const returnedSummary = testSumaaryDto;
      returnedSummary.testTypeCode = TestTypeCodes.LINE;
      returnedSummary.id = testSumId;

      const spySummaries = jest
        .spyOn(service, 'getTestSummaries')
        .mockResolvedValue([returnedSummary]);

      const result = await service.export(
        facilityId,
        [unitId],
        [],
        [],
        [TestTypeCodes.LINE],
      );

      expect(spySummaries).toHaveBeenCalled();
      expect(result).toEqual([testSumaaryDto]);
    });
  });
});
