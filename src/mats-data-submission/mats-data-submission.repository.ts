import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { MatsDataSubmission } from '../entities/mats-data-submission.entity';

@Injectable()
export class RataRepository extends Repository<MatsDataSubmission> {
  constructor(entityManager: EntityManager) {
    super(MatsDataSubmission, entityManager);
  }
}
