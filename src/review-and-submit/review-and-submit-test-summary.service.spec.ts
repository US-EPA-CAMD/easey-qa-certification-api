import { Test, TestingModule } from '@nestjs/testing';
import { ReviewAndSubmitTestSummaryMap } from '../maps/review-and-submit-test-summary.map';
import { ReviewAndSubmitTestSummaryRepository } from './review-and-submit-test-summary.repository';
import { ReviewAndSubmitService } from './review-and-submit.service';
import { ReviewAndSubmitTestSummaryDTO } from '../dto/review-and-submit-test-summary.dto';

const mockRepo = () => ({
  find: jest.fn().mockImplementation(args => {
    if (args.where['monPlanId']) {
      return [new ReviewAndSubmitTestSummaryDTO()];
    } else {
      return [
        new ReviewAndSubmitTestSummaryDTO(),
        new ReviewAndSubmitTestSummaryDTO(),
      ];
    }
  }),
});

const mockMap = () => ({
  many: jest.fn().mockImplementation(args => {
    return args;
  }),
});

describe('ReviewAndSubmitController', () => {
  let service: ReviewAndSubmitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [],
      providers: [
        ReviewAndSubmitService,
        { provide: ReviewAndSubmitTestSummaryMap, useFactory: mockMap },
        { provide: ReviewAndSubmitTestSummaryRepository, useFactory: mockRepo },
      ],
    }).compile();

    service = module.get<ReviewAndSubmitService>(ReviewAndSubmitService);
  });

  describe('getTestSummary', () => {
    it('should call the review and submit test summary controller function given list of orisCodes', async () => {
      const result = await service.getTestSummaryRecords([3], []);
      expect(result.length).toBe(2);
    });

    it('should call the review and submit test summary controller function given list of monPlanIds', async () => {
      const result = await service.getTestSummaryRecords([], ['MOCK']);
      expect(result.length).toBe(1);
    });
  });
});
