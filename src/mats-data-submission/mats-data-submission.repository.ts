import { Injectable } from '@nestjs/common';
import { EntityManager, In, Repository } from 'typeorm';

import { MatsDataSubmission } from '../entities/mats-data-submission.entity';

const relations = {
  averagingGroup: true,
  facility: true,
  location: {
    stackPipe: true,
    unit: true,
  },
  plan: false,
  pollutants: true,
  reportType: true,
  status: true,
  testMethods: true,
};

@Injectable()
export class MatsDataSubmissionRepository extends Repository<
  MatsDataSubmission
> {
  constructor(entityManager: EntityManager) {
    super(MatsDataSubmission, entityManager);
  }

  getMatsDataSubmission(id: string): Promise<MatsDataSubmission> {
    return this.findOne({
      where: {
        id,
      },
      relations,
    });
  }

  getMatsDataSubmissions(monPlanIds: string[]): Promise<MatsDataSubmission[]> {
    const queryRunner = this.manager.connection.createQueryRunner('slave');
    const repo = queryRunner.manager.getRepository(MatsDataSubmission);
    return repo.find({
      where: {
        plan: {
          id: In(monPlanIds),
        },
      },
      relations,
    });
  }
}
