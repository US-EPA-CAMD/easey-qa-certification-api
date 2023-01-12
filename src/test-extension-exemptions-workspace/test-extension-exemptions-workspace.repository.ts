import { addJoins } from '../utilities/test-extension-exemption.querybuilder';
import { EntityRepository, Repository, SelectQueryBuilder } from 'typeorm';
import { TestExtensionExemption } from '../entities/workspace/test-extension-exemption.entity';

@EntityRepository(TestExtensionExemption)
export class TestExtensionExemptionsWorkspaceRepository extends Repository<
  TestExtensionExemption
> {
  private buildBaseQuery(): SelectQueryBuilder<TestExtensionExemption> {
    const query = this.createQueryBuilder('tee');
    return addJoins(query) as SelectQueryBuilder<TestExtensionExemption>;
  }

  async getTestExtensionExemptionById(
    testExtExpId: string,
  ): Promise<TestExtensionExemption> {
    const query = this.buildBaseQuery().where('tee.id = :testExtExpId', {
      testExtExpId,
    });
    return query.getOne();
  }
}
