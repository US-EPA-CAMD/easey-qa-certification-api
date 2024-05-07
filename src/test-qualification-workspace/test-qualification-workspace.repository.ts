import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { TestQualification } from '../entities/workspace/test-qualification.entity';

@Injectable()
export class TestQualificationWorkspaceRepository extends Repository<
  TestQualification
> {
  constructor(entityManager: EntityManager) {
    super(TestQualification, entityManager);
  }
}
