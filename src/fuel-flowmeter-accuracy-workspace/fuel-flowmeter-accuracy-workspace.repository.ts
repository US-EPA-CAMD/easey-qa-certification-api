import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { FuelFlowmeterAccuracy } from '../entities/workspace/fuel-flowmeter-accuracy.entity';

@Injectable()
export class FuelFlowmeterAccuracyWorkspaceRepository extends Repository<
  FuelFlowmeterAccuracy
> {
  constructor(entityManager: EntityManager) {
    super(FuelFlowmeterAccuracy, entityManager);
  }
}
