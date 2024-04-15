import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { MonitorMethod } from '../entities/workspace/monitor-method.entity';

@Injectable()
export class MonitorMethodWorkspaceRepository extends Repository<
  MonitorMethod
> {
  constructor(entityManager: EntityManager) {
    super(MonitorMethod, entityManager);
  }
}
