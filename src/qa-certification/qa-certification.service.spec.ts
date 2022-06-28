import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { TestSummaryService } from '../test-summary/test-summary.service';
import { QACertificationParamsDTO } from '../dto/qa-certification-params.dto';
import { QACertificationService } from './qa-certification.service';

describe('QA Certification Service', () => {
  let service: QACertificationService;
  let testSummaryService: any;

  const mockTestSummaryService = () => ({
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
      ],
    }).compile();

    service = module.get(QACertificationService);
    testSummaryService = module.get(TestSummaryService);
  });

  describe('export test', () => {
    it('successfully calls export() service function', async () => {
      const paramsDTO = new QACertificationParamsDTO();
      const expected = { testSummaryData: [] };
      testSummaryService.export.mockResolvedValue([]);
      const result = await service.export(paramsDTO);

      expect(result).toEqual(expected);
    });
  });
});
