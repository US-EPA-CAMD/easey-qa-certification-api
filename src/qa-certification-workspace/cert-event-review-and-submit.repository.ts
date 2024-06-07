import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { CertEventReviewAndSubmit } from '../entities/workspace/cert-event-review-and-submit.entity';

@Injectable()
export class CertEventReviewAndSubmitRepository extends Repository<
  CertEventReviewAndSubmit
> {
  constructor(entityManager: EntityManager) {
    super(CertEventReviewAndSubmit, entityManager);
  }
}
