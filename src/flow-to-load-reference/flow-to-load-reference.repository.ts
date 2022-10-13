import { FlowToLoadReference } from '../entities/flow-to-load-reference.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(FlowToLoadReference)
export class FlowToLoadReferenceRepository extends Repository<
  FlowToLoadReference
> {}
