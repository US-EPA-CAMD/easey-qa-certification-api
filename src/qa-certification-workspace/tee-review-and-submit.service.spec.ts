import { Test, TestingModule } from '@nestjs/testing';
import { TeeReviewAndSubmitDTO } from '../dto/tee-review-and-submit.dto';
import { TeeReviewAndSubmitService } from './tee-review-and-submit.service';
import { TeeReviewAndSubmitMap } from '../maps/tee-review-and-submit.map';
import { TeeReviewAndSubmitRepository } from './tee-review-and-submit.repository';
import { TeeReviewAndSubmitGlobalRepository } from './tee-review-and-submit-global.repository';

const dto = new TeeReviewAndSubmitDTO();
dto.periodAbbreviation = '2022 Q1';

const dto2 = new TeeReviewAndSubmitDTO();
dto2.periodAbbreviation = '2021 Q2';

const mockRepo = () => ({
  find: jest.fn().mockImplementation(args => {
    if (args.where['monPlanId']) {
      return [new TeeReviewAndSubmitDTO()];
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

describe('TeeReviewAndSubmitService', () => {
  let service: TeeReviewAndSubmitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [],
      providers: [
        TeeReviewAndSubmitService,
        { provide: TeeReviewAndSubmitMap, useFactory: mockMap },
        { provide: TeeReviewAndSubmitRepository, useFactory: mockRepo },
        { provide: TeeReviewAndSubmitGlobalRepository, useFactory: mockRepo },
      ],
    }).compile();

    service = module.get<TeeReviewAndSubmitService>(TeeReviewAndSubmitService);
  });

  describe('getTeeRecords', () => {
    it('should call the getTeeRecords function given list of orisCodes', async () => {
      const result = await service.getTeeRecords([3], [], []);
      expect(result.length).toBe(2);
    });

    it('should call the getTeeRecords function given list of monPlanIds', async () => {
      const result = await service.getTeeRecords([], ['MOCK'], []);
      expect(result.length).toBe(1);
    });

    it('should call the getTeeRecords function and filter based on Quarters', async () => {
      const result = await service.getTeeRecords([], [], ['2021 Q2']);
      expect(result.length).toBe(1);
    });
  });
});
