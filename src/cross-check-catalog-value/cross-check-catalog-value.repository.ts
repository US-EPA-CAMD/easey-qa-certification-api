import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { CrossCheckCatalogValue } from '../entities/cross-check-catalog-value.entity';

@Injectable()
export class CrossCheckCatalogValueRepository extends Repository<
  CrossCheckCatalogValue
> {
  constructor(entityManager: EntityManager) {
    super(CrossCheckCatalogValue, entityManager);
  }

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
