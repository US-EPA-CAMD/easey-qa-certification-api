import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { QASuppAttribute } from '../entities/qa-supp-attribute.entity';

@Injectable()
export class QASuppAttributeRepository extends Repository<QASuppAttribute> {
    constructor(entityManager: EntityManager) {
      super(QASuppAttribute, entityManager);
    }
}