import { EntityRepository, Repository } from 'typeorm';
import { CrossCheckCatalogValue } from '../entities/cross-check-catalog-value.entity';

@EntityRepository(CrossCheckCatalogValue)
export class CrossCheckCatalogValueRepository extends Repository<
  CrossCheckCatalogValue
> {
  async getParameterAndTypes(crossCheckCatalogName: string, parameter: string) {
    return await this.createQueryBuilder('cccv')
      .select(['cccv.value1', 'cccv.value2'])
      .innerJoin('cccv.crossCheckCatalog', 'ccc')
      .where('ccc.crossCheckCatalogName = :crossCheckCatalogName', {
        crossCheckCatalogName,
      })
      .andWhere('cccv.value1 = :parameter', { parameter })
      .getOne();
  }
}
