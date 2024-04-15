import { Injectable } from '@nestjs/common';

import { QASuppDataWorkspaceRepository } from './qa-supp-data.repository';

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
}
