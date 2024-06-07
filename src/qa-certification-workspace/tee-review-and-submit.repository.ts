import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { TeeReviewAndSubmit } from '../entities/workspace/tee-review-and-submit.entity';

@Injectable()
export class TeeReviewAndSubmitRepository extends Repository<
  TeeReviewAndSubmit
> {
  constructor(entityManager: EntityManager) {
    super(TeeReviewAndSubmit, entityManager);
  }
}
