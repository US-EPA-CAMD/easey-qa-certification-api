import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { TestResultCode } from '../entities/test-result-code.entity';

@Injectable()
export class TestResultCodeRepository extends Repository<TestResultCode> {
  constructor(entityManager: EntityManager) {
    super(TestResultCode, entityManager);
  }
}
