import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { LinearityInjection } from '../entities/workspace/linearity-injection.entity';

@Injectable()
export class LinearityInjectionWorkspaceRepository extends Repository<
  LinearityInjection
> {
  constructor(entityManager: EntityManager) {
    super(LinearityInjection, entityManager);
  }
}
