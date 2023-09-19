import { CertEventReviewAndSubmitGlobal } from '../entities/cert-event-review-and-submit.entity';
import { Repository, EntityRepository } from 'typeorm';

@EntityRepository(CertEventReviewAndSubmitGlobal)
export class CertEventReviewAndSubmitGlobalRepository extends Repository<
  CertEventReviewAndSubmitGlobal
> {}
