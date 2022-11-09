import { FuelFlowmeterAccuracy } from '../entities/workspace/fuel-flowmeter-accuracy.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(FuelFlowmeterAccuracy)
export class FuelFlowmeterAccuracyWorkspaceRepository extends Repository<
  FuelFlowmeterAccuracy
> {}
