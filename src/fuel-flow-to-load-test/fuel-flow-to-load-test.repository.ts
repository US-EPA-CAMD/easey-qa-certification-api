import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { FuelFlowToLoadTest } from '../entities/fuel-flow-to-load-test.entity';

@Injectable()
export class FuelFlowToLoadTestRepository extends Repository<
  FuelFlowToLoadTest
> {
  constructor(entityManager: EntityManager) {
    super(FuelFlowToLoadTest, entityManager);
  }
}
