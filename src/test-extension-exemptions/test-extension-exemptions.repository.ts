import {
  addJoins,
  addTestExtensionExemptionIdWhere,
} from '../utilities/test-extension-exemption.querybuilder';
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

  async getTestExtensionExemptionsByUnitStack(
    facilityId: number,
    unitIds?: string[],
    stackPipeIds?: string[],
    testExtensionExemptionIds?: string[],
  ): Promise<TestExtensionExemption[]> {
    let unitsWhere =
      unitIds && unitIds.length > 0
        ? 'up.orisCode = :facilityId AND u.name IN (:...unitIds)'
        : '';

    let stacksWhere =
      stackPipeIds && stackPipeIds.length > 0
        ? 'spp.orisCode = :facilityId AND sp.name IN (:...stackPipeIds)'
        : '';

    if (
      unitIds &&
      unitIds.length > 0 &&
      stackPipeIds &&
      stackPipeIds.length > 0
    ) {
      unitsWhere = `(${unitsWhere})`;
      stacksWhere = ` OR (${stacksWhere})`;
    }

    let query = this.buildBaseQuery().where(`(${unitsWhere}${stacksWhere})`, {
      facilityId,
      unitIds,
      stackPipeIds,
    });

    query = addTestExtensionExemptionIdWhere(
      query,
      testExtensionExemptionIds,
    ) as SelectQueryBuilder<TestExtensionExemption>;

    return query.getMany();
  }
}
