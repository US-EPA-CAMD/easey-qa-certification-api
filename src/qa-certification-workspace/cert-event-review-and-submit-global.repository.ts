import { Injectable } from '@nestjs/common';
import { EntityManager, Repository, SelectQueryBuilder } from 'typeorm';

import { CertEventReviewAndSubmitGlobal } from '../entities/cert-event-review-and-submit.entity';

@Injectable()
export class CertEventReviewAndSubmitGlobalRepository extends Repository<
  CertEventReviewAndSubmitGlobal
> {
  constructor(entityManager: EntityManager) {
    super(CertEventReviewAndSubmitGlobal, entityManager);
  }
}
