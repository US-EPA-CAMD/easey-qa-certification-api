import { Repository, EntityRepository } from 'typeorm';
import { LinearitySummary } from '../entities/workspace/linearity-summary.entity';

@EntityRepository(LinearitySummary)
export class LinearitySummaryWorkspaceRepository extends Repository<
  LinearitySummary
> {
  async getSummaryById(linSumId: string): Promise<LinearitySummary> {
    return this.createQueryBuilder('ls')
      .innerJoinAndSelect('ls.injections', 'injections')
      .where('ls.id = :linSumId', {
        linSumId,
      })
      .getOne();
  }

  async getSummariesByTestSumId(
    testSumId: string,
  ): Promise<LinearitySummary[]> {
    return this.createQueryBuilder('ls')
      .where('ls.testSumId = :testSumId', {
        testSumId,
      })
      .getMany();
  }
}
