import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { RataSummary } from '../entities/workspace/rata-summary.entity';

@Injectable()
export class RataSummaryWorkspaceRepository extends Repository<RataSummary> {
  constructor(entityManager: EntityManager) {
    super(RataSummary, entityManager);
  }
}
