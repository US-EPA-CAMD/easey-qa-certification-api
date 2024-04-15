import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { LinearitySummary } from '../entities/workspace/linearity-summary.entity';

@Injectable()
export class LinearitySummaryWorkspaceRepository extends Repository<
  LinearitySummary
> {
  constructor(entityManager: EntityManager) {
    super(LinearitySummary, entityManager);
  }

  async getSummaryById(linSumId: string): Promise<LinearitySummary> {
    return this.createQueryBuilder('ls')
      .innerJoinAndSelect('ls.injections', 'injections')
      .where('ls.id = :linSumId', {
        linSumId,
      })
      .getOne();
  }

  async getSummariesByTestSumId(
    testSumId: string,
  ): Promise<LinearitySummary[]> {
    return this.createQueryBuilder('ls')
      .where('ls.testSumId = :testSumId', {
        testSumId,
      })
      .getMany();
  }
}
