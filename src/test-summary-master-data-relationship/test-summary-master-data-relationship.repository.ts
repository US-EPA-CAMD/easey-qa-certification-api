import { EntityRepository, Repository } from 'typeorm';
import { TestSummaryMasterDataRelationship } from '../entities/workspace/vw-test-summary-md-relationships.entity';

@EntityRepository(TestSummaryMasterDataRelationship)
export class TestSummaryMasterDataRelationshipRepository extends Repository<
  TestSummaryMasterDataRelationship
> {
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
