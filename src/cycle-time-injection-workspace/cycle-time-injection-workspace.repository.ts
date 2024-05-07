import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { CycleTimeInjection } from '../entities/workspace/cycle-time-injection.entity';

@Injectable()
export class CycleTimeInjectionWorkspaceRepository extends Repository<
  CycleTimeInjection
> {
  constructor(entityManager: EntityManager) {
    super(CycleTimeInjection, entityManager);
  }

  async findDuplicate(
    cycleTimeInjectionId: string,
    testSumId: string,
    gasLevelCode: string,
  ): Promise<CycleTimeInjection> {
    const query = this.createQueryBuilder('cti')
      .innerJoin('cti.cycleTimeSummary', 'ctisum')
      .where('ctisum.testSumId = :testsumid', { testsumid: testSumId })
      .andWhere('cti.gasLevelCode = :gaslevel', { gaslevel: gasLevelCode });

    if (cycleTimeInjectionId)
      query.andWhere('cti.id != :id', { id: cycleTimeInjectionId });

    return query.getOne();
  }
}
