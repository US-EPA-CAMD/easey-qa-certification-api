import { Injectable } from '@nestjs/common';
import { EntityManager, Repository, SelectQueryBuilder } from 'typeorm';

import { QASuppData } from '../entities/workspace/qa-supp-data.entity';

@Injectable()
export class QASuppDataWorkspaceRepository extends Repository<QASuppData> {
  constructor(entityManager: EntityManager) {
    super(QASuppData, entityManager);
  }

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
      .andWhere('ts.testNumber = :testNumber', { testNumber });

    if (testSumId) query.andWhere('ts.testSumId != :testSumId', { testSumId });

    return query.getOne();
  }

  async getUnassociatedQASuppDataByTestTypeCodeComponentIdEndDateEndTime(
    locationId: string,
    monitoringSystemID: string,
    componentID: string,
    testTypeCode: string,
    testNumber: string,
    spanScaleCode?: string,
    endDate?: Date,
    endHour?: number,
    endMinute?: number,
  ): Promise<QASuppData> {
    const query = this.buildBaseQuery()
      .where('ts.locationId = :locationId', { locationId })
      .andWhere('ts.testTypeCode = :testTypeCode', { testTypeCode })
      .andWhere('ts.testNumber != :testNumber', { testNumber });

    if (monitoringSystemID) {
      query.andWhere('ms.monitoringSystemID = :monitoringSystemID', {
        monitoringSystemID,
      });
    }

    if (componentID) {
      query.andWhere('c.componentID = :componentID', { componentID });
    }

    if (spanScaleCode) {
      query.andWhere('ts.spanScaleCode = :spanScaleCode', { spanScaleCode });
    }
    if (endDate && endHour && endMinute) {
      query
        .andWhere('ts.endDate = :endDate', { endDate })
        .andWhere('ts.endHour = :endHour', { endHour })
        .andWhere('ts.endMinute = :endMinute', { endMinute });
    } else if (endDate && endHour) {
      query
        .andWhere('ts.endDate = :endDate', { endDate })
        .andWhere('ts.endHour = :endHour', { endHour });
    }

    return query.getOne();
  }

  async getQASuppDataByTestTypeCodeComponentIdEndDateEndTime(
    locationId: string,
    monitoringSystemID: string,
    componentID: string,
    testTypeCode: string,
    testNumber: string,
    spanScaleCode?: string,
    endDate?: Date,
    endHour?: number,
    endMinute?: number,
  ): Promise<QASuppData> {
    const query = this.buildBaseQuery()
      .where('ts.locationId = :locationId', { locationId })
      .andWhere('ts.testTypeCode = :testTypeCode', { testTypeCode })
      .andWhere('ts.testNumber = :testNumber', { testNumber });

    if (monitoringSystemID) {
      query.andWhere('ms.monitoringSystemID = :monitoringSystemID', {
        monitoringSystemID,
      });
    }

    if (componentID) {
      query.andWhere('c.componentID = :componentID', { componentID });
    }

    if (spanScaleCode) {
      query.andWhere('ts.spanScaleCode = :spanScaleCode', { spanScaleCode });
    }
    if (endDate && endHour && endMinute) {
      query
        .andWhere('ts.endDate = :endDate', { endDate })
        .andWhere('ts.endHour = :endHour', { endHour })
        .andWhere('ts.endMinute = :endMinute', { endMinute });
    } else if (endDate && endHour) {
      query
        .andWhere('ts.endDate = :endDate', { endDate })
        .andWhere('ts.endHour = :endHour', { endHour });
    }

    return query.getOne();
  }
}
