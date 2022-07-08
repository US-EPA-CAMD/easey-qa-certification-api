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

    // TEST-3 & TEST-6
    async getMonitorPlanWithALowerBeginDate(locationId: string, unitId: string, stackPipeId: string, testDate: Date): Promise<MonitorPlan>{

        const query = this.buildBaseQuery().where('ml.id = :locationId', {locationId,})
                                            .andWhere('rp.beginDate < :testDate', {testDate})
                                            .andWhere('mp.endRptPeriod IS NULL');

        // A DTO check makes sure that either a unitId or stackPipeId exists
        if(unitId !== null && unitId !== undefined){
            query.andWhere('ml.unitId = :unitId', {unitId})
        }
        else {
            query.andWhere('ml.stackPipeId = :stackPipeId', {stackPipeId});
        }

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
