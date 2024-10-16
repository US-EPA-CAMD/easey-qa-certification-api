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

@Injectable()
export class TestSummaryRepository extends Repository<TestSummary> {
  constructor(entityManager: EntityManager) {
    super(TestSummary, entityManager);
  }

  private buildBaseQuery(): SelectQueryBuilder<TestSummary> {
    const query = this.createQueryBuilder('ts');
    return addJoins(query) as SelectQueryBuilder<TestSummary>;
  }

  async getTestSummaryById(testSumId: string): Promise<TestSummary> {
    const query = this.buildBaseQuery().where('ts.id = :testSumId', {
      testSumId,
    });
    return query.getOne();
  }

  async getTestSummaryByLocationId(
    locationId: string,
    testTypeCode?: string[],
    testNumber?: string,
  ): Promise<TestSummary> {
    let query = this.buildBaseQuery().where('ts.locationId = :locationId', {
      locationId,
    });

    query = addTestTypeWhere(query, testTypeCode) as SelectQueryBuilder<
      TestSummary
    >;
    query = addTestNumberWhere(query, testNumber) as SelectQueryBuilder<
      TestSummary
    >;

    return query.getOne();
  }

  async getTestSummariesByLocationId(
    locationId: string,
    testTypeCode?: string[],
    systemTypeCode?: string[],
    beginDate?: Date,
    endDate?: Date,
  ): Promise<TestSummary[]> {
    let query = this.buildBaseQuery().where('ts.locationId = :locationId', {
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

    let query = this.buildBaseQuery().where(`(${unitsWhere}${stacksWhere})`, {
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
  }
}
