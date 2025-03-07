import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { EntityManager } from 'typeorm';
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
import { EaseyContentService } from '../qa-certification-easey-content/easey-content.service';

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

const mockEntityManager = () => ({
  transaction: jest.fn().mockImplementation(async callback => {
    return await callback();
  }),
});

describe('QA Certification Workspace Service Test', () => {
  let service: QACertificationWorkspaceService;
  let entityManager: EntityManager;

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
        {
          provide: EaseyContentService,
          useFactory:  () => ({
            QaCertificationSchema: jest.fn().mockResolvedValue({
              version : '1.0.0'
            }),
          })
        },
        {
          provide: EntityManager,
          useFactory: mockEntityManager,
        },
      ],
    }).compile();

    service = module.get(QACertificationWorkspaceService);
    entityManager = module.get(EntityManager);
  });

  describe('export', () => {
    it('successfully calls export() service function with all data', async () => {
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

    it('successfully calls export() with only testSummaryIds', async () => {
      const expected = {
        version: undefined,
        orisCode: 1,
        testSummaryData: [testSummary],
        certificationEventData: [],
        testExtensionExemptionData: [],
      };

      const paramsDTO = new QACertificationParamsDTO();
      paramsDTO.facilityId = 1;
      paramsDTO.testSummaryIds = ['1'];
      paramsDTO.reportedValuesOnly = false;

      const result = await service.export(
        paramsDTO,
        paramsDTO.reportedValuesOnly,
      );

      expect(result.orisCode).toEqual(expected.orisCode);
      expect(result.testSummaryData).toEqual(expected.testSummaryData);
      expect(result.certificationEventData).toEqual(expected.certificationEventData);
      expect(result.testExtensionExemptionData).toEqual(expected.testExtensionExemptionData);
    });

    it('successfully calls export() with only qaCertificationEventIds', async () => {
      const expected = {
        version: undefined,
        orisCode: 1,
        testSummaryData: [],
        certificationEventData: [qaCertEventDto],
        testExtensionExemptionData: [],
      };

      const paramsDTO = new QACertificationParamsDTO();
      paramsDTO.facilityId = 1;
      paramsDTO.qaCertificationEventIds = ['1'];
      paramsDTO.reportedValuesOnly = false;

      const result = await service.export(
        paramsDTO,
        paramsDTO.reportedValuesOnly,
      );

      expect(result.orisCode).toEqual(expected.orisCode);
      expect(result.testSummaryData).toEqual(expected.testSummaryData);
      expect(result.certificationEventData).toEqual(expected.certificationEventData);
      expect(result.testExtensionExemptionData).toEqual(expected.testExtensionExemptionData);
    });

    it('successfully calls export() with only qaTestExtensionExemptionIds', async () => {
      const expected = {
        version: undefined,
        orisCode: 1,
        testSummaryData: [],
        certificationEventData: [],
        testExtensionExemptionData: [testExtExmtDto],
      };

      const paramsDTO = new QACertificationParamsDTO();
      paramsDTO.facilityId = 1;
      paramsDTO.qaTestExtensionExemptionIds = ['1'];
      paramsDTO.reportedValuesOnly = false;

      const result = await service.export(
        paramsDTO,
        paramsDTO.reportedValuesOnly,
      );

      expect(result.orisCode).toEqual(expected.orisCode);
      expect(result.testSummaryData).toEqual(expected.testSummaryData);
      expect(result.certificationEventData).toEqual(expected.certificationEventData);
      expect(result.testExtensionExemptionData).toEqual(expected.testExtensionExemptionData);
    });

    it('successfully calls export() with all ID parameters defined', async () => {
      const expected = {
        version: undefined,
        orisCode: 1,
        testSummaryData: [testSummary],
        certificationEventData: [qaCertEventDto],
        testExtensionExemptionData: [testExtExmtDto],
      };

      const paramsDTO = new QACertificationParamsDTO();
      paramsDTO.facilityId = 1;
      paramsDTO.testSummaryIds = ['1'];
      paramsDTO.qaCertificationEventIds = ['1'];
      paramsDTO.qaTestExtensionExemptionIds = ['1'];
      paramsDTO.reportedValuesOnly = false;

      const result = await service.export(
        paramsDTO,
        paramsDTO.reportedValuesOnly,
      );

      expect(result.orisCode).toEqual(expected.orisCode);
      expect(result.testSummaryData).toEqual(expected.testSummaryData);
      expect(result.certificationEventData).toEqual(expected.certificationEventData);
      expect(result.testExtensionExemptionData).toEqual(expected.testExtensionExemptionData);
    });

    it('successfully calls export() with mixed ID parameters', async () => {
      const expected = {
        version: undefined,
        orisCode: 1,
        testSummaryData: [testSummary],
        certificationEventData: [qaCertEventDto],
        testExtensionExemptionData: [],
      };

      const paramsDTO = new QACertificationParamsDTO();
      paramsDTO.facilityId = 1;
      paramsDTO.testSummaryIds = ['1'];
      paramsDTO.qaCertificationEventIds = ['1'];
      // No qaTestExtensionExemptionIds
      paramsDTO.reportedValuesOnly = false;

      const result = await service.export(
        paramsDTO,
        paramsDTO.reportedValuesOnly,
      );

      expect(result.orisCode).toEqual(expected.orisCode);
      expect(result.testSummaryData).toEqual(expected.testSummaryData);
      expect(result.certificationEventData).toEqual(expected.certificationEventData);
      expect(result.testExtensionExemptionData).toEqual(expected.testExtensionExemptionData);
    });

    it('handles undefined QaCertificationSchema', async () => {
      // Temporarily set QaCertificationSchema to undefined
      const originalSchema = service['easeyContentService'].QaCertificationSchema;
      service['easeyContentService'].QaCertificationSchema = undefined;

      const expected = {
        orisCode: 1,
        testSummaryData: [testSummary],
        certificationEventData: [qaCertEventDto],
        testExtensionExemptionData: [testExtExmtDto],
      };

      const paramsDTO = new QACertificationParamsDTO();
      paramsDTO.facilityId = 1;
      paramsDTO.reportedValuesOnly = false;

      const result = await service.export(
        paramsDTO,
        paramsDTO.reportedValuesOnly,
      );

      // Restore original value
      service['easeyContentService'].QaCertificationSchema = originalSchema;

      // Check that the result has the expected properties
      expect(result.orisCode).toEqual(expected.orisCode);
      expect(result.testSummaryData).toEqual(expected.testSummaryData);
      expect(result.certificationEventData).toEqual(expected.certificationEventData);
      expect(result.testExtensionExemptionData).toEqual(expected.testExtensionExemptionData);
    });

    it('successfully calls export() with rptValuesOnly = false', async () => {
      const expected = qaCertDto;
      expected.testSummaryData = [testSummary];
      expected.certificationEventData = [qaCertEventDto];
      expected.testExtensionExemptionData = [testExtExmtDto];
      expected.orisCode = 1;

      const paramsDTO = new QACertificationParamsDTO();
      paramsDTO.facilityId = 1;
      paramsDTO.reportedValuesOnly = false;

      // Mock removeNonReportedValues to verify it's not called
      const removeNonReportedValuesSpy = jest.spyOn(
        require('../utilities/remove-non-reported-values'),
        'removeNonReportedValues',
      ).mockImplementation(jest.fn());

      const result = await service.export(
        paramsDTO,
        paramsDTO.reportedValuesOnly,
      );

      expect(result.orisCode).toEqual(expected.orisCode);
      expect(removeNonReportedValuesSpy).not.toHaveBeenCalled();
    });
  });

  describe('import', () => {
    it('successfully calls import() service function', async () => {
      const result = await service.import([location], payload, userId, []);
      expect(result).toEqual({
        message: `Successfully Imported QA Certification Data for Facility Id/Oris Code [${payload.orisCode}]`,
      });
      expect(entityManager.transaction).toHaveBeenCalled();
    });

    it('successfully calls import() service function when qaSuppData found ', async () => {
      const result = await service.import([location], payload, userId, [
        qaSuppData,
      ]);
      expect(result).toEqual({
        message: `Successfully Imported QA Certification Data for Facility Id/Oris Code [${payload.orisCode}]`,
      });
      expect(entityManager.transaction).toHaveBeenCalled();
    });

    it('handles errors and rolls back transaction', async () => {
      // Mock the transaction method to simulate error handling
      jest.spyOn(entityManager, 'transaction').mockImplementation(async (callback: any) => {
        try {
          return await callback();
        } catch (error) {
          throw error;
        }
      });

      // Mock the testSummaryService to throw an error
      const testSummaryService = jest.spyOn(service['testSummaryService'], 'import');
      testSummaryService.mockRejectedValueOnce(new Error('Test error'));

      // Expect the import to throw an error
      await expect(
        service.import([location], payload, userId, []),
      ).rejects.toThrow('Test error');

      // Verify transaction was called
      expect(entityManager.transaction).toHaveBeenCalled();
    });

    it('handles empty arrays in payload', async () => {
      const emptyPayload = new QACertificationImportDTO();
      emptyPayload.orisCode = 1;
      emptyPayload.testSummaryData = [];
      emptyPayload.testExtensionExemptionData = [];
      emptyPayload.certificationEventData = [];

      const result = await service.import([location], emptyPayload, userId, []);

      expect(result).toEqual({
        message: `Successfully Imported QA Certification Data for Facility Id/Oris Code [${emptyPayload.orisCode}]`,
      });
      expect(entityManager.transaction).toHaveBeenCalled();
    });

    it('handles undefined arrays in payload', async () => {
      const undefinedPayload = new QACertificationImportDTO();
      undefinedPayload.orisCode = 1;
      // No arrays defined

      const result = await service.import([location], undefinedPayload, userId, []);

      expect(result).toEqual({
        message: `Successfully Imported QA Certification Data for Facility Id/Oris Code [${undefinedPayload.orisCode}]`,
      });
      expect(entityManager.transaction).toHaveBeenCalled();
    });

    it('handles partial payload with only testSummaryData', async () => {
      const partialPayload = new QACertificationImportDTO();
      partialPayload.orisCode = 1;
      partialPayload.testSummaryData = [new TestSummaryImportDTO()];
      partialPayload.testSummaryData[0].unitId = '1';
      partialPayload.testSummaryData[0].stackPipeId = '1';
      // No other data types

      const testSummaryServiceSpy = jest.spyOn(service['testSummaryService'], 'import');

      const result = await service.import([location], partialPayload, userId, []);

      expect(result).toEqual({
        message: `Successfully Imported QA Certification Data for Facility Id/Oris Code [${partialPayload.orisCode}]`,
      });
      expect(testSummaryServiceSpy).toHaveBeenCalled();
      expect(entityManager.transaction).toHaveBeenCalled();
    });

    it('handles partial payload with only testExtensionExemptionData', async () => {
      const partialPayload = new QACertificationImportDTO();
      partialPayload.orisCode = 1;
      partialPayload.testExtensionExemptionData = [new TestExtensionExemptionImportDTO()];
      partialPayload.testExtensionExemptionData[0].unitId = '1';
      partialPayload.testExtensionExemptionData[0].stackPipeId = '1';
      // No other data types

      const testExtensionExemptionServiceSpy = jest.spyOn(service['testExtensionExemptionService'], 'import');

      const result = await service.import([location], partialPayload, userId, []);

      expect(result).toEqual({
        message: `Successfully Imported QA Certification Data for Facility Id/Oris Code [${partialPayload.orisCode}]`,
      });
      expect(testExtensionExemptionServiceSpy).toHaveBeenCalled();
      expect(entityManager.transaction).toHaveBeenCalled();
    });

    it('handles partial payload with only certificationEventData', async () => {
      const partialPayload = new QACertificationImportDTO();
      partialPayload.orisCode = 1;
      partialPayload.certificationEventData = [new QACertificationEventImportDTO()];
      partialPayload.certificationEventData[0].unitId = '1';
      partialPayload.certificationEventData[0].stackPipeId = '1';
      // No other data types

      const qaCertEventServiceSpy = jest.spyOn(service['qaCertEventService'], 'import');

      const result = await service.import([location], partialPayload, userId, []);

      expect(result).toEqual({
        message: `Successfully Imported QA Certification Data for Facility Id/Oris Code [${partialPayload.orisCode}]`,
      });
      expect(qaCertEventServiceSpy).toHaveBeenCalled();
      expect(entityManager.transaction).toHaveBeenCalled();
    });
  });
});


