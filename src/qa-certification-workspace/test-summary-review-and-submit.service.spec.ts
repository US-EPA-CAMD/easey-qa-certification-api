import { Test, TestingModule } from '@nestjs/testing';
import { EntityManager } from 'typeorm';

jest.mock('@us-epa-camd/easey-common/utilities/functions', () => ({
    ...jest.requireActual('@us-epa-camd/easey-common/utilities/functions'),
    withTransaction: jest.fn().mockImplementation((repo) => repo),
  }));

import { ReviewAndSubmitTestSummaryDTO } from '../dto/review-and-submit-test-summary.dto';
import { ReviewAndSubmitTestSummaryMap } from '../maps/review-and-submit-test-summary.map';
import { TestSummaryReviewAndSubmitGlobalRepository } from './test-summary-review-and-submit-global.repository';
import { TestSummaryReviewAndSubmitRepository } from './test-summary-review-and-submit.repository';
import { TestSummaryReviewAndSubmitService } from './test-summary-review-and-submit.service';

const dto = new ReviewAndSubmitTestSummaryDTO();
dto.beginDate = '2021-04-04';
dto.endDate = '2021-04-05';
dto.periodAbbreviation = '2022 Q1';
dto.testSumId = 'testSumId1';
dto.evalStatusCode = 'PENDING';

const dto2 = new ReviewAndSubmitTestSummaryDTO();
dto2.beginDate = '2022-04-04';
dto2.endDate = '2022-04-05';
dto2.periodAbbreviation = '';

const mockRepo = () => ({
  find: jest.fn().mockImplementation(args => {
    if (args?.where?.['monPlanId']) {
      return [new ReviewAndSubmitTestSummaryDTO()];
    } else if (args?.where?.['testSumId']) {
      return [dto];
    } else {
      return [dto, dto2];
    }
  }),
});

const mockMap = () => ({
  many: jest.fn().mockImplementation(args => {
    return args;
  }),
});

const mockEntityManager = {
  query: jest.fn().mockResolvedValue([{}]),
  find: jest.fn().mockResolvedValue([
    {
      periodAbbreviation: '2022 Q1',
      beginDate: '2021-03-01',
      endDate: '2021-05-31',
    },
  ]),
} as any;

describe('TestSummaryReviewAndSubmitService', () => {
  let service: TestSummaryReviewAndSubmitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [],
      providers: [
        TestSummaryReviewAndSubmitService,
         {
          provide: EntityManager,
          useValue: mockEntityManager,
        },
        { provide: ReviewAndSubmitTestSummaryMap, useFactory: mockMap },
        { provide: TestSummaryReviewAndSubmitRepository, useFactory: mockRepo },
        {
          provide: TestSummaryReviewAndSubmitGlobalRepository,
          useFactory: mockRepo,
        },
      ],
    }).compile();

    service = module.get<TestSummaryReviewAndSubmitService>(
      TestSummaryReviewAndSubmitService,
    );
  });

  describe('getTestSummary', () => {
    it('should call the getTestSummary test summary service function given list of orisCodes', async () => {
      const result = await service.getTestSummaryRecords([3], [], []);
      expect(result.length).toBe(2);
    });

    it('should call the getTestSummary test summary service function given list of monPlanIds', async () => {
      const result = await service.getTestSummaryRecords([], ['MOCK'], []);
      expect(result.length).toBe(1);
    });

    it('should call the getTestSummary test summary service function and filter based on Quarters', async () => {
      const result = await service.getTestSummaryRecords([], [], ['2021 Q1']);
      expect(result.length).toBe(1);
      });

    it('should call the getTestSummary test summary service function with transaction', async () => {
      const result = await service.getTestSummaryRecords([3], [], [], true, mockEntityManager);
      expect(result.length).toBe(2);
    });
  });


  describe('getTestSummaryRecordsByTestSumIds', () => {
    it('should call the getTestSummaryRecordsByTestSumIds test summary service function given list of testSumIds', async () => {
      const result = await service.getTestSummaryRecordsByTestSumIds(['testSumId1']);
      expect(result.length).toBe(1);
      expect(result[0].evalStatusCode).toBe('PENDING');
    });

    it('should call the getTestSummaryRecordsByTestSumIds test summary service function with transaction', async () => {
      const result = await service.getTestSummaryRecordsByTestSumIds(['testSumId1'], true, mockEntityManager);
      expect(result.length).toBe(1);
      expect(result[0].evalStatusCode).toBe('PENDING');
    });
  });
});
