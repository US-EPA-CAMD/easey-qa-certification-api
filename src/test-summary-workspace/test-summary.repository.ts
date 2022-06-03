import { Repository, EntityRepository } from 'typeorm';

import { TestSummary } from '../entities/workspace/test-summary.entity';

@EntityRepository(TestSummary)
export class TestSummaryWorkspaceRepository extends Repository<TestSummary> {

  private buildTestSummaryBaseQuery() {
    return this.createQueryBuilder('ts')
      .innerJoinAndSelect('ts.location', 'ml')
      .leftJoinAndSelect('ts.component', 'c')
      .leftJoinAndSelect('ml.unit', 'u')
      .leftJoinAndSelect('ml.stackPipe', 'sp')
      .innerJoin('u.plant', 'p', 'p.id = u.facId OR p.id = sp.facId');
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
    testTypeCodes?: string[]
  ): Promise<TestSummary[]> {
    const query = this.buildTestSummaryBaseQuery()
      .where('ts.locationId = :locationId', { locationId });

    if (testTypeCodes) {
      query.andWhere('ts.testTypeCode IN (:...testTypeCodes)', { testTypeCodes });
    }
 
    return query.getMany();
  }

  async getTestSummaries(
    facilityId: number,
    unitIds?: string[],
    stackPipeIds?: string[],
    testTypeCodes?: string[],
  ): Promise<TestSummary[]> {
    const query = this.buildTestSummaryBaseQuery()
      .where('p.orisCode = :facilityId', { facilityId });

    if (unitIds) {
      query
        .andWhere('u.name IN (:...unitIds)', { unitIds })
    }

    if (stackPipeIds) {
      query
        .andWhere('sp.name IN (:...stackPipeIds)', { stackPipeIds })
    }

    if (testTypeCodes) {
      query.andWhere('ts.testTypeCode IN (:...testTypeCodes)', { testTypeCodes });
    }
 
    return query.getMany();
  }
}
