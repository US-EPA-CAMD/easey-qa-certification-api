import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { TestSummaryMasterDataRelationship } from '../entities/workspace/vw-test-summary-md-relationships.entity';

@Injectable()
export class TestSummaryMasterDataRelationshipRepository extends Repository<
  TestSummaryMasterDataRelationship
> {
  constructor(entityManager: EntityManager) {
    super(TestSummaryMasterDataRelationship, entityManager);
  }

  async getTestTypeCodesRelationships(
    testTypeCode: string,
    distinctColumnName: string,
  ): Promise<TestSummaryMasterDataRelationship[]> {
    return this.createQueryBuilder('tsmdr')
      .distinct(true)
      .select(`tsmdr.${distinctColumnName}`)
      .where('tsmdr.testTypeCode = :testTypeCode', { testTypeCode })
      .getMany();
  }
}
