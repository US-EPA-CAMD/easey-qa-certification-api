import { Injectable } from '@nestjs/common';

import { QASuppAttribute } from '../entities/workspace/qa-supp-attribute.entity';
import { QASuppAttribute as QASuppAttributeGlobal } from '../entities/qa-supp-attribute.entity';
import { QASuppAttributeWorkspaceRepository } from './qa-supp-attribute.repository';
import { EntityManager } from 'typeorm';

@Injectable()
export class QASuppAttributeWorkspaceService {
  constructor(private readonly repository: QASuppAttributeWorkspaceRepository) {}

  async createFromOfficialRecord(
    officialRecord: QASuppAttributeGlobal,
    manager?: EntityManager,
  ): Promise<QASuppAttribute> {
    const repo = manager
      ? manager.getRepository(QASuppAttribute)
      : this.repository;
    const entity = repo.create(officialRecord);
    return repo.save(entity);
  }

}
