import { Repository, EntityRepository } from 'typeorm';
import { TestSummaryReviewAndSubmitGlobal } from '../entities/test-summary-review-and-submit.entity';

@EntityRepository(TestSummaryReviewAndSubmitGlobal)
export class TestSummaryReviewAndSubmitGlobalRepository extends Repository<
  TestSummaryReviewAndSubmitGlobal
> {}
