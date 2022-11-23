import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { LinearitySummary } from '../entities/workspace/linearity-summary.entity';
import { LinearitySummaryBaseDTO } from '../dto/linearity-summary.dto';
import { LinearitySummaryChecksService } from './linearity-summary-checks.service';
import { LinearitySummaryWorkspaceRepository } from './linearity-summary.repository';
import { TestSummaryMasterDataRelationshipRepository } from '../test-summary-master-data-relationship/test-summary-master-data-relationship.repository';
import { TestSummary } from '../entities/workspace/test-summary.entity';
import { TestSummaryWorkspaceRepository } from '../test-summary-workspace/test-summary.repository';

const testSumId = '1';
const MOCK_ERROR_MSG = 'MOCK_ERROR_MSG';

const mockTestSummaryRelationshipRepository = () => ({
  getTestTypeCodesRelationships: jest
    .fn()
    .mockResolvedValue([{ testResultCode: 'PASSED' }]),
});

const mockTestSummaryRepository = () => ({
  getTestSummaryById: jest.fn().mockResolvedValue(new TestSummary()),
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
        {
          provide: TestSummaryWorkspaceRepository,
          useFactory: mockTestSummaryRepository,
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
      const result = await service.runChecks(payload, testSumId);

      expect(result).toEqual([]);
    });
  });

  describe('LINEAR-15 Linearity Summary Calibration Gas Level Valid', () => {
    const payload = new LinearitySummary();
    it('Should get GasLevelCode is null error', async () => {
      payload.gasLevelCode = null;
      jest.spyOn(repository, 'findOne').mockResolvedValue(payload);

      try {
        await service.runChecks(payload, testSumId, false, false);
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
    });
    it('Should get GasLevelCode is not equal to "HIGH", "MID", or "LOW" error', async () => {
      payload.gasLevelCode = 'NOTHIGH';
      jest.spyOn(repository, 'findOne').mockResolvedValue(payload);

      try {
        await service.runChecks(payload, testSumId, false, false);
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG]);
      }
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
        await service.runChecks(payload, testSumId);
      } catch (err) {
        expect(err.response.message).toEqual([MOCK_ERROR_MSG, MOCK_ERROR_MSG]);
      }
    });
  });
});
