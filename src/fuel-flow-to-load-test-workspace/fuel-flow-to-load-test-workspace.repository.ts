import { EntityRepository, Repository } from 'typeorm';
import { FuelFlowToLoadTest } from '../entities/workspace/fuel-flow-to-load-test.entity';

@EntityRepository(FuelFlowToLoadTest)
export class FuelFlowToLoadTestWorkspaceRepository extends Repository<
  FuelFlowToLoadTest
> {}
