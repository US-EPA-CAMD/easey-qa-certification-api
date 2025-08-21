import { Injectable } from '@nestjs/common';

import { QASuppDataWorkspaceRepository } from './qa-supp-data.repository';
import { QASuppData } from '../entities/workspace/qa-supp-data.entity';
import { QASuppData as QASuppDataGlobal } from '../entities/qa-supp-data.entity';
import { EntityManager } from 'typeorm';

@Injectable()
export class QASuppDataWorkspaceService {
  constructor(private readonly repository: QASuppDataWorkspaceRepository) {}

  async setSubmissionAvailCodeToRequire(testSumId: string): Promise<void> {
    const entity = await this.repository.findOneBy({
      testSumId: testSumId,
    });

    entity.submissionAvailabilityCode = 'REQUIRE';

    await this.repository.save(entity);
  }

  async deleteByTestSumId(
    testSumId: string,
    manager?: EntityManager,
  ): Promise<void> {
    const repo = manager ? manager.getRepository(QASuppData) : this.repository;
    await repo.delete({ testSumId });
  }

  async createFromOfficialRecord(
    officialRecord: QASuppDataGlobal,
    manager?: EntityManager,
  ): Promise<QASuppData> {
    const repo = manager ? manager.getRepository(QASuppData) : this.repository;
    const entity = repo.create(officialRecord);
    return repo.save(entity);
  }
  
}
