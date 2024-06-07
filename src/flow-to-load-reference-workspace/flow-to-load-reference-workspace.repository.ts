import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { FlowToLoadReference } from '../entities/workspace/flow-to-load-reference.entity';

@Injectable()
export class FlowToLoadReferenceWorkspaceRepository extends Repository<
  FlowToLoadReference
> {
  constructor(entityManager: EntityManager) {
    super(FlowToLoadReference, entityManager);
  }
}
