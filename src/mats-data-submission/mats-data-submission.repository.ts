import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { MatsDataSubmission } from '../entities/mats-data-submission.entity';

@Injectable()
export class MatsDataSubmissionRepository extends Repository<
  MatsDataSubmission
> {
  constructor(entityManager: EntityManager) {
    super(MatsDataSubmission, entityManager);
  }

  getMatsDataSubmissions(monPlanId: string): Promise<MatsDataSubmission[]> {
    return this.find({
      where: {
        plan: {
          id: monPlanId,
        },
      },
      relations: {
        averagingGroup: true,
        facility: true,
        location: {
          stackPipe: true,
          unit: true,
        },
        pollutants: true,
        reportType: true,
        status: true,
        testMethods: true,
      },
    });
  }
}
