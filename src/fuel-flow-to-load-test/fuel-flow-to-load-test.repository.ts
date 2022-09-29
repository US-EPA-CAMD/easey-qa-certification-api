import { EntityRepository, Repository } from 'typeorm';
import { FuelFlowToLoadTest } from '../entities/fuel-flow-to-load-test.entity';

@EntityRepository(FuelFlowToLoadTest)
export class FuelFlowToLoadTestRepository extends Repository<
  FuelFlowToLoadTest
> {}
