import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { RataTraverse } from '../entities/workspace/rata-traverse.entity';

@Injectable()
export class RataTraverseWorkspaceRepository extends Repository<RataTraverse> {
  constructor(entityManager: EntityManager) {
    super(RataTraverse, entityManager);
  }
}
