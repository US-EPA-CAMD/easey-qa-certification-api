import { Test, TestingModule } from '@nestjs/testing';
import { EntityManager } from 'typeorm';

import { MatsDataSubmissionMap } from '../maps/mats-data-submission.map';
import { MatsDataSubmissionRepository } from '../mats-data-submission/mats-data-submission.repository';
import { MatsDataSubmissionReviewAndSubmitService } from './mats-data-submission-review-and-submit.service';

describe('MatsDataSubmissionService', () => {
  let service: MatsDataSubmissionReviewAndSubmitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EntityManager,
        MatsDataSubmissionMap,
        MatsDataSubmissionRepository,
        MatsDataSubmissionReviewAndSubmitService,
      ],
    }).compile();

    service = module.get<MatsDataSubmissionReviewAndSubmitService>(
      MatsDataSubmissionReviewAndSubmitService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
