import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { TestSummaryService } from '../test-summary/test-summary.service';
import { QACertificationParamsDTO } from '../dto/qa-certification-params.dto';
import { QACertificationService } from './qa-certification.service';
import { QaCertificationEventService } from '../qa-certification-event/qa-certification-event.service';
import { QACertificationDTO } from '../dto/qa-certification.dto';
import { TestSummaryDTO } from '../dto/test-summary.dto';
import { TestExtensionExemptionDTO } from '../dto/test-extension-exemption.dto';
import { TestExtensionExemptionsService } from '../test-extension-exemptions/test-extension-exemptions.service';

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
      ],
    }).compile();

    service = module.get(QACertificationService);
    testSummaryService = module.get(TestSummaryService);
    qaCertEventService = module.get(QaCertificationEventService);
    testExtensionExemptionsService = module.get(TestExtensionExemptionsService);
  });

  describe('export test', () => {
    it('successfully calls export() service function', async () => {
      const paramsDTO = new QACertificationParamsDTO();
      paramsDTO.facilityId = 1;
      const qaCertEventDto = new QACertificationDTO();
      const testSumDto = new TestSummaryDTO();
      const testExtExmtDto = new TestExtensionExemptionDTO();
      const expected = {
        orisCode: 1,
        certificationEventData: [qaCertEventDto],
        testExtensionExemptionData: [testExtExmtDto],
        testSummaryData: [testSumDto],
      };
      testSummaryService.export.mockResolvedValue([testSumDto]);
      qaCertEventService.export.mockResolvedValue([qaCertEventDto]);
      testExtensionExemptionsService.export.mockResolvedValue([testExtExmtDto]);
      const result = await service.export(paramsDTO);

      expect(result).toEqual(expected);
    });
  });
});
