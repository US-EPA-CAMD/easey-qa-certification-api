import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { TestQualification } from '../entities/test-qualification.entity';

@Injectable()
export class TestQualificationRepository extends Repository<TestQualification> {
  constructor(entityManager: EntityManager) {
    super(TestQualification, entityManager);
  }
}
