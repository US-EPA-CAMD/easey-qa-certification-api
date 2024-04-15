import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { CycleTimeInjection } from '../entities/cycle-time-injection.entity';

@Injectable()
export class CycleTimeInjectionRepository extends Repository<
  CycleTimeInjection
> {
  constructor(entityManager: EntityManager) {
    super(CycleTimeInjection, entityManager);
  }
}
