import { Test } from '@nestjs/testing';
import { LoggerModule } from '@us-epa-camd/easey-common/logger';
import { UnitDefaultTestRun } from '../entities/workspace/unit-default-test-run.entity';
import { UnitDefaultTestRunBaseDTO } from '../dto/unit-default-test-run.dto';
import { UnitDefaultTestRunChecksService } from './unit-default-test-run-checks.service';
import { UnitDefaultTestRunWorkspaceRepository } from './unit-default-test-run.repository';
import { TestSummary } from '../entities/workspace/test-summary.entity';
import { TestSummaryWorkspaceRepository } from '../test-summary-workspace/test-summary.repository';
import { TestTypeCodes } from '../enums/test-type-code.enum';

const testSumId = '1';
const unitDefaultTestSumId = '1';
const MOCK_ERROR_MSG = 'MOCK_ERROR_MSG';
const testSumRecord = new TestSummary();
testSumRecord.testTypeCode = TestTypeCodes.UNITDEF;

const mockTestSummaryRepository = () => ({
  getTestSummaryById: jest.fn().mockResolvedValue(new TestSummary()),
});

describe('Linearity Summary Check Service Test', () => {
  let service: UnitDefaultTestRunChecksService;
  let repository: UnitDefaultTestRunWorkspaceRepository;
  let testSumRepository: TestSummaryWorkspaceRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [LoggerModule],
      providers: [
        UnitDefaultTestRunChecksService,
        {
          provide: UnitDefaultTestRunWorkspaceRepository,
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

    service = module.get(UnitDefaultTestRunChecksService);
    repository = module.get(UnitDefaultTestRunWorkspaceRepository);
    testSumRepository = module.get(TestSummaryWorkspaceRepository);

    jest.spyOn(service, 'getMessage').mockReturnValue(MOCK_ERROR_MSG);
  });

  describe('Unit Default Test Run Checks', () => {
    const payload = new UnitDefaultTestRunBaseDTO();
    it('Should pass all checks', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      jest
        .spyOn(testSumRepository, 'getTestSummaryById')
        .mockResolvedValue(testSumRecord);

      const result = await service.runChecks(
        payload,
        false,
        false,
        unitDefaultTestSumId,
        testSumId,
      );

      expect(result).toEqual([]);
    });
  });

  describe('UNITDEF-29 Duplicate Unit Default Test Run (Result A)', () => {
    const payload = new UnitDefaultTestRunBaseDTO();
    payload.operatingLevelForRun = 1;
    payload.runNumber = 1;

    const returnValue = new UnitDefaultTestRun();
    returnValue.operatingLevelForRun = 1;
    returnValue.runNumber = 1;

    it('Should get already exists error', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(returnValue);
      jest
        .spyOn(testSumRepository, 'getTestSummaryById')
        .mockResolvedValue(testSumRecord);
      try {
        await service.runChecks(
          payload,
          false,
          false,
          unitDefaultTestSumId,
          testSumId,
        );
      } catch (err) {
        expect(err.response.message).toEqual(MOCK_ERROR_MSG);
      }
    });
  });
});
