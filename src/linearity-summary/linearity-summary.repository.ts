import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { LinearitySummary } from '../entities/linearity-summary.entity';

@Injectable()
export class LinearitySummaryRepository extends Repository<LinearitySummary> {
  constructor(entityManager: EntityManager) {
    super(LinearitySummary, entityManager);
  }
}
