import { TeeReviewAndSubmitGlobal } from '../entities/tee-review-and-submit.entity';
import { Repository, EntityRepository } from 'typeorm';

@EntityRepository(TeeReviewAndSubmitGlobal)
export class TeeReviewAndSubmitGlobalRepository extends Repository<
  TeeReviewAndSubmitGlobal
> {}
