import { EntityRepository, Repository } from 'typeorm';
import { FlowToLoadCheck } from '../entities/flow-to-load-check.entity';

@EntityRepository(FlowToLoadCheck)
export class FlowToLoadCheckRepository extends Repository<FlowToLoadCheck> {
  async getFlowToLoadChecksByTestSumIds(
    testSumIds: string[],
  ): Promise<FlowToLoadCheck[]> {
    const query = this.createQueryBuilder('f2lchk')
      .leftJoinAndSelect('f2lchk.system', 'ms')
      .where('f2lchk.testSumId IN (:...testSumIds)', {
        testSumIds,
      });

    return query.getMany();
  }
}
