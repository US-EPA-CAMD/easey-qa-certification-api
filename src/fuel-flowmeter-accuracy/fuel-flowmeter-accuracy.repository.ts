import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { FuelFlowmeterAccuracy } from '../entities/fuel-flowmeter-accuracy.entity';

@Injectable()
export class FuelFlowmeterAccuracyRepository extends Repository<
  FuelFlowmeterAccuracy
> {
  constructor(entityManager: EntityManager) {
    super(FuelFlowmeterAccuracy, entityManager);
  }
}
