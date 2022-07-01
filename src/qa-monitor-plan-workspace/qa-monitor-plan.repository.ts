import { MonitorPlan } from 'src/entities/workspace/monitor-plan.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(MonitorPlan)
export class QAMonitorPlanWorkspaceRepository extends Repository<MonitorPlan> {
    private buildBaseQuery(){
        return this.createQueryBuilder('mp')
                .innerJoin('mp.monitorPlanLocations', 'mpl')
                .leftJoinAndSelect('mpl.monitorLocations', 'ml')
                .leftJoinAndSelect('mp.beginRptPeriod', 'rp')

    }

    async getMonitorPlanWithALowerBeginDate(locationId: string, unitId: string, testBeginDate: Date): Promise<MonitorPlan>{

        const query = this.buildBaseQuery().where('ml.id = :locationId', {locationId,})
                                            .andWhere('ml.unitId = :unitId', {unitId})
                                            .andWhere('rp.beginDate < :testBeginDate', {testBeginDate})
                                            .andWhere('mp.endRptPeriod IS NULL');
        const [sql, params] = query.getQueryAndParameters();

        console.log(sql)
        console.log(params)
        return query.getOne();
    }

//   private buildBaseQuery() {
//     return this.createQueryBuilder('ts')
//       .innerJoinAndSelect('ts.location', 'ml')
//       .leftJoinAndSelect('ts.system', 'ms')
//       .leftJoinAndSelect('ts.component', 'c')
//       .leftJoinAndSelect('ts.reportingPeriod', 'rp')
//       .leftJoinAndSelect('ml.unit', 'u')
//       .leftJoin('u.plant', 'up')
//       .leftJoinAndSelect('ml.stackPipe', 'sp')
//       .leftJoin('sp.plant', 'spp');
//   }

//   async getQASuppDataByLocationId(
//     locationId: string,
//     testTypeCode?: string,
//     testNumber?: string,
//   ): Promise<QASuppData> {
//     const query = this.buildBaseQuery().where('ts.locationId = :locationId', {
//       locationId,
//     });

//     if (testTypeCode) {
//       query.andWhere('ts.testTypeCode = :testTypeCode', { testTypeCode });
//     }

//     if (testNumber) {
//       query.andWhere('ts.testNumber = :testNumber', { testNumber });
//     }

//     return query.getOne();
//   }
}
