import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { RataSummary } from '../entities/rata-summary.entity';

@Injectable()
export class RataSummaryRepository extends Repository<RataSummary> {
  constructor(entityManager: EntityManager) {
    super(RataSummary, entityManager);
  }
}
