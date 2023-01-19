import { addJoins } from '../utilities/test-extension-exemption.querybuilder';
import { EntityRepository, Repository, SelectQueryBuilder } from 'typeorm';
import { TestExtensionExemption } from '../entities/test-extension-exemption.entity';

@EntityRepository(TestExtensionExemption)
export class TestExtensionExemptionsRepository extends Repository<
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

  async getTestExtensionExemptionsByLocationId(
    locationId: string,
  ): Promise<TestExtensionExemption[]> {
    const query = this.buildBaseQuery().where('tee.locationId = :locationId', {
      locationId,
    });
    return query.getMany();
  }
}
