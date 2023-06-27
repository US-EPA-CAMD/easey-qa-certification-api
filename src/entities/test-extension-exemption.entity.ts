import {
  BaseEntity,
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';

import { Component } from './component.entity';
import { MonitorSystem } from './monitor-system.entity';
import { ReportingPeriod } from './reporting-period.entity';
import { MonitorLocation } from './monitor-location.entity';

@Entity({ name: 'camdecmps.test_extension_exemption' })
export class TestExtensionExemption extends BaseEntity {
  @PrimaryColumn({
    name: 'test_extension_exemption_id',
  })
  id: string;

  @Column({
    name: 'mon_loc_id',
  })
  locationId: string;

  @Column({
    name: 'rpt_period_id',
    transformer: new NumericColumnTransformer(),
  })
  reportPeriodId: number;

  @Column({
    name: 'mon_sys_id',
  })
  monitoringSystemRecordId: string;

  @Column({
    name: 'component_id',
  })
  componentRecordId: string;

  @Column({
    name: 'fuel_cd',
  })
  fuelCode: string;

  @Column({
    name: 'extens_exempt_cd',
  })
  extensionOrExemptionCode: string;

  @Column({
    type: 'date',
    name: 'last_updated',
  })
  lastUpdated: Date;

  @Column({ name: 'updated_status_flg' })
  updatedStatusFlag: string;

  @Column({ name: 'needs_eval_flg' })
  needsEvalFlag: string;

  @Column({ name: 'chk_session_id' })
  checkSessionId: string;

  @Column({
    name: 'hours_used',
    transformer: new NumericColumnTransformer(),
  })
  hoursUsed: number;

  @Column({ name: 'userid' })
  userId: string;

  @Column({
    type: 'timestamp',
    name: 'add_date',
  })
  addDate: Date;

  @Column({
    type: 'timestamp',
    name: 'update_date',
  })
  updateDate: Date;

  @Column({
    name: 'span_scale_cd',
  })
  spanScaleCode: string;

  @Column({
    name: 'submission_id',
    transformer: new NumericColumnTransformer(),
  })
  submissionId: string;

  @Column({
    name: 'submission_availability_cd',
  })
  submissionAvailabilityCode: string;

  @ManyToOne(
    () => MonitorLocation,
    ml => ml.testSummaries,
  )
  @JoinColumn({ name: 'mon_loc_id' })
  location: MonitorLocation;

  @ManyToOne(
    () => Component,
    c => c.testSummaries,
  )
  @JoinColumn({ name: 'component_id' })
  component: Component;

  @ManyToOne(
    () => MonitorSystem,
    ms => ms.testSummaries,
  )
  @JoinColumn({ name: 'mon_sys_id' })
  system: MonitorSystem;

  @ManyToOne(
    () => ReportingPeriod,
    rp => rp.testSummaries,
  )
  @JoinColumn({ name: 'rpt_period_id' })
  reportingPeriod: ReportingPeriod;
}
