import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { LinearityInjection } from '../entities/linearity-injection.entity';

@Injectable()
export class LinearityInjectionRepository extends Repository<
  LinearityInjection
> {
  constructor(entityManager: EntityManager) {
    super(LinearityInjection, entityManager);
  }
}
