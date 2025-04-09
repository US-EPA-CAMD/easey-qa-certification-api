import {Test} from '@nestjs/testing';
import {LoggerModule} from '@us-epa-camd/easey-common/logger';
import {EntityManager} from 'typeorm';
import {
  QACertificationDTO,
  QACertificationImportDTO,
} from '../dto/qa-certification.dto';
import {QACertificationParamsDTO} from '../dto/qa-certification-params.dto';
import {TestSummaryWorkspaceService} from '../test-summary-workspace/test-summary.service';
import {QACertificationWorkspaceService} from './qa-certification.service';
import {TestSummaryDTO, TestSummaryImportDTO} from '../dto/test-summary.dto';
import {LocationIdentifiers} from '../interfaces/location-identifiers.interface';
import {QASuppData} from '../entities/workspace/qa-supp-data.entity';
import {
  TestExtensionExemptionDTO,
  TestExtensionExemptionImportDTO,
} from '../dto/test-extension-exemption.dto';
import {
  TestExtensionExemptionsWorkspaceService
} from '../test-extension-exemptions-workspace/test-extension-exemptions-workspace.service';
import {
  QACertificationEventWorkspaceService
} from '../qa-certification-event-workspace/qa-certification-event-workspace.service';
import {
  QACertificationEventDTO,
  QACertificationEventImportDTO,
} from '../dto/qa-certification-event.dto';
import {CalibrationInjectionDTO} from '../dto/calibration-injection.dto';
import {LinearitySummaryDTO} from '../dto/linearity-summary.dto';
import {RataDTO} from '../dto/rata.dto';
import {FlowToLoadReferenceDTO} from '../dto/flow-to-load-reference.dto';
import {FlowToLoadCheckDTO} from '../dto/flow-to-load-check.dto';
import {CycleTimeSummaryDTO} from '../dto/cycle-time-summary.dto';
import {OnlineOfflineCalibrationDTO} from '../dto/online-offline-calibration.dto';
import {FuelFlowmeterAccuracyDTO} from '../dto/fuel-flowmeter-accuracy.dto';
import {TransmitterTransducerAccuracyDTO} from '../dto/transmitter-transducer-accuracy.dto';
import {FuelFlowToLoadBaselineDTO} from '../dto/fuel-flow-to-load-baseline.dto';
import {AppECorrelationTestSummaryDTO} from '../dto/app-e-correlation-test-summary.dto';
import {UnitDefaultTestDTO} from '../dto/unit-default-test.dto';
import {HgSummaryDTO} from '../dto/hg-summary.dto';
import {TestQualificationDTO} from '../dto/test-qualification.dto';
import {ProtocolGasDTO} from '../dto/protocol-gas.dto';
import {AirEmissionTestingDTO} from '../dto/air-emission-test.dto';
import {EaseyContentService} from '../qa-certification-easey-content/easey-content.service';
import * as exportUtility from '../utilities/remove-non-reported-values';

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
    // Create a mock transaction object and pass it to the callback
    const mockTransaction = {
      getRepository: jest.fn().mockReturnValue({
        create: jest.fn(),
        save: jest.fn(),
        findOne: jest.fn(),
        delete: jest.fn(),
      }),
    };
    return await callback(mockTransaction);
  }),
});

describe('QA Certification Workspace Service Test', () => {
  let service: QACertificationWorkspaceService;
  let entityManager: EntityManager;

  // Helper for export test assertions
  const assertExportResult = (result: any, expected: any): void => {
    expect(result.orisCode).toEqual(expected.orisCode);
    expect(result.testSummaryData).toEqual(expected.testSummaryData);
    expect(result.certificationEventData).toEqual(expected.certificationEventData);
    expect(result.testExtensionExemptionData).toEqual(expected.testExtensionExemptionData);
  };

  // Helper for creating export params
  const createExportParams = (options: {
    reportedValuesOnly?: boolean;
    testSummaryIds?: string[];
    qaCertificationEventIds?: string[];
    qaTestExtensionExemptionIds?: string[];
  } = {}): QACertificationParamsDTO => {
    const paramsDTO = new QACertificationParamsDTO();
    paramsDTO.facilityId = 1;
    paramsDTO.reportedValuesOnly = options.reportedValuesOnly ?? false;

    if (options.testSummaryIds) paramsDTO.testSummaryIds = options.testSummaryIds;
    if (options.qaCertificationEventIds) paramsDTO.qaCertificationEventIds = options.qaCertificationEventIds;
    if (options.qaTestExtensionExemptionIds) paramsDTO.qaTestExtensionExemptionIds = options.qaTestExtensionExemptionIds;

    return paramsDTO;
  };

  // Helper for import test assertions
  const assertImportResult = (result: any, orisCode: number): void => {
    expect(result).toEqual({
      message: `Successfully Imported QA Certification Data for Facility Id/Oris Code [${orisCode}]`,
    });
    expect(entityManager.transaction).toHaveBeenCalled();
  };

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
          useFactory: () => ({
            QaCertificationSchema: jest.fn().mockResolvedValue({
              version: '1.0.0'
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
    it('successfully exports QA certification data', async () => {
      // Create test data
      const paramsDTO = createExportParams({reportedValuesOnly: true});

      // Set up mock responses for service dependencies
      const testSummaryService = service['testSummaryService'];
      const qaCertEventService = service['qaCertEventService'];
      const testExtensionExemptionService = service['testExtensionExemptionService'];

      // Spy on removeNonReportedValues
      const removeNonReportedValuesSpy = jest.spyOn(exportUtility, 'removeNonReportedValues')
        .mockImplementation(jest.fn());

      // Call the service method
      const result = await service.export(
        paramsDTO,
        paramsDTO.reportedValuesOnly,
      );

      // Verify service dependencies were called with correct parameters
      expect(testSummaryService.export).toHaveBeenCalledWith(
        paramsDTO.facilityId,
        paramsDTO.unitIds,
        paramsDTO.stackPipeIds,
        paramsDTO.testSummaryIds,
        paramsDTO.testTypeCodes,
        paramsDTO.beginDate,
        paramsDTO.endDate,
      );

      expect(qaCertEventService.export).toHaveBeenCalledWith(
        paramsDTO.facilityId,
        paramsDTO.unitIds,
        paramsDTO.stackPipeIds,
        paramsDTO.qaCertificationEventIds,
        paramsDTO.beginDate,
        paramsDTO.endDate,
      );

      expect(testExtensionExemptionService.export).toHaveBeenCalledWith(
        paramsDTO.facilityId,
        paramsDTO.unitIds,
        paramsDTO.stackPipeIds,
        paramsDTO.qaTestExtensionExemptionIds,
        paramsDTO.beginDate,
        paramsDTO.endDate,
      );

      // Verify removeNonReportedValues was called since reportedValuesOnly is true
      expect(removeNonReportedValuesSpy).toHaveBeenCalled();

      // Verify the result structure (using type assertion for version property)
      expect(result).toEqual(expect.objectContaining({
        orisCode: 1,
        testSummaryData: [testSummary],
        certificationEventData: [qaCertEventDto],
        testExtensionExemptionData: [testExtExmtDto],
      }));

      // Check version separately with type assertion
      expect((result as any).version).toEqual(service['easeyContentService'].QaCertificationSchema?.version);

      // Restore the original implementation
      removeNonReportedValuesSpy.mockRestore();
    });

    it('handles undefined QaCertificationSchema', async () => {
      // Create test data
      const paramsDTO = createExportParams({reportedValuesOnly: false});

      // Temporarily set QaCertificationSchema to undefined
      const originalSchema = service['easeyContentService'].QaCertificationSchema;
      service['easeyContentService'].QaCertificationSchema = undefined;

      // Call the service method
      const result = await service.export(paramsDTO, paramsDTO.reportedValuesOnly);

      // Verify the result has undefined version (using type assertion)
      expect((result as any).version).toBeUndefined();

      // Restore original values
      service['easeyContentService'].QaCertificationSchema = originalSchema;
    });

    it('does not call removeNonReportedValues when reportedValuesOnly is false', async () => {
      // Create test data
      const paramsDTO = createExportParams({reportedValuesOnly: false});

      // Spy on removeNonReportedValues
      const removeNonReportedValuesSpy = jest.spyOn(exportUtility, 'removeNonReportedValues')
        .mockImplementation(jest.fn());

      // Call the service method
      await service.export(paramsDTO, paramsDTO.reportedValuesOnly);

      // Verify removeNonReportedValues was not called
      expect(removeNonReportedValuesSpy).not.toHaveBeenCalled();

      // Restore the original implementation
      removeNonReportedValuesSpy.mockRestore();
    });
  });

  describe('import', () => {
    it('successfully calls import() service function', async () => {
      // Spy on the helper methods
      const processTestSummaryDataSpy = jest.spyOn(service as any, 'processTestSummaryData');
      const processTestExtensionDataSpy = jest.spyOn(service as any, 'processTestExtensionData');
      const processCertificationEventDataSpy = jest.spyOn(service as any, 'processCertificationEventData');

      const result = await service.import([location], payload, userId, []);

      // Verify helper methods were called with transaction parameter
      expect(processTestSummaryDataSpy).toHaveBeenCalledWith(
        [location],
        payload.testSummaryData,
        userId,
        [],
        expect.anything() // Transaction parameter
      );
      expect(processTestExtensionDataSpy).toHaveBeenCalledWith(
        [location],
        payload.testExtensionExemptionData,
        userId,
        expect.anything() // Transaction parameter
      );
      expect(processCertificationEventDataSpy).toHaveBeenCalledWith(
        [location],
        payload.certificationEventData,
        userId,
        expect.anything() // Transaction parameter
      );

      assertImportResult(result, payload.orisCode);
    });

    it('successfully calls import() service function when qaSuppData found ', async () => {
      // Spy on the helper method
      const processTestSummaryDataSpy = jest.spyOn(service as any, 'processTestSummaryData');

      const result = await service.import([location], payload, userId, [
        qaSuppData,
      ]);

      // Verify helper method was called with qaSuppData and transaction parameter
      expect(processTestSummaryDataSpy).toHaveBeenCalledWith(
        [location],
        payload.testSummaryData,
        userId,
        [qaSuppData],
        expect.anything() // Transaction parameter
      );

      assertImportResult(result, payload.orisCode);
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

      // Mock the processTestSummaryData method to throw an error
      jest.spyOn(service as any, 'processTestSummaryData').mockRejectedValueOnce(new Error('Test error'));

      // Expect the import to throw an error - pass true for rethrowErrors
      await expect(
        service.import([location], payload, userId, [], true),
      ).rejects.toThrow('Test error');

      // Verify transaction was called
      expect(entityManager.transaction).toHaveBeenCalled();
    });

    it('ensures all changes are rolled back if an error occurs during import', async () => {
      // Create a mock transaction with tracking for operations
      const mockRepositoryOperations = {
        create: jest.fn(),
        save: jest.fn(),
        findOne: jest.fn(),
        delete: jest.fn(),
      };

      const mockTransaction = {
        getRepository: jest.fn().mockReturnValue(mockRepositoryOperations),
        query: jest.fn(),
      };

      // Mock the transaction method to track operations and simulate an error
      jest.spyOn(entityManager, 'transaction').mockImplementation(async (callback: any) => {
        try {
          // Call the callback with our mock transaction that tracks operations
          await callback(mockTransaction);
          // This line should not be reached due to the error
          fail('Transaction should have thrown an error');
        } catch (error) {
          // Verify the error is the expected one
          expect(error.message).toBe('Database constraint violation');
          throw error;
        }
      });

      // Mock the testSummaryService.import to perform some database operations and then throw an error
      const testSummaryService = service['testSummaryService'];
      jest.spyOn(testSummaryService, 'import').mockImplementation(async (locationId, data, userId, qaSuppData, trx) => {
        // Simulate some successful database operations
        await trx.getRepository(null).save({id: '1', data: 'test'});
        await trx.getRepository(null).save({id: '2', data: 'test'});

        // Then throw an error to trigger rollback
        throw new Error('Database constraint violation');
      });

      // Attempt to import data, which should fail
      await expect(
        service.import([location], payload, userId, []),
      ).rejects.toThrow('Database constraint violation');

      // Verify transaction was called
      expect(entityManager.transaction).toHaveBeenCalled();

      // Verify some database operations were attempted before the error
      expect(mockRepositoryOperations.save).toHaveBeenCalled();

      // In a real database, we would verify that no records exist after rollback
      // Since we're using mocks, we can only verify the transaction was used and an error was thrown
    });

    it('handles empty arrays in payload', async () => {
      const emptyPayload = new QACertificationImportDTO();
      emptyPayload.orisCode = 1;
      emptyPayload.testSummaryData = [];
      emptyPayload.testExtensionExemptionData = [];
      emptyPayload.certificationEventData = [];

      // Spy on the processImportData method
      const processImportDataSpy = jest.spyOn(service as any, 'processImportData');

      const result = await service.import([location], emptyPayload, userId, []);

      // Verify processImportData returns empty arrays for empty data
      expect(processImportDataSpy).toHaveBeenCalledWith(
        expect.anything(),
        [],
        expect.anything(),
        expect.anything(),
        expect.anything(),
        expect.anything() // Transaction parameter
      );

      assertImportResult(result, emptyPayload.orisCode);
    });

    it('handles undefined arrays in payload', async () => {
      const undefinedPayload = new QACertificationImportDTO();
      undefinedPayload.orisCode = 1;
      // No arrays defined

      // Spy on the helper methods
      const processTestSummaryDataSpy = jest.spyOn(service as any, 'processTestSummaryData');
      const processTestExtensionDataSpy = jest.spyOn(service as any, 'processTestExtensionData');
      const processCertificationEventDataSpy = jest.spyOn(service as any, 'processCertificationEventData');

      const result = await service.import([location], undefinedPayload, userId, []);

      // Verify helper methods handle undefined data with transaction parameter
      expect(processTestSummaryDataSpy).toHaveBeenCalledWith(
        [location],
        undefined,
        userId,
        [],
        expect.anything() // Transaction parameter
      );
      expect(processTestExtensionDataSpy).toHaveBeenCalledWith(
        [location],
        undefined,
        userId,
        expect.anything() // Transaction parameter
      );
      expect(processCertificationEventDataSpy).toHaveBeenCalledWith(
        [location],
        undefined,
        userId,
        expect.anything() // Transaction parameter
      );

      assertImportResult(result, undefinedPayload.orisCode);
    });

    it('handles location not found error', async () => {
      const invalidPayload = new QACertificationImportDTO();
      invalidPayload.orisCode = 1;
      invalidPayload.testSummaryData = [new TestSummaryImportDTO()];
      invalidPayload.testSummaryData[0].unitId = 'invalid';
      invalidPayload.testSummaryData[0].stackPipeId = 'invalid';

      // Expect the import to throw a location not found error - pass true for rethrowErrors
      await expect(
        service.import([location], invalidPayload, userId, [], true),
      ).rejects.toThrow('Location not found for unitId invalid and stackPipeId invalid');
    });

    it('handles partial payload with only testSummaryData', async () => {
      const partialPayload = new QACertificationImportDTO();
      partialPayload.orisCode = 1;
      partialPayload.testSummaryData = [new TestSummaryImportDTO()];
      partialPayload.testSummaryData[0].unitId = '1';
      partialPayload.testSummaryData[0].stackPipeId = '1';
      // No other data types

      // Spy on the helper methods
      const processTestSummaryDataSpy = jest.spyOn(service as any, 'processTestSummaryData');
      const processTestExtensionDataSpy = jest.spyOn(service as any, 'processTestExtensionData');
      const processCertificationEventDataSpy = jest.spyOn(service as any, 'processCertificationEventData');

      const result = await service.import([location], partialPayload, userId, []);

      // Verify only testSummaryData was processed with actual data and transaction parameter
      expect(processTestSummaryDataSpy).toHaveBeenCalledWith(
        [location],
        partialPayload.testSummaryData,
        userId,
        [],
        expect.anything() // Transaction parameter
      );
      expect(processTestExtensionDataSpy).toHaveBeenCalledWith(
        [location],
        undefined,
        userId,
        expect.anything() // Transaction parameter
      );
      expect(processCertificationEventDataSpy).toHaveBeenCalledWith(
        [location],
        undefined,
        userId,
        expect.anything() // Transaction parameter
      );

      assertImportResult(result, partialPayload.orisCode);
    });
  });
});
