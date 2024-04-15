import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { FuelFlowToLoadBaseline } from '../entities/workspace/fuel-flow-to-load-baseline.entity';

@Injectable()
export class FuelFlowToLoadBaselineWorkspaceRepository extends Repository<
  FuelFlowToLoadBaseline
> {
  constructor(entityManager: EntityManager) {
    super(FuelFlowToLoadBaseline, entityManager);
  }
}
