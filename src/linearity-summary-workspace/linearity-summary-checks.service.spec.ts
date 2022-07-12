import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { LinearitySummaryBaseDTO } from '../dto/linearity-summary.dto';
import { LinearitySummaryChecksService } from './linearity-summary-checks.service';
import { LinearitySummaryWorkspaceRepository } from './linearity-summary.repository';

const testSumId = '1';

describe('Linearity Summary Check Service Test', () => {
  let service: LinearitySummaryChecksService;
  let repository: LinearitySummaryWorkspaceRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        LinearitySummaryChecksService,
        {
          provide: LinearitySummaryWorkspaceRepository,
          useFactory: () => ({
            getSummariesByTestSumId: jest.fn(),
          }),
        },
      ],
    }).compile();

    service = module.get(LinearitySummaryChecksService);
    repository = module.get(LinearitySummaryWorkspaceRepository);
  });

  describe('Linearity Injection Checks', () => {
    const payload = new LinearitySummaryBaseDTO();
    it('Should pass all checks', async () => {
      jest.spyOn(repository, 'getSummariesByTestSumId').mockResolvedValue([]);
      const result = await service.runChecks(testSumId, payload);

      expect(result).toEqual([]);
    });
  });
});
