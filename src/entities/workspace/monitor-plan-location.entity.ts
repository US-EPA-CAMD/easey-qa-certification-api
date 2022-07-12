import {
    BaseEntity,
    Entity,
    PrimaryColumn,
    JoinColumn,
    ManyToOne,
} from 'typeorm';
import { MonitorLocation } from '../monitor-location.entity';
import { MonitorPlan } from './monitor-plan.entity';

@Entity({ name: 'camdecmpswks.monitor_plan_location' })
export class MonitorPlanLocation extends BaseEntity {
    @PrimaryColumn({
        name: 'monitor_plan_location_id',
    })
    id: string;

    @JoinColumn({name: 'mon_plan_id'})
    @ManyToOne(
        ()=>MonitorPlan,
        mp => mp.id
    )
    monitorPlans: MonitorPlan[];

    @JoinColumn({name: 'mon_loc_id'})
    @ManyToOne(
        () => MonitorLocation,
        ml => ml.id
    )
    monitorLocations: MonitorLocation[];
}

