import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { RataTraverse } from '../entities/rata-traverse.entity';

@Injectable()
export class RataTraverseRepository extends Repository<RataTraverse> {
  constructor(entityManager: EntityManager) {
    super(RataTraverse, entityManager);
  }
}
