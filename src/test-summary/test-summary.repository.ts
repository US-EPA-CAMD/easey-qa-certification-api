import { Repository, EntityRepository } from 'typeorm';

import { TestSummary } from '../entities/test-summary.entity';

@EntityRepository(TestSummary)
export class TestSummaryRepository extends Repository<TestSummary> {
  async getTestSummaries(
    facilityId: number,
    unitIds: string[],
    stackPipeIds: string[],
    testTypeCodes: string[],
  ): Promise<TestSummary[]> {
    const query = this.createQueryBuilder('ts')
      .innerJoin('ts.location', 'ml')
      .where('p.orisCode = :facilityId', { facilityId });

    if (unitIds) {
      query
        .leftJoin('ml.unit', 'u')
        .innerJoin('u.plant', 'p')        
        .andWhere('u.name IN (:...unitIds)', { unitIds })
    }

    if (stackPipeIds) {
      query
        .leftJoin('ml.stackPipe', 'sp')
        .innerJoin('sp.plant', 'p')
        .andWhere('sp.name IN (:...stackPipeIds)', { stackPipeIds })
    }

    if (testTypeCodes) {
      query.andWhere('ts.testTypeCode IN (:...testTypeCodes)', { testTypeCodes });
    }
 
    return query.getMany();
  }
}
