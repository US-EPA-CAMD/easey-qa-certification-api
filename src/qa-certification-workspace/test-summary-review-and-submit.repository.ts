import { Repository, EntityRepository } from 'typeorm';
import { TestSummaryReviewAndSubmit } from '../entities/workspace/test-summary-review-and-submit.entity';

@EntityRepository(TestSummaryReviewAndSubmit)
export class TestSummaryReviewAndSubmitRepository extends Repository<
  TestSummaryReviewAndSubmit
> {}
