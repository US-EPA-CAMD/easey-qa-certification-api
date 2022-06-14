import { Repository, EntityRepository } from 'typeorm';

import { TestSummary } from '../entities/test-summary.entity';

@EntityRepository(TestSummary)
export class TestSummaryRepository extends Repository<TestSummary> {

  private buildTestSummaryBaseQuery() {
    return this.createQueryBuilder('ts')
      .innerJoinAndSelect('ts.location', 'ml')
      .leftJoinAndSelect('ts.system', 'ms')
      .leftJoinAndSelect('ts.component', 'c')
      .leftJoinAndSelect('ts.reportingPeriod', 'rp')
      .leftJoinAndSelect('ml.unit', 'u')
      .leftJoin('u.plant', 'up')
      .leftJoinAndSelect('ml.stackPipe', 'sp')
      .leftJoin('sp.plant', 'spp');
  }

  async getTestSummaryById(
    testSumId: string,
  ): Promise<TestSummary> {
    const query = this.buildTestSummaryBaseQuery()
      .where('ts.id = :testSumId', { testSumId });
    return query.getOne();
  }

  async getTestSummariesByLocationId(
    locationId: string,
    testTypeCode?: string
  ): Promise<TestSummary[]> {
    const query = this.buildTestSummaryBaseQuery()
      .where('ts.locationId = :locationId', { locationId });

    if (testTypeCode) {
      query.andWhere('ts.testTypeCode = :testTypeCode', { testTypeCode });
    }
 
    return query.getMany();
  }

  async getTestSummaries(
    facilityId: number,
    unitIds?: string[],
    stackPipeIds?: string[],
    testTypeCode?: string,
  ): Promise<TestSummary[]> {
    let unitsWhere = unitIds && unitIds.length > 0
      ? 'up.orisCode = :facilityId AND u.name IN (:...unitIds)'
      : '';

    let stacksWhere = stackPipeIds && stackPipeIds.length > 0
      ? 'spp.orisCode = :facilityId AND sp.name IN (:...stackPipeIds)'
      : '';

    if (unitIds && unitIds.length > 0 && stackPipeIds && stackPipeIds.length > 0) {
      unitsWhere = `(${unitsWhere})`;
      stacksWhere = ` OR (${stacksWhere})`;
    }

    const query = this.buildTestSummaryBaseQuery()
      .where(`${unitsWhere}${stacksWhere}`, { facilityId, unitIds, stackPipeIds });

    if (testTypeCode) {
      query.andWhere('ts.testTypeCode = :testTypeCode)', { testTypeCode });
    }

    return query.getMany();
  }
}
