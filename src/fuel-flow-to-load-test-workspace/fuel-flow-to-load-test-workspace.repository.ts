import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { FuelFlowToLoadTest } from '../entities/workspace/fuel-flow-to-load-test.entity';

@Injectable()
export class FuelFlowToLoadTestWorkspaceRepository extends Repository<
  FuelFlowToLoadTest
> {
  constructor(entityManager: EntityManager) {
    super(FuelFlowToLoadTest, entityManager);
  }
}
