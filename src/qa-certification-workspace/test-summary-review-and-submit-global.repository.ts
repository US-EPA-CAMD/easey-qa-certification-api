import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { TestSummaryReviewAndSubmitGlobal } from '../entities/test-summary-review-and-submit.entity';

@Injectable()
export class TestSummaryReviewAndSubmitGlobalRepository extends Repository<
  TestSummaryReviewAndSubmitGlobal
> {
  constructor(entityManager: EntityManager) {
    super(TestSummaryReviewAndSubmitGlobal, entityManager);
  }
}
