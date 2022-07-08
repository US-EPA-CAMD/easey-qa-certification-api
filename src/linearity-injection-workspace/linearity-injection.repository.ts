import { Repository, EntityRepository } from 'typeorm';
import { LinearityInjection } from '../entities/workspace/linearity-injection.entity';

@EntityRepository(LinearityInjection)
export class LinearityInjectionWorkspaceRepository extends Repository<
  LinearityInjection
> {
  async getInjectionsByLinSumId(
    linSumId: string,
  ): Promise<LinearityInjection[]> {
    const query = this.createQueryBuilder('li').where(
      'li.linSumId = :linSumId',
      {
        linSumId,
      },
    );
    return query.getMany();
  }
}
