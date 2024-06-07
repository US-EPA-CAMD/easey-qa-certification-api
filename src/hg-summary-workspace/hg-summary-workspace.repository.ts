import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { HgSummary } from '../entities/workspace/hg-summary.entity';

@Injectable()
export class HgSummaryWorkspaceRepository extends Repository<HgSummary> {
  constructor(entityManager: EntityManager) {
    super(HgSummary, entityManager);
  }
}
