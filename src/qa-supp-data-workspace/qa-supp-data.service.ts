import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

import { QASuppData } from '../entities/qa-supp-data.entity';
import { QASuppDataWorkspaceRepository } from './qa-supp-data.repository';

@Injectable()
export class QASuppDataWorkspaceService {
  constructor(private readonly repository: QASuppDataWorkspaceRepository) {}

  async setSubmissionAvailCodeToRequire(
    testSumId: string,
    trx?: EntityManager,
  ): Promise<void> {
    const repo = trx ? trx.getRepository(QASuppData) : this.repository;

    const entity = await repo.findOneBy({
      testSumId: testSumId,
    });

    entity.submissionAvailabilityCode = 'REQUIRE';

    await repo.save(entity);
  }
}
