import { EntityRepository, Repository } from 'typeorm';
import { FlowToLoadCheck } from '../entities/flow-to-load-check.entity';

@EntityRepository(FlowToLoadCheck)
export class FlowToLoadCheckRepository extends Repository<FlowToLoadCheck> {
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
