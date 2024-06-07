import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { UnitDefaultTestRun } from '../entities/workspace/unit-default-test-run.entity';

@Injectable()
export class UnitDefaultTestRunWorkspaceRepository extends Repository<
  UnitDefaultTestRun
> {
  constructor(entityManager: EntityManager) {
    super(UnitDefaultTestRun, entityManager);
  }
}
