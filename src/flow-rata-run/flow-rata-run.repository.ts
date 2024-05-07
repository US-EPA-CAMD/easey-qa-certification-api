import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { FlowRataRun } from '../entities/flow-rata-run.entity';

@Injectable()
export class FlowRataRunRepository extends Repository<FlowRataRun> {
  constructor(entityManager: EntityManager) {
    super(FlowRataRun, entityManager);
  }
}
