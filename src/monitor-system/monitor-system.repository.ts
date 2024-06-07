import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { MonitorSystem } from '../entities/monitor-system.entity';

@Injectable()
export class MonitorSystemRepository extends Repository<MonitorSystem> {
  constructor(entityManager: EntityManager) {
    super(MonitorSystem, entityManager);
  }
}
