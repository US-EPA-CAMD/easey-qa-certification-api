import { FlowToLoadReference } from '../entities/workspace/flow-to-load-reference.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(FlowToLoadReference)
export class FlowToLoadReferenceWorkspaceRepository extends Repository<
  FlowToLoadReference
> {}
