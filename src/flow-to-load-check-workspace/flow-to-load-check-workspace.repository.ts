import { EntityRepository, Repository } from 'typeorm';
import { FlowToLoadCheck } from '../entities/workspace/flow-to-load-check.entity';

@EntityRepository(FlowToLoadCheck)
export class FlowToLoadCheckWorkspaceRepository extends Repository<
  FlowToLoadCheck
> {
  async getFlowToLoadChecksByTestSumIds(
    testSumIds: string[],
  ): Promise<FlowToLoadCheck[]> {
    const query = this.createQueryBuilder('f2lchk')
      .leftJoinAndSelect('f2lchk.system', 'o')
      .where('f2lchk.testSumId IN (:...testSumIds)', {
        testSumIds,
      });

    return query.getMany();
  }
}
