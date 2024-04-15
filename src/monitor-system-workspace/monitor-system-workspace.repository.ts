import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { MonitorSystem } from '../entities/workspace/monitor-system.entity';

@Injectable()
export class MonitorSystemWorkspaceRepository extends Repository<
  MonitorSystem
> {
  constructor(entityManager: EntityManager) {
    super(MonitorSystem, entityManager);
  }
}
