import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { QASuppAttribute } from '../entities/workspace/qa-supp-attribute.entity';

@Injectable()
export class QASuppAttributeWorkspaceRepository extends Repository<QASuppAttribute> {
    constructor(entityManager: EntityManager) {
      super(QASuppAttribute, entityManager);
    }
}