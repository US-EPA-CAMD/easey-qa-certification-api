import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { TeeReviewAndSubmitGlobal } from '../entities/tee-review-and-submit.entity';

@Injectable()
export class TeeReviewAndSubmitGlobalRepository extends Repository<
  TeeReviewAndSubmitGlobal
> {
  constructor(entityManager: EntityManager) {
    super(TeeReviewAndSubmitGlobal, entityManager);
  }
}
