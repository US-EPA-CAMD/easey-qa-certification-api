import { FuelFlowToLoadBaseline } from '../entities/workspace/fuel-flow-to-load-baseline.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(FuelFlowToLoadBaseline)
export class FuelFlowToLoadBaselineWorkspaceRepository extends Repository<
  FuelFlowToLoadBaseline
> {}
