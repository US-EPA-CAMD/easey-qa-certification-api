import { Injectable } from '@nestjs/common';
import { withTransaction } from '@us-epa-camd/easey-common/utilities/functions';
import { EntityManager } from 'typeorm';

import { QASuppDataWorkspaceRepository } from './qa-supp-data.repository';

@Injectable()
export class QASuppDataWorkspaceService {
  constructor(private readonly repository: QASuppDataWorkspaceRepository) {}

  async setSubmissionAvailCodeToRequire(testSumId: string, trx?: EntityManager): Promise<void> {
    const repository = withTransaction(this.repository, trx);

    const entity = await repository.findOneBy({
      testSumId: testSumId,
    });

    entity.submissionAvailabilityCode = 'REQUIRE';

    await repository.save(entity);
  }
}
