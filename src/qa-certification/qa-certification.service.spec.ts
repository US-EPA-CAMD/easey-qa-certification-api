import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { TestSummaryService } from '../test-summary/test-summary.service';
import { QACertificationParamsDTO } from '../dto/qa-certification-params.dto';
import { QACertificationService } from './qa-certification.service';
import { QaCertificationEventService } from '../qa-certification-event/qa-certification-event.service';
import { QACertificationDTO } from '../dto/qa-certification.dto';
import { TestSummaryDTO } from '../dto/test-summary.dto';

const mockTestSummaryService = () => ({
  export: jest.fn(),
});

const mockQACertEventService = () => ({
  export: jest.fn(),
});
describe('QA Certification Service', () => {
  let service: QACertificationService;
  let testSummaryService: any;
  let qaCertEventService: any;

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
      ],
    }).compile();

    service = module.get(QACertificationService);
    testSummaryService = module.get(TestSummaryService);
    qaCertEventService = module.get(QaCertificationEventService);
  });

  describe('export test', () => {
    it('successfully calls export() service function', async () => {
      const paramsDTO = new QACertificationParamsDTO();
      paramsDTO.facilityId = 1;
      const qaCertEventDto = new QACertificationDTO();
      const testSumDto = new TestSummaryDTO();
      const expected = {
        orisCode: 1,
        certificationEventData: [qaCertEventDto],
        testExtensionExemptionData: undefined,
        testSummaryData: [testSumDto],
      };
      testSummaryService.export.mockResolvedValue([testSumDto]);
      qaCertEventService.export.mockResolvedValue([qaCertEventDto]);
      const result = await service.export(paramsDTO);

      expect(result).toEqual(expected);
    });
  });
});
