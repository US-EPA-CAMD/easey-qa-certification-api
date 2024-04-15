import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { TestSummaryReviewAndSubmit } from '../entities/workspace/test-summary-review-and-submit.entity';

@Injectable()
export class TestSummaryReviewAndSubmitRepository extends Repository<
  TestSummaryReviewAndSubmit
> {
  constructor(entityManager: EntityManager) {
    super(TestSummaryReviewAndSubmit, entityManager);
  }
}
