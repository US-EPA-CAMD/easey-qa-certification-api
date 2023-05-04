import { Test, TestingModule } from '@nestjs/testing';
import { CertEventReviewAndSubmitRepository } from './cert-event-review-and-submit.repository';
import { CertEventReviewAndSubmitService } from './cert-event-review-and-submit.service';
import { CertEventReviewAndSubmitMap } from '../maps/cert-event-review-and-submit.map';
import { CertEventReviewAndSubmitDTO } from '../dto/cert-event-review-and-submit.dto';

const dto = new CertEventReviewAndSubmitDTO();
dto.periodAbbreviation = '2022 Q1';
dto.eventDate = '2022-05-01';

const dto2 = new CertEventReviewAndSubmitDTO();
dto2.periodAbbreviation = '';
dto2.eventDate = '2022-01-10';

const mockRepo = () => ({
  find: jest.fn().mockImplementation(args => {
    if (args.where['monPlanId']) {
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

describe('CertEventReviewAndSubmitService', () => {
  let service: CertEventReviewAndSubmitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [],
      providers: [
        CertEventReviewAndSubmitService,
        { provide: CertEventReviewAndSubmitMap, useFactory: mockMap },
        { provide: CertEventReviewAndSubmitRepository, useFactory: mockRepo },
      ],
    }).compile();

    service = module.get<CertEventReviewAndSubmitService>(
      CertEventReviewAndSubmitService,
    );
  });

  describe('getTestSummary', () => {
    it('should call the getCertEventRecords function given list of orisCodes', async () => {
      jest.spyOn(service, 'returnManager').mockReturnValue({
        find: jest.fn().mockResolvedValue([
          {
            periodAbbreviation: '2022 Q1',
            beginDate: '2022-01-01',
            endDate: '2022-01-31',
          },
        ]),
      });
      const result = await service.getCertEventRecords([3], [], []);
      expect(result.length).toBe(2);
    });

    it('should call the getCertEventRecords function given list of monPlanIds', async () => {
      jest.spyOn(service, 'returnManager').mockReturnValue({
        find: jest.fn().mockResolvedValue([
          {
            periodAbbreviation: '2022 Q1',
            beginDate: '2022-01-01',
            endDate: '2022-01-31',
          },
        ]),
      });
      const result = await service.getCertEventRecords([], ['MOCK'], []);
      expect(result.length).toBe(1);
    });

    it('should call the getCertEventRecords function and filter based on Quarters', async () => {
      jest.spyOn(service, 'returnManager').mockReturnValue({
        find: jest.fn().mockResolvedValue([
          {
            periodAbbreviation: '2022 Q1',
            beginDate: '2022-01-01',
            endDate: '2022-01-31',
          },
        ]),
      });

      const result = await service.getCertEventRecords([], [], ['2021 Q1']);
      expect(result.length).toBe(1);
    });
  });
});
