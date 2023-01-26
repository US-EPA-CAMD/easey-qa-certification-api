import { TeeReviewAndSubmit } from '../entities/workspace/tee-review-and-submit.entity';
import { Repository, EntityRepository } from 'typeorm';

@EntityRepository(TeeReviewAndSubmit)
export class TeeReviewAndSubmitRepository extends Repository<
  TeeReviewAndSubmit
> {}
