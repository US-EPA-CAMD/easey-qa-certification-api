import { EntityRepository, Repository } from 'typeorm';
import { CrossCheckCatalogValue } from '../entities/cross-check-catalog-value.entity';

@EntityRepository(CrossCheckCatalogValue)
export class CrossCheckCatalogValueRepository extends Repository<
  CrossCheckCatalogValue
> {
  async getParameterAndTypes(crossCheckCatalogName: string, parameter: string) {
    const result = await this.createQueryBuilder('cccv')
      .select(['value1', 'value2'])
      .innerJoin('cccv.crossCheckCatalog', 'ccc')
      .where('ccc.crossCheckCatalogName = :crossCheckCatalogName', {
        crossCheckCatalogName,
      })
      .andWhere('cccv.value1 = :parameter', { parameter })
      .getOne();

    console.log(result);

    return result;
  }
}
