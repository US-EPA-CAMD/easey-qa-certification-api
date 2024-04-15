import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { CycleTimeSummary } from '../entities/cycle-time-summary.entity';

@Injectable()
export class CycleTimeSummaryRepository extends Repository<CycleTimeSummary> {
  constructor(entityManager: EntityManager) {
    super(CycleTimeSummary, entityManager);
  }
}
