import { Repository, EntityRepository, SelectQueryBuilder } from 'typeorm';

import {
  addJoins,
  addTestTypeWhere,
  addSystemTypeWhere,
  addTestNumberWhere,
  addBeginAndEndDateWhere,
  addTestSummaryIdWhere,
} from '../utilities/test-summary.querybuilder';

import { TestSummary } from '../entities/workspace/test-summary.entity';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { HttpStatus } from '@nestjs/common';

@EntityRepository(TestSummary)
export class TestSummaryWorkspaceRepository extends Repository<TestSummary> {
  private buildBaseQuery(): SelectQueryBuilder<TestSummary> {
    const query = this.createQueryBuilder('ts');
    return addJoins(query) as SelectQueryBuilder<TestSummary>;
  }

  async getTestSummaryById(testSumId: string): Promise<TestSummary> {
    const query = this.buildBaseQuery().where('ts.id = :testSumId', {
      testSumId,
    });

    const record = await query.getOne();
    if (!record) {
      throw new EaseyException(
        new Error(
          `A test summary record not found with Record Id [${testSumId}].`,
        ),
        HttpStatus.NOT_FOUND,
      );
    }

    return record;
  }

  async getTestSummaryByLocationId(
    locationId: string,
    testTypeCode?: string,
    testNumber?: string,
  ): Promise<TestSummary> {
    let query = this.buildBaseQuery().where('ts.locationId = :locationId', {
      locationId,
    });

    query = addTestTypeWhere(query, [testTypeCode]) as SelectQueryBuilder<
      TestSummary
    >;
    query = addTestNumberWhere(query, testNumber) as SelectQueryBuilder<
      TestSummary
    >;

    return query.getOne();
  }

  async getTestSummariesByLocationId(
    locationId: string,
    testTypeCodes?: string[],
    systemTypeCodes?: string[],
    beginDate?: Date,
    endDate?: Date,
  ): Promise<TestSummary[]> {
    let query = this.buildBaseQuery().where('ts.locationId = :locationId', {
      locationId,
    });

    query = addTestTypeWhere(query, testTypeCodes) as SelectQueryBuilder<
      TestSummary
    >;
    query = addSystemTypeWhere(query, systemTypeCodes) as SelectQueryBuilder<
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

  async getTestSummaryByComponent(
    componentID: string,
    testTypeCode: string,
    spanScaleCode: string,
    endDate: Date,
    endHour: number,
    endMinute: number,
  ) {
    const query = this.buildBaseQuery().where(
      'ts.testTypeCode = :testTypeCode',
      { testTypeCode },
    );

    if (componentID) {
      query.andWhere('c.componentID = :componentID', { componentID });
    }

    if (spanScaleCode) {
      query.andWhere('ts.spanScaleCode = :spanScaleCode', { spanScaleCode });
    }
    if (endDate) {
      query
        .andWhere('ts.endDate = :endDate', { endDate })
        .andWhere('ts.endHour = :endHour', { endHour })
        .andWhere('ts.endMinute = :endMinute', { endMinute });
    }

    return query.getOne();
  }
}
