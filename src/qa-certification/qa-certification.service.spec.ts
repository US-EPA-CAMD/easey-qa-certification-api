import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { TestSummaryService } from '../test-summary/test-summary.service';
import { QACertificationParamsDTO } from '../dto/qa-certification-params.dto';
import { QACertificationService } from './qa-certification.service';
import { TestExtensionExemptionsService } from '../test-extension-exemptions/test-extension-exemptions.service';

describe('QA Certification Service', () => {
  let service: QACertificationService;
  let testSummaryService: any;
  let testExtExemService: any;

  const mockTestSummaryService = () => ({
    export: jest.fn(),
  });

  const mockTestExtExemService = () => ({
    export: jest.fn(),
  });

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
          provide: TestExtensionExemptionsService,
          useFactory: mockTestExtExemService,
        },
      ],
    }).compile();

    service = module.get(QACertificationService);
    testSummaryService = module.get(TestSummaryService);
    testExtExemService = module.get(TestExtensionExemptionsService);
  });

  describe('export test', () => {
    it('successfully calls export() service function', async () => {
      const paramsDTO = new QACertificationParamsDTO();
      paramsDTO.facilityId = 1;
      const expected = {
        orisCode: 1,
        certificationEventData: [],
        testExtensionExemptionData: [],
        testSummaryData: [],
      };
      testSummaryService.export.mockResolvedValue([]);
      testExtExemService.export.mockResolvedValue([]);
      const result = await service.export(paramsDTO);

      expect(result).toEqual(expected);
    });
  });
});
