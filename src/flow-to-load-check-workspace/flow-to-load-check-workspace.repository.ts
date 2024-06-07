import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { FlowToLoadCheck } from '../entities/workspace/flow-to-load-check.entity';

@Injectable()
export class FlowToLoadCheckWorkspaceRepository extends Repository<
  FlowToLoadCheck
> {
  constructor(entityManager: EntityManager) {
    super(FlowToLoadCheck, entityManager);
  }

  async getFlowToLoadChecksByTestSumIds(
    testSumIds: string[],
  ): Promise<FlowToLoadCheck[]> {
    const query = this.createQueryBuilder('f2lchk')
      .leftJoinAndSelect('f2lchk.system', 'o')
      .where('f2lchk.testSumId IN (:...testSumIds)', {
        testSumIds,
      });

    return query.getMany();
  }
}
