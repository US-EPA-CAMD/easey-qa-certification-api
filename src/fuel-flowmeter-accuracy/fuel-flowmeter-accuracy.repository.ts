import { EntityRepository, Repository } from 'typeorm';
import { FuelFlowmeterAccuracy } from '../entities/fuel-flowmeter-accuracy.entity';

@EntityRepository(FuelFlowmeterAccuracy)
export class FuelFlowmeterAccuracyRepository extends Repository<
  FuelFlowmeterAccuracy
> {}
