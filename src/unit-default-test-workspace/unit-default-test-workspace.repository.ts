import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { UnitDefaultTest } from '../entities/workspace/unit-default-test.entity';

@Injectable()
export class UnitDefaultTestWorkspaceRepository extends Repository<
  UnitDefaultTest
> {
  constructor(entityManager: EntityManager) {
    super(UnitDefaultTest, entityManager);
  }
}
