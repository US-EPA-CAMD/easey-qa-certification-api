import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { FlowToLoadReference } from '../entities/flow-to-load-reference.entity';

@Injectable()
export class FlowToLoadReferenceRepository extends Repository<
  FlowToLoadReference
> {
  constructor(entityManager: EntityManager) {
    super(FlowToLoadReference, entityManager);
  }
}
