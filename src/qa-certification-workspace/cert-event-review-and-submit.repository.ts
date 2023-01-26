import { CertEventReviewAndSubmit } from '../entities/workspace/cert-event-review-and-submit.entity';
import { Repository, EntityRepository } from 'typeorm';

@EntityRepository(CertEventReviewAndSubmit)
export class CertEventReviewAndSubmitRepository extends Repository<
  CertEventReviewAndSubmit
> {}
