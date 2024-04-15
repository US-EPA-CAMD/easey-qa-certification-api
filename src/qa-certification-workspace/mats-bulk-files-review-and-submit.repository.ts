import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { MatsBulkFile } from '../entities/mats-bulk-file.entity';

@Injectable()
export class MatsBulkFilesReviewAndSubmitRepository extends Repository<
  MatsBulkFile
> {
  constructor(entityManager: EntityManager) {
    super(MatsBulkFile, entityManager);
  }
}
