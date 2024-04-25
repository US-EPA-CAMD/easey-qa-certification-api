import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import {
  QACertificationDTO,
  QACertificationImportDTO,
} from '../dto/qa-certification.dto';
import { QACertificationParamsDTO } from '../dto/qa-certification-params.dto';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { QACertificationWorkspaceService } from './qa-certification.service';
import { TestSummaryDTO, TestSummaryImportDTO } from '../dto/test-summary.dto';
import { LocationIdentifiers } from '../interfaces/location-identifiers.interface';
import { QASuppData } from '../entities/workspace/qa-supp-data.entity';
import {
  TestExtensionExemptionDTO,
  TestExtensionExemptionImportDTO,
} from '../dto/test-extension-exemption.dto';
import { TestExtensionExemptionsWorkspaceService } from '../test-extension-exemptions-workspace/test-extension-exemptions-workspace.service';
import { QACertificationEventWorkspaceService } from '../qa-certification-event-workspace/qa-certification-event-workspace.service';
import {
  QACertificationEventDTO,
  QACertificationEventImportDTO,
} from '../dto/qa-certification-event.dto';
import { CalibrationInjectionDTO } from '../dto/calibration-injection.dto';
import { LinearitySummaryDTO } from '../dto/linearity-summary.dto';
import { RataDTO } from '../dto/rata.dto';
import { FlowToLoadReferenceDTO } from '../dto/flow-to-load-reference.dto';
import { FlowToLoadCheckDTO } from '../dto/flow-to-load-check.dto';
import { CycleTimeSummaryDTO } from '../dto/cycle-time-summary.dto';
import { OnlineOfflineCalibrationDTO } from '../dto/online-offline-calibration.dto';
import { FuelFlowmeterAccuracyDTO } from '../dto/fuel-flowmeter-accuracy.dto';
import { TransmitterTransducerAccuracyDTO } from '../dto/transmitter-transducer-accuracy.dto';
import { FuelFlowToLoadBaselineDTO } from '../dto/fuel-flow-to-load-baseline.dto';
import { AppECorrelationTestSummaryDTO } from '../dto/app-e-correlation-test-summary.dto';
import { UnitDefaultTestDTO } from '../dto/unit-default-test.dto';
import { HgSummaryDTO } from '../dto/hg-summary.dto';
import { TestQualificationDTO } from '../dto/test-qualification.dto';
import { ProtocolGasDTO } from '../dto/protocol-gas.dto';
import { AirEmissionTestingDTO } from '../dto/air-emission-test.dto';

const testSummary = new TestSummaryDTO();
const calibrationInjection = new CalibrationInjectionDTO();
const linearitySummary = new LinearitySummaryDTO();
const rata = new RataDTO();
const flowToLoadReference = new FlowToLoadReferenceDTO();
const flowToLoadCheck = new FlowToLoadCheckDTO();
const cycleTimeSummary = new CycleTimeSummaryDTO();
const onlineOfflineCalibration = new OnlineOfflineCalibrationDTO();
const fuelFlowmeterAccuracy = new FuelFlowmeterAccuracyDTO();
const transmitterTransducerAccuracy = new TransmitterTransducerAccuracyDTO();
const fuelFlowToLoadBaseline = new FuelFlowToLoadBaselineDTO();
const appECorrelationTestSummary = new AppECorrelationTestSummaryDTO();
const unitDefaultTest = new UnitDefaultTestDTO();
const hgSummary = new HgSummaryDTO();
const testQualification = new TestQualificationDTO();
const protocolGas = new ProtocolGasDTO();
const airEmissionTesting = new AirEmissionTestingDTO();
const qaCertEventDto = new QACertificationEventDTO();
const qaCertDto = new QACertificationDTO();
const testExtExmtDto = new TestExtensionExemptionDTO();
qaCertDto.testSummaryData = [testSummary];
testSummary.calibrationInjectionData = [calibrationInjection];
testSummary.linearitySummaryData = [linearitySummary];
testSummary.rataData = [rata];
testSummary.flowToLoadReferenceData = [flowToLoadReference];
testSummary.flowToLoadCheckData = [flowToLoadCheck];
testSummary.cycleTimeSummaryData = [cycleTimeSummary];
testSummary.onlineOfflineCalibrationData = [onlineOfflineCalibration];
testSummary.fuelFlowmeterAccuracyData = [fuelFlowmeterAccuracy];
testSummary.transmitterTransducerData = [transmitterTransducerAccuracy];
testSummary.fuelFlowToLoadBaselineData = [fuelFlowToLoadBaseline];
testSummary.appendixECorrelationTestSummaryData = [appECorrelationTestSummary];
testSummary.unitDefaultTestData = [unitDefaultTest];
testSummary.hgSummaryData = [hgSummary];
testSummary.testQualificationData = [testQualification];
testSummary.protocolGasData = [protocolGas];
testSummary.airEmissionTestingData = [airEmissionTesting];
qaCertDto.testExtensionExemptionData = [testExtExmtDto];
qaCertDto.certificationEventData = [qaCertEventDto];

const payload = new QACertificationImportDTO();
payload.testSummaryData = [new TestSummaryImportDTO()];
payload.testSummaryData[0].unitId = '1';
payload.testSummaryData[0].stackPipeId = '1';
payload.orisCode = 1;
payload.testExtensionExemptionData = [new TestExtensionExemptionImportDTO()];
payload.testExtensionExemptionData[0].unitId = '1';
payload.testExtensionExemptionData[0].stackPipeId = '1';
payload.certificationEventData = [new QACertificationEventImportDTO()];
payload.certificationEventData[0].unitId = '1';
payload.certificationEventData[0].stackPipeId = '1';

const userId = 'testUser';

const qaSuppData = new QASuppData();
qaSuppData.testSumId = '1';

const location: LocationIdentifiers = {
  unitId: '1',
  locationId: '1',
  stackPipeId: '1',
  systemIDs: ['1'],
  componentIDs: ['1'],
};
const mockTestSummaryWorkspaceService = () => ({
  export: jest.fn().mockResolvedValue([testSummary]),
  import: jest.fn().mockResolvedValue(undefined),
});

const mockQACertEventService = () => ({
  export: jest.fn().mockResolvedValue([qaCertEventDto]),
  import: jest.fn().mockResolvedValue(undefined),
});

const mockQATestExtensionExemptionService = () => ({
  export: jest.fn().mockResolvedValue([testExtExmtDto]),
  import: jest.fn().mockResolvedValue(undefined),
});

describe('QA Certification Workspace Service Test', () => {
  let service: QACertificationWorkspaceService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        QACertificationWorkspaceService,
        {
          provide: TestSummaryWorkspaceService,
          useFactory: mockTestSummaryWorkspaceService,
        },
        {
          provide: QACertificationEventWorkspaceService,
          useFactory: mockQACertEventService,
        },
        {
          provide: TestExtensionExemptionsWorkspaceService,
          useFactory: mockQATestExtensionExemptionService,
        },
      ],
    }).compile();

    service = module.get(QACertificationWorkspaceService);
  });

  describe('export', () => {
    it('successfully calls export() service function', async () => {
      const expected = qaCertDto;
      expected.testSummaryData = [testSummary];
      expected.certificationEventData = [qaCertEventDto];
      expected.testExtensionExemptionData = [testExtExmtDto];
      expected.orisCode = 1;

      const paramsDTO = new QACertificationParamsDTO();
      paramsDTO.facilityId = 1;
      paramsDTO.reportedValuesOnly = true;
      const result = await service.export(
        paramsDTO,
        paramsDTO.reportedValuesOnly,
      );

      expect(result).toEqual(expected);
    });
  });

  describe('import', () => {
    it('successfully calls import() service function', async () => {
      const result = await service.import([location], payload, userId, []);
      expect(result).toEqual({
        message: `Successfully Imported QA Certification Data for Facility Id/Oris Code [${payload.orisCode}]`,
      });
    });

    it('successfully calls import() service function when qaSuppData found ', async () => {
      const result = await service.import([location], payload, userId, [
        qaSuppData,
      ]);
      expect(result).toEqual({
        message: `Successfully Imported QA Certification Data for Facility Id/Oris Code [${payload.orisCode}]`,
      });
    });
  });
});
