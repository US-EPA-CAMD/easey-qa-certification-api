import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { HgSummary } from '../entities/hg-summary.entity';

@Injectable()
export class HgSummaryRepository extends Repository<HgSummary> {
  constructor(entityManager: EntityManager) {
    super(HgSummary, entityManager);
  }
}
