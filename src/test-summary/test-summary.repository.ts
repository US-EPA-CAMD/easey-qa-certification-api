import { Injectable } from '@nestjs/common';
import { EntityManager, Repository, SelectQueryBuilder } from 'typeorm';

import { TestSummary } from '../entities/test-summary.entity';
import {
  addJoins,
  addTestTypeWhere,
  addTestNumberWhere,
  addBeginAndEndDateWhere,
  addTestSummaryIdWhere,
  addSystemTypeWhere,
} from '../utilities/test-summary.querybuilder';
import { withSlaveConnection } from '@us-epa-camd/easey-common';

@Injectable()
export class TestSummaryRepository extends Repository<TestSummary> {
  constructor(entityManager: EntityManager) {
    super(TestSummary, entityManager);
  }

  private buildBaseQuery(qr:EntityManager): SelectQueryBuilder<TestSummary> {
    const query = qr.createQueryBuilder(TestSummary,'ts');
    return addJoins(query) as SelectQueryBuilder<TestSummary>;
  }

  async getTestSummaryById(testSumId: string): Promise<TestSummary> {
    return withSlaveConnection(this.manager.connection, async (qr) => {
      const query = this.buildBaseQuery(qr).where('ts.id = :testSumId', {
      testSumId,
    });
    return query.getOne();
   });
  }

  async getTestSummaryByLocationId(
    locationId: string,
    testTypeCode?: string[],
    testNumber?: string,
  ): Promise<TestSummary> {
    return withSlaveConnection(this.manager.connection, async (qr) => {
      let query = this.buildBaseQuery(qr).where('ts.locationId = :locationId', {
      locationId,
    });

    query = addTestTypeWhere(query, testTypeCode) as SelectQueryBuilder<
      TestSummary
    >;
    query = addTestNumberWhere(query, testNumber) as SelectQueryBuilder<
      TestSummary
    >;

    return query.getOne();
    });
  }

  async getTestSummariesByLocationId(
    locationId: string,
    testTypeCode?: string[],
    systemTypeCode?: string[],
    beginDate?: Date,
    endDate?: Date,
  ): Promise<TestSummary[]> {
    return withSlaveConnection(this.manager.connection, async (qr) => {
      let query = this.buildBaseQuery(qr).where('ts.locationId = :locationId', {
      locationId,
    });

    query = addTestTypeWhere(query, testTypeCode) as SelectQueryBuilder<
      TestSummary
    >;
    query = addSystemTypeWhere(query, systemTypeCode) as SelectQueryBuilder<
      TestSummary
    >;
    query = addBeginAndEndDateWhere(
      query,
      beginDate,
      endDate,
    ) as SelectQueryBuilder<TestSummary>;

    return query.getMany();
    });
  }

  async getTestSummariesByUnitStack(
    facilityId: number,
    unitIds?: string[],
    stackPipeIds?: string[],
    testSummaryIds?: string[],
    testTypeCodes?: string[],
    beginDate?: Date,
    endDate?: Date,
  ): Promise<TestSummary[]> {
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

    return withSlaveConnection(this.manager.connection, async (qr) => {
      let query = this.buildBaseQuery(qr).where(`(${unitsWhere}${stacksWhere})`, {
      facilityId,
      unitIds,
      stackPipeIds,
    });

    query = addTestSummaryIdWhere(query, testSummaryIds) as SelectQueryBuilder<
      TestSummary
    >;

    query = addTestTypeWhere(query, testTypeCodes) as SelectQueryBuilder<
      TestSummary
    >;
    query = addBeginAndEndDateWhere(
      query,
      beginDate,
      endDate,
    ) as SelectQueryBuilder<TestSummary>;

    return query.getMany();
    });
  }
}
