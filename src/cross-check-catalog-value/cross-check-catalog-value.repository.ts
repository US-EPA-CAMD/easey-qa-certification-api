import { EntityRepository, Repository } from 'typeorm';
import { CrossCheckCatalogValue } from '../entities/cross-check-catalog-value.entity';

@EntityRepository(CrossCheckCatalogValue)
export class CrossCheckCatalogValueRepository extends Repository<
  CrossCheckCatalogValue
> {
  async getParameterAndTypes(parameter: string, crossCheckCatalogName: string) {
    return this.createQueryBuilder('cccv')
      .select('value2', 'value3')
      .innerJoin('cccv.crossCheckCatalog', 'ccc')
      .where('ccc.crossCheckCatalogName = :crossCheckCatalogName', {
        crossCheckCatalogName,
      })
      .andWhere('cccv.value2 - :parameter', { parameter })
      .getMany();
  }
}
