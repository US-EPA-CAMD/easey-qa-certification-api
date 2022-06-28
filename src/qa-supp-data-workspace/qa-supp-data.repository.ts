import { EntityRepository, Repository } from 'typeorm';

import { QASuppData } from '../entities/workspace/qa-supp-data.entity';

@EntityRepository(QASuppData)
export class QASuppDataWorkspaceRepository extends Repository<QASuppData> {
  private buildBaseQuery() {
    return this.createQueryBuilder('ts')
      .innerJoinAndSelect('ts.location', 'ml')
      .leftJoinAndSelect('ts.system', 'ms')
      .leftJoinAndSelect('ts.component', 'c')
      .leftJoinAndSelect('ts.reportingPeriod', 'rp')
      .leftJoinAndSelect('ml.unit', 'u')
      .leftJoin('u.plant', 'up')
      .leftJoinAndSelect('ml.stackPipe', 'sp')
      .leftJoin('sp.plant', 'spp');
  }

  async getQASuppDataByLocationId(
    locationId: string,
    testTypeCode?: string,
    testNumber?: string,
  ): Promise<QASuppData> {
    const query = this.buildBaseQuery().where('ts.locationId = :locationId', {
      locationId,
    });

    if (testTypeCode) {
      query.andWhere('ts.testTypeCode = :testTypeCode', { testTypeCode });
    }

    if (testNumber) {
      query.andWhere('ts.testNumber = :testNumber', { testNumber });
    }

    return query.getOne();
  }
}
