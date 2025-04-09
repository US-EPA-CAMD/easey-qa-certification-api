import {Test} from '@nestjs/testing';
import {LoggerModule} from '@us-epa-camd/easey-common/logger';
import {TestSummaryService} from '../test-summary/test-summary.service';
import {QACertificationParamsDTO} from '../dto/qa-certification-params.dto';
import {QACertificationService} from './qa-certification.service';
import {QaCertificationEventService} from '../qa-certification-event/qa-certification-event.service';
import {QACertificationDTO} from '../dto/qa-certification.dto';
import {TestSummaryDTO} from '../dto/test-summary.dto';
import {TestExtensionExemptionDTO} from '../dto/test-extension-exemption.dto';
import {QACertificationEventDTO} from '../dto/qa-certification-event.dto';
import {TestExtensionExemptionsService} from '../test-extension-exemptions/test-extension-exemptions.service';
import {EaseyContentService} from '../qa-certification-easey-content/easey-content.service';
import * as exportUtility from '../utilities/remove-non-reported-values';

const mockTestSummaryService = () => ({
  export: jest.fn(),
});

const mockQACertEventService = () => ({
  export: jest.fn(),
});

const mockTestExtensionExemptionsService = () => ({
  export: jest.fn(),
});
describe('QA Certification Service', () => {
  let service: QACertificationService;
  let testSummaryService: any;
  let qaCertEventService: any;
  let testExtensionExemptionsService: any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        QACertificationService,
        {
          provide: TestSummaryService,
          useFactory: mockTestSummaryService,
        },
        {
          provide: QaCertificationEventService,
          useFactory: mockQACertEventService,
        },
        {
          provide: TestExtensionExemptionsService,
          useFactory: mockTestExtensionExemptionsService,
        },
        {
          provide: EaseyContentService,
          useFactory: () => ({
            QaCertificationSchema: jest.fn().mockResolvedValue({
              version: '1.0.0'
            }),
          })
        }
      ],
    }).compile();

    service = module.get(QACertificationService);
    testSummaryService = module.get(TestSummaryService);
    qaCertEventService = module.get(QaCertificationEventService);
    testExtensionExemptionsService = module.get(TestExtensionExemptionsService);
  });

  describe('export test', () => {
    it('successfully exports QA certification data', async () => {
      // Create test data
      const paramsDTO = new QACertificationParamsDTO();
      paramsDTO.reportedValuesOnly = true;
      paramsDTO.facilityId = 1;
      const qaCertEventDto = new QACertificationEventDTO();
      const testSumDto = new TestSummaryDTO();
      const testExtExmtDto = new TestExtensionExemptionDTO();

      // Set up mock responses for service dependencies
      testSummaryService.export.mockResolvedValue([testSumDto]);
      qaCertEventService.export.mockResolvedValue([qaCertEventDto]);
      testExtensionExemptionsService.export.mockResolvedValue([testExtExmtDto]);

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

      expect(testExtensionExemptionsService.export).toHaveBeenCalledWith(
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
        testSummaryData: [testSumDto],
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
      const paramsDTO = new QACertificationParamsDTO();
      paramsDTO.reportedValuesOnly = false;
      paramsDTO.facilityId = 1;

      // Set up mock responses for service dependencies
      testSummaryService.export.mockResolvedValue([]);
      qaCertEventService.export.mockResolvedValue([]);
      testExtensionExemptionsService.export.mockResolvedValue([]);

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
      const paramsDTO = new QACertificationParamsDTO();
      paramsDTO.reportedValuesOnly = false;
      paramsDTO.facilityId = 1;

      // Set up mock responses for service dependencies
      testSummaryService.export.mockResolvedValue([]);
      qaCertEventService.export.mockResolvedValue([]);
      testExtensionExemptionsService.export.mockResolvedValue([]);

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
});
