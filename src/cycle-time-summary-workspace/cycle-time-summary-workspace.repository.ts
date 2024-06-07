import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { CycleTimeSummary } from '../entities/workspace/cycle-time-summary.entity';

@Injectable()
export class CycleTimeSummaryWorkspaceRepository extends Repository<
  CycleTimeSummary
> {
  constructor(entityManager: EntityManager) {
    super(CycleTimeSummary, entityManager);
  }

  async findOneWithAncestors(id: string): Promise<CycleTimeSummary> {
    return this.findOne({
      relations: ['testSummary'],
      where: {
        id: id,
      },
    });
  }
}
