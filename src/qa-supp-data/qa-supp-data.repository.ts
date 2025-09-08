import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { QASuppData } from '../entities/qa-supp-data.entity';

@Injectable()
export class QASuppDataRepository extends Repository<QASuppData> {
  constructor(entityManager: EntityManager) {
    super(QASuppData, entityManager);
  }
}
