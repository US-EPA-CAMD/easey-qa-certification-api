import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { QACertificationParamsDTO } from '../dto/qa-certification-params.dto';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { QACertificationWorkspaceService } from './qa-certification-workspace.service';

describe('QA Certification Workspace Service Test', () => {
  let service: QACertificationWorkspaceService;
  let testSummaryService: any;

  const mockTestSummaryWorkspaceService = () => ({
    export: jest.fn(),
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        QACertificationWorkspaceService,
        {
          provide: TestSummaryWorkspaceService,
          useFactory: mockTestSummaryWorkspaceService,
        },
      ],
    }).compile();

    service = module.get(QACertificationWorkspaceService);
    testSummaryService = module.get(TestSummaryWorkspaceService);
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
