import { FuelFlowToLoadBaseline } from '../entities/fuel-flow-to-load-baseline.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(FuelFlowToLoadBaseline)
export class FuelFlowToLoadBaselineRepository extends Repository<
  FuelFlowToLoadBaseline
> {}
