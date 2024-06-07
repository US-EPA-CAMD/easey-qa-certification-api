import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { FlowRataRun } from '../entities/workspace/flow-rata-run.entity';

@Injectable()
export class FlowRataRunWorkspaceRepository extends Repository<FlowRataRun> {
  constructor(entityManager: EntityManager) {
    super(FlowRataRun, entityManager);
  }
}
