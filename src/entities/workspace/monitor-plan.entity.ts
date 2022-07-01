import {
    BaseEntity,
    Column,
    Entity,
    PrimaryColumn,
    JoinColumn,
    ManyToOne,
    OneToMany,
} from 'typeorm';
import { ReportingPeriod } from '../reporting-period.entity';
import { MonitorPlanLocation } from './monitor-plan-location.entity';

@Entity({ name: 'camdecmpswks.monitor_plan' })
export class MonitorPlan extends BaseEntity {
    @PrimaryColumn({
        name: 'mon_plan_id',
    })
    id: string;

    @Column({name: 'fac_id'})
    facilityId: number;

    @Column({name: 'last_updated'})
    lastUpdated: Date;

    @Column({name: 'updated_status_flg'})
    updatedStatusFlag: string;

    @Column({name: 'needs_eval_flg'})
    needsEvalFlag: string;

    @Column({name: 'chk_session_id'})
    checkSessionId: string;

    @Column({name: 'userid'})
    userId: string; 

    @Column({name: 'add_date'})
    addDate: Date;

    @Column({name: 'update_date'})
    updateDate: Date;

    @Column({name: 'submission_id'})
    submissionId: number;

    @Column({name: 'submission_availability_cd'})
    submissionAvailabilityCd: string;

    @Column({name: 'pending_status_cd'})
    pendingStatusCd: string;

    @JoinColumn({name: 'begin_rpt_period_id'})
    @ManyToOne(
        () => ReportingPeriod,
        rp => rp.id
    )
    beginRptPeriod: ReportingPeriod;

    @JoinColumn({name: 'end_rpt_period_id'})
    @ManyToOne(
        () => ReportingPeriod,
        rp => rp.id
    )
    endRptPeriod: ReportingPeriod; 

    @Column({name: 'last_evaluated_date'})
    lastEvaluatedDate: Date;

    @Column({name: 'eval_status_cd'})
    evalStatusCd: string;    

    @OneToMany(
        () => MonitorPlanLocation,
        mpl => mpl.monitorPlans
    )
    monitorPlanLocations: MonitorPlanLocation[]
}

