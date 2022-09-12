import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { LinearitySummary } from '../entities/workspace/linearity-summary.entity';
import { LinearitySummaryBaseDTO } from '../dto/linearity-summary.dto';
import { LinearitySummaryChecksService } from './linearity-summary-checks.service';
import { LinearitySummaryWorkspaceRepository } from './linearity-summary.repository';
import { TestSummaryMasterDataRelationshipRepository } from '../test-summary-master-data-relationship/test-summary-master-data-relationship.repository';

const testSumId = '1';
const MOCK_ERROR_MSG = 'MOCK_ERROR_MSG';

const mockTestSummaryRelationshipRepository = () => ({
  getTestTypeCodesRelationships: jest
    .fn()
    .mockResolvedValue([{ testResultCode: 'PASSED' }]),
});

describe('Linearity Summary Check Service Test', () => {
  let service: LinearitySummaryChecksService;
  let repository: LinearitySummaryWorkspaceRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        LinearitySummaryChecksService,
        {
          provide: TestSummaryMasterDataRelationshipRepository,
          useFactory: mockTestSummaryRelationshipRepository,
        },
        {
          provide: LinearitySummaryWorkspaceRepository,
          useFactory: () => ({
            findOne: jest.fn(),
          }),
        },
      ],
    }).compile();

    service = module.get(LinearitySummaryChecksService);
    repository = module.get(LinearitySummaryWorkspaceRepository);

    jest.spyOn(service, 'getMessage').mockReturnValue(MOCK_ERROR_MSG);
  });

  describe('Linearity Injection Checks', () => {
    const payload = new LinearitySummaryBaseDTO();
    it('Should pass all checks', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      const result = await service.runChecks(testSumId, payload);

      expect(result).toEqual([]);
    });
  });

  describe('LINEAR-32 Duplicate Linearity Summary (Result A)', () => {
    const payload = new LinearitySummaryBaseDTO();
    payload.gasLevelCode = 'LOW';

    const returnValue = new LinearitySummary();
    returnValue.gasLevelCode = 'LOW';

    it('Should get already exists error', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(returnValue);
      try {
        await service.runChecks(testSumId, payload);
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG, MOCK_ERROR_MSG]);
      }
    });
  });
});
