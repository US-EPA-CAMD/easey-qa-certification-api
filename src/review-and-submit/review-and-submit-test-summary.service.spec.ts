import { Test, TestingModule } from '@nestjs/testing';
import { ReviewAndSubmitTestSummaryMap } from '../maps/review-and-submit-test-summary.map';
import { ReviewAndSubmitTestSummaryRepository } from './review-and-submit-test-summary.repository';
import { ReviewAndSubmitService } from './review-and-submit.service';
import { ReviewAndSubmitTestSummaryDTO } from '../dto/review-and-submit-test-summary.dto';

const dto = new ReviewAndSubmitTestSummaryDTO();
dto.beginDate = '2021-04-04';
dto.endDate = '2021-04-05';
dto.periodAbbreviation = '2022 Q1';

const dto2 = new ReviewAndSubmitTestSummaryDTO();
dto2.beginDate = '2022-04-04';
dto2.endDate = '2022-04-05';
dto2.periodAbbreviation = '';

const mockRepo = () => ({
  find: jest.fn().mockImplementation(args => {
    if (args.where['monPlanId']) {
      return [new ReviewAndSubmitTestSummaryDTO()];
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
    it('should call the getTestSummary test summary service function given list of orisCodes', async () => {
      const result = await service.getTestSummaryRecords([3], [], []);
      expect(result.length).toBe(2);
    });

    it('should call the getTestSummary test summary service function given list of monPlanIds', async () => {
      const result = await service.getTestSummaryRecords([], ['MOCK'], []);
      expect(result.length).toBe(1);
    });

    it('should call the getTestSummary test summary service function and filter based on Quarters', async () => {
      jest.spyOn(service, 'returnManager').mockReturnValue({
        find: jest.fn().mockResolvedValue([
          {
            periodAbbreviation: '2022 Q1',
            beginDate: '2021-03-01',
            endDate: '2021-05-31',
          },
        ]),
      });

      const result = await service.getTestSummaryRecords([], [], ['2021 Q1']);
      expect(result.length).toBe(1);
    });
  });
});