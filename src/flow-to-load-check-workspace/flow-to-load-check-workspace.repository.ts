import { EntityRepository, Repository } from 'typeorm';
import { FlowToLoadCheck } from '../entities/workspace/flow-to-load-check.entity';

@EntityRepository(FlowToLoadCheck)
export class FlowToLoadCheckWorkspaceRepository extends Repository<
  FlowToLoadCheck
> {
  async getFlowToLoadChecksByTestSumIds(
    testSumIds: string[],
  ): Promise<FlowToLoadCheck[]> {
    const query = this.createQueryBuilder('ftlchk')
      .leftJoinAndSelect('ftlchk.system', 'ms')
      .where('ftlchk.testSumId IN (:...testSumIds)', {
        testSumIds,
      });

    return query.getMany();
  }
}
