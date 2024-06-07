import { Injectable } from '@nestjs/common';
import { EntityManager, Repository, SelectQueryBuilder } from 'typeorm';

import { TestExtensionExemption } from '../entities/test-extension-exemption.entity';
import {
  addBeginAndEndDateWhere,
  addJoins,
  addTestExtExemIdWhere,
} from '../utilities/test-extension-exemption.querybuilder';

@Injectable()
export class TestExtensionExemptionsRepository extends Repository<
  TestExtensionExemption
> {
  constructor(entityManager: EntityManager) {
    super(TestExtensionExemption, entityManager);
  }

  private buildBaseQuery(): SelectQueryBuilder<TestExtensionExemption> {
    const query = this.createQueryBuilder('tee');
    return addJoins(query) as SelectQueryBuilder<TestExtensionExemption>;
  }

  async getTestExtensionExemptionById(
    qaTestExtensionExemptionId: string,
  ): Promise<TestExtensionExemption> {
    const query = this.buildBaseQuery().where(
      'tee.id = :qaTestExtensionExemptionId',
      {
        qaTestExtensionExemptionId,
      },
    );
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

  async getTestExtensionsByUnitStack(
    facilityId: number,
    unitIds?: string[],
    stackPipeIds?: string[],
    qaTestExtensionExemptionIds?: string[],
    beginDate?: Date,
    endDate?: Date,
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

    query = addTestExtExemIdWhere(
      query,
      qaTestExtensionExemptionIds,
    ) as SelectQueryBuilder<TestExtensionExemption>;
    query = addBeginAndEndDateWhere(
      query,
      beginDate,
      endDate,
    ) as SelectQueryBuilder<TestExtensionExemption>;

    return query.getMany();
  }
}
