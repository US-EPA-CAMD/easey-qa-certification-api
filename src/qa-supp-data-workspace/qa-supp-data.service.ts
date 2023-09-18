import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QASuppDataWorkspaceRepository } from './qa-supp-data.repository';

@Injectable()
export class QASuppDataWorkspaceService {
  constructor(
    @InjectRepository(QASuppDataWorkspaceRepository)
    private readonly repository: QASuppDataWorkspaceRepository,
  ) {}

  async setSubmissionAvailCodeToRequire(testSumId: string): Promise<void> {
    const entity = await this.repository.findOne({
      testSumId: testSumId,
    });

    entity.submissionAvailabilityCode = 'REQUIRE';

    await this.repository.save(entity);
  }
}
