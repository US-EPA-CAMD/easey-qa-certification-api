import { EntityRepository, Repository } from 'typeorm';
import { TestSummaryMasterDataRelationship } from '../entities/workspace/vw-test-summary-md-relationships.entity';

@EntityRepository(TestSummaryMasterDataRelationship)
export class TestSummaryMasterDataRelationshipRepository extends Repository<
  TestSummaryMasterDataRelationship
> {
  async getGasLevelCodesByTestTypeCode(
    testTypeCode: string,
  ): Promise<TestSummaryMasterDataRelationship[]> {
    return this.createQueryBuilder('tsmdr')
      .distinct(true)
      .select('tsmdr.gasLevelCode')
      .where('tsmdr.testTypeCode = :testTypeCode', { testTypeCode })
      .getMany();
  }
}
