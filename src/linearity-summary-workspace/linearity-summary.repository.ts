import { Repository, EntityRepository } from 'typeorm';
import { LinearitySummary } from '../entities/workspace/linearity-summary.entity';

@EntityRepository(LinearitySummary)
export class LinearitySummaryWorkspaceRepository extends Repository<
  LinearitySummary
> {
  async getSummaryById(linSumId: string): Promise<LinearitySummary> {
    const query = this.createQueryBuilder('ls').where('ls.id = :linSumId', {
      linSumId,
    });
    return query.getOne();
  }

  async getSummariesByTestSumId(
    testSumId: string,
  ): Promise<LinearitySummary[]> {
    const query = this.createQueryBuilder('ls').where(
      'ls.testSumId = :testSumId',
      {
        testSumId,
      },
    );
    return query.getMany();
  }
}
