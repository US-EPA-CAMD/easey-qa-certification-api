import { Repository, EntityRepository } from 'typeorm';
import { TestSummaryReviewAndSubmit } from '../entities/test-summary-review-and-submit.entity';

@EntityRepository(TestSummaryReviewAndSubmit)
export class ReviewAndSubmitTestSummaryRepository extends Repository<
  TestSummaryReviewAndSubmit
> {}
