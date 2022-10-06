import { EntityRepository, Repository } from 'typeorm';
import { FlowToLoadCheck } from '../entities/workspace/flow-to-load-check.entity';

@EntityRepository(FlowToLoadCheck)
export class FlowToLoadCheckWorkspaceRepository extends Repository<
  FlowToLoadCheck
> {}
