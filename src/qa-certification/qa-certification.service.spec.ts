import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { TestSummaryService } from '../test-summary/test-summary.service';
import { QACertificationParamsDTO } from '../dto/qa-certification-params.dto';
import { QACertificationService } from './qa-certification.service';
import { QaCertificationEventService } from '../qa-certification-event/qa-certification-event.service';
import { QACertificationDTO } from '../dto/qa-certification.dto';
import { TestSummaryDTO } from '../dto/test-summary.dto';
import { TestExtensionExemptionDTO } from '../dto/test-extension-exemption.dto';
import { QACertificationEventDTO } from '../dto/qa-certification-event.dto';
import { TestExtensionExemptionsService } from '../test-extension-exemptions/test-extension-exemptions.service';
import { EaseyContentService } from '../qa-certification-easey-content/easey-content.service';
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
          useFactory:  () => ({
            QaCertificationSchema: jest.fn().mockResolvedValue({
              version : '1.0.0'
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
    it('successfully calls the export utility function', async () => {
      // Create test data
      const paramsDTO = new QACertificationParamsDTO();
      paramsDTO.reportedValuesOnly = true;
      paramsDTO.facilityId = 1;
      const qaCertEventDto = new QACertificationEventDTO();
      const testSumDto = new TestSummaryDTO();
      const testExtExmtDto = new TestExtensionExemptionDTO();
      const expected = new QACertificationDTO();
      expected.orisCode = 1;
      expected.certificationEventData = [qaCertEventDto];
      expected.testExtensionExemptionData = [testExtExmtDto];
      expected.testSummaryData = [testSumDto];

      // Spy on the utility function
      const buildExportSpy = jest.spyOn(exportUtility, 'buildQACertificationExport')
        .mockResolvedValue(expected);

      // Call the service method
      const result = await service.export(
        paramsDTO,
        paramsDTO.reportedValuesOnly,
      );

      // Verify the utility function was called with correct parameters
      expect(buildExportSpy).toHaveBeenCalledWith(
        paramsDTO,
        {
          testSummaryService: service['testSummaryService'],
          qaCertEventService: service['qaCertEventService'],
          testExtensionExemptionService: service['testExtensionExemptionService'],
        },
        service['easeyContentService'].QaCertificationSchema?.version,
        paramsDTO.reportedValuesOnly,
      );

      // Verify the result is correct
      expect(result).toEqual(expected);

      // Restore the original implementation
      buildExportSpy.mockRestore();
    });

    it('handles undefined QaCertificationSchema', async () => {
      // Create test data
      const paramsDTO = new QACertificationParamsDTO();
      paramsDTO.reportedValuesOnly = false;
      paramsDTO.facilityId = 1;
      const expected = new QACertificationDTO();

      // Temporarily set QaCertificationSchema to undefined
      const originalSchema = service['easeyContentService'].QaCertificationSchema;
      service['easeyContentService'].QaCertificationSchema = undefined;

      // Spy on the utility function
      const buildExportSpy = jest.spyOn(exportUtility, 'buildQACertificationExport')
        .mockResolvedValue(expected);

      // Call the service method
      await service.export(paramsDTO, paramsDTO.reportedValuesOnly);

      // Verify the utility function was called with undefined version
      expect(buildExportSpy).toHaveBeenCalledWith(
        paramsDTO,
        expect.any(Object),
        undefined, // Schema version should be undefined
        paramsDTO.reportedValuesOnly,
      );

      // Restore original values
      service['easeyContentService'].QaCertificationSchema = originalSchema;
      buildExportSpy.mockRestore();
    });
  });
});
