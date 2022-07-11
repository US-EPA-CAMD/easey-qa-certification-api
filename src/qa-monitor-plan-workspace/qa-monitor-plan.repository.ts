import { MonitorPlan } from '../entities/workspace/monitor-plan.entity';
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
                                            .andWhere(':testDate >= rp.beginDate', {testDate})
                                            .andWhere('mp.endRptPeriod IS NULL');

        // A DTO check makes sure that either a unitId or stackPipeId exists
        if(unitId !== null && unitId !== undefined){
            query.andWhere('ml.unitId = :unitId', {unitId})
        }
        else {
            query.andWhere('ml.stackPipeId = :stackPipeId', {stackPipeId});
        }

        return query.getOne();
    }
}
