import { EntityRepository, Repository, SelectQueryBuilder } from 'typeorm';

import { QASuppData } from '../entities/workspace/qa-supp-data.entity';

@EntityRepository(QASuppData)
export class QASuppDataWorkspaceRepository extends Repository<QASuppData> {
  private buildBaseQuery(): SelectQueryBuilder<QASuppData> {
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

  async getUnassociatedQASuppDataByLocationIdAndTestSum(
    locationId: string,
    testSumId: string,
    testTypeCode: string,
    testNumber: string,
  ): Promise<QASuppData> {
    const query = this.buildBaseQuery()
      .where('ts.locationId = :locationId', {
        locationId,
      })
      .andWhere('ts.testTypeCode = :testTypeCode', { testTypeCode })
      .andWhere('ts.testNumber = :testNumber', { testNumber })
      .andWhere('ts.testSumId != :testSumId', { testSumId });

    return query.getOne();
  }

  async getUnassociatedQASuppDataByTestTypeCodeComponentIdEndDateEndTime(
    locationId: string,
    componentID: string,
    testTypeCode: string,
    testNumber: string,
    spanScaleCode: string,
    endDate: Date,
    endHour: number,
    endMinute: number,
  ): Promise<QASuppData> {
    const query = this.buildBaseQuery()
      .where('c.componentID = :componentID', { componentID })
      .andWhere('ts.locationId = :locationId', { locationId })
      .andWhere('ts.testTypeCode = :testTypeCode', { testTypeCode })
      .andWhere('ts.testNumber != :testNumber', { testNumber })
      .andWhere('ts.spanScaleCode = :spanScaleCode', { spanScaleCode })
      .andWhere('ts.endDate = :endDate', { endDate })
      .andWhere('ts.endHour = :endHour', { endHour })
      .andWhere('ts.endMinute = :endMinute', { endMinute });

    return query.getOne();
  }

  async getQASuppDataByTestTypeCodeComponentIdEndDateEndTime(
    locationId: string,
    componentID: string,
    testTypeCode: string,
    testNumber: string,
    spanScaleCode: string,
    endDate: Date,
    endHour: number,
    endMinute: number,
  ): Promise<QASuppData> {
    const query = this.buildBaseQuery()
      .where('c.componentID = :componentID', { componentID })
      .andWhere('ts.locationId = :locationId', { locationId })
      .andWhere('ts.testTypeCode = :testTypeCode', { testTypeCode })
      .andWhere('ts.testNumber = :testNumber', { testNumber })
      .andWhere('ts.spanScaleCode = :spanScaleCode', { spanScaleCode })
      .andWhere('ts.endDate = :endDate', { endDate })
      .andWhere('ts.endHour = :endHour', { endHour })
      .andWhere('ts.endMinute = :endMinute', { endMinute });

    return query.getOne();
  }
}
