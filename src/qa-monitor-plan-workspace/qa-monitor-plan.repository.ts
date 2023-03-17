import { MonitorPlan } from '../entities/workspace/monitor-plan.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(MonitorPlan)
export class QAMonitorPlanWorkspaceRepository extends Repository<MonitorPlan> {
  private buildBaseQuery() {
    return this.createQueryBuilder('mp')
      .innerJoin('mp.monitorPlanLocations', 'mpl')
      .leftJoinAndSelect('mpl.monitorLocations', 'ml')
      .leftJoinAndSelect('ml.unit', 'u')
      .leftJoinAndSelect('ml.stackPipe', 'sp')
      .leftJoinAndSelect('mp.beginRptPeriod', 'rp');
  }

  // TEST-3 & TEST-6
  async getMonitorPlanWithALowerBeginDate(
    locationId: string,
    unitId: string,
    stackPipeId: string,
    testDate: Date,
  ): Promise<MonitorPlan> {
    const query = this.buildBaseQuery()
      .where('ml.id = :locationId', { locationId })
      .andWhere(':testDate >= rp.beginDate', { testDate })
      .andWhere('mp.endRptPeriod IS NULL');

    // Check for either unitId or stackPipeId
    if (unitId !== null && unitId !== undefined) {
      query.andWhere('u.name = :unitId', { unitId });
    } else {
      query.andWhere('sp.name = :stackPipeId', { stackPipeId });
    }

    return query.getOne();
  }
}
