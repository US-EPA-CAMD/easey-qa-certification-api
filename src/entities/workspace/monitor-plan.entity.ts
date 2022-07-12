import {
  BaseEntity,
  Column,
  Entity,
  PrimaryColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { MonitorLocation } from '../monitor-location.entity';
import { ReportingPeriod } from '../reporting-period.entity';
import { MonitorPlanLocation } from './monitor-plan-location.entity';

@Entity({ name: 'camdecmpswks.monitor_plan' })
export class MonitorPlan extends BaseEntity {
  @PrimaryColumn({
    name: 'mon_plan_id',
    type: 'varchar',
  })
  id: string;

  @Column({ name: 'fac_id', type: 'numeric' })
  facilityId: number;

  @Column({ name: 'last_updated', type: 'date' })
  lastUpdated: Date;

  @Column({ name: 'updated_status_flg', type: 'varchar' })
  updatedStatusFlag: string;

  @Column({ name: 'needs_eval_flg', type: 'varchar' })
  needsEvalFlag: string;

  @Column({ name: 'chk_session_id', type: 'varchar' })
  checkSessionId: string;

  @Column({ name: 'userid', type: 'varchar' })
  userId: string;

  @Column({ name: 'add_date', type: 'date' })
  addDate: Date;

  @Column({ name: 'update_date', type: 'date' })
  updateDate: Date;

  @Column({ name: 'submission_id', type: 'numeric' })
  submissionId: number;

  @Column({ name: 'submission_availability_cd', type: 'varchar' })
  submissionAvailabilityCd: string;

  @Column({ name: 'pending_status_cd', type: 'varchar' })
  pendingStatusCd: string;

  @JoinColumn({ name: 'begin_rpt_period_id' })
  @ManyToOne(
    () => ReportingPeriod,
    rp => rp.id,
  )
  beginRptPeriod: ReportingPeriod;

  @JoinColumn({ name: 'end_rpt_period_id' })
  @ManyToOne(
    () => ReportingPeriod,
    rp => rp.id,
  )
  endRptPeriod: ReportingPeriod;

  @Column({ name: 'last_evaluated_date', type: 'date' })
  lastEvaluatedDate: Date;

  @Column({ name: 'eval_status_cd', type: 'varchar' })
  evalStatusCd: string;

  @OneToMany(
    () => MonitorPlanLocation,
    mpl => mpl.monitorPlans,
  )
  monitorPlanLocations: MonitorPlanLocation[];
}
