import { FuelFlowToLoadBaseline } from '../entities/workspace/fuel-flow-to-load-baseline.entity';
import { EntityRepository, Repository } from 'typeorm';
import { FlowToLoadCheck } from '../entities/workspace/flow-to-load-check.entity';

@EntityRepository(FuelFlowToLoadBaseline)
export class FuelFlowToLoadBaselineWorkspaceRepository extends Repository<
  FuelFlowToLoadBaseline
> {}
