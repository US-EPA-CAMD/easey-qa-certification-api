import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { AppEHeatInputFromOil } from '../entities/workspace/app-e-heat-input-from-oil.entity';

@Injectable()
export class AppEHeatInputFromOilWorkspaceRepository extends Repository<
  AppEHeatInputFromOil
> {
  constructor(entityManager: EntityManager) {
    super(AppEHeatInputFromOil, entityManager);
  }

  async getAppEHeatInputFromOilById(id: string): Promise<AppEHeatInputFromOil> {
    const query = this.createQueryBuilder('aehio')
      .leftJoinAndSelect('aehio.system', 'ms')
      .where('aehio.id = :id', {
        id,
      });

    return query.getOne();
  }

  async getAppEHeatInputFromOilsByTestRunId(
    appECorrTestRunId: string,
  ): Promise<AppEHeatInputFromOil[]> {
    const query = this.createQueryBuilder('aehio')
      .leftJoinAndSelect('aehio.system', 'ms')
      .where('aehio.appECorrTestRunId = :appECorrTestRunId', {
        appECorrTestRunId,
      });

    return query.getMany();
  }

  async getAppEHeatInputFromOilsByTestRunIds(
    appECorrTestRunIds: string[],
  ): Promise<AppEHeatInputFromOil[]> {
    const query = this.createQueryBuilder('aehio')
      .leftJoinAndSelect('aehio.system', 'ms')
      .where('aehio.appECorrTestRunId IN (:...appECorrTestRunIds)', {
        appECorrTestRunIds,
      });

    return query.getMany();
  }

  async findDuplicate(
    aeHiOilId: string,
    testSumId: string,
    opLevel: number,
    runNumber: number,
    monSysId: string,
  ): Promise<AppEHeatInputFromOil> {
    const query = this.createQueryBuilder('aehio')
      .innerJoin('aehio.appECorrelationTestRun', 'aerun')
      .innerJoin('aerun.appECorrelationTestSummary', 'aesum')
      .innerJoin('aesum.testSummary', 'testsum')
      .innerJoin('aehio.system', 'monsys')
      .where('testsum.id = :testsumid', { testsumid: testSumId })
      .andWhere('aesum.operatingLevelForRun = :oplevel', { oplevel: opLevel })
      .andWhere('aerun.runNumber = :runnumber', { runnumber: runNumber })
      .andWhere('monsys.monitoringSystemID = :monsysid', {
        monsysid: monSysId,
      });

    if (aeHiOilId) query.andWhere('aehio.id != :id', { id: aeHiOilId });

    return query.getOne();
  }
}
