import { Test, TestingModule } from '@nestjs/testing';
import { EntityManager } from 'typeorm';

import { CertEventReviewAndSubmitDTO } from '../dto/cert-event-review-and-submit.dto';
import { CertEventReviewAndSubmitMap } from '../maps/cert-event-review-and-submit.map';
import { CertEventReviewAndSubmitGlobalRepository } from './cert-event-review-and-submit-global.repository';
import { CertEventReviewAndSubmitRepository } from './cert-event-review-and-submit.repository';
import { CertEventReviewAndSubmitService } from './cert-event-review-and-submit.service';

const dto = new CertEventReviewAndSubmitDTO();
dto.periodAbbreviation = '2022 Q1';
dto.eventDate = '2022-05-01';

const dto2 = new CertEventReviewAndSubmitDTO();
dto2.periodAbbreviation = '';
dto2.eventDate = '2022-01-10';

const mockRepo = () => ({
  find: jest.fn().mockImplementation(args => {
    if (args?.where?.['monPlanId']) {
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
      beginDate: '2022-01-01',
      endDate: '2022-01-31',
    },
  ]),
} as any;

describe('CertEventReviewAndSubmitService', () => {
  let service: CertEventReviewAndSubmitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [],
      providers: [
         {
          provide: EntityManager,
          useValue: mockEntityManager,
        },
        CertEventReviewAndSubmitService,
        { provide: CertEventReviewAndSubmitMap, useFactory: mockMap },
        { provide: CertEventReviewAndSubmitRepository, useFactory: mockRepo },
        {
          provide: CertEventReviewAndSubmitGlobalRepository,
          useFactory: mockRepo,
        },
      ],
    }).compile();

    service = module.get<CertEventReviewAndSubmitService>(
      CertEventReviewAndSubmitService,
    );
  });

  describe('getTestSummary', () => {
    it('should call the getCertEventRecords function given list of orisCodes', async () => {
      const result = await service.getCertEventRecords([3], [], []);
      expect(result.length).toBe(2);
    });

    it('should call the getCertEventRecords function given list of monPlanIds', async () => {
      const result = await service.getCertEventRecords([], ['MOCK'], []);
      expect(result.length).toBe(1);
    });

    it('should call the getCertEventRecords function and filter based on Quarters', async () => {
      const result = await service.getCertEventRecords([], [], ['2021 Q1']);
      expect(result.length).toBe(1);
      });

    it('should call the getCertEventRecords function with transaction', async () => {
      const result = await service.getCertEventRecords([3], [], [], true, mockEntityManager);
      expect(result.length).toBe(2);
    });
  });
});
