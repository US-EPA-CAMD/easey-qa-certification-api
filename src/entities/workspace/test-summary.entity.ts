import {
  BaseEntity,
  Entity,
  Column,
  PrimaryColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';

import { Component } from './component.entity';
import { MonitorSystem } from './monitor-system.entity';
import { ReportingPeriod } from './reporting-period.entity';
import { MonitorLocation } from './monitor-location.entity';
import { LinearitySummary } from './linearity-summary.entity';

@Entity({ name: 'camdecmpswks.test_summary' })
export class TestSummary extends BaseEntity {
  @PrimaryColumn({
    name: 'test_sum_id',
  })
  id: string;

  @Column({
    name: 'mon_loc_id',
  })
  locationId: string;

  @Column({
    name: 'mon_sys_id',
  })
  monitorSystemRecordId: string;

  @Column({
    name: 'component_id',
  })
  componentRecordId: string;

  @Column({
    name: 'test_num',
  })
  testNumber: string;

  @Column({
    name: 'gp_ind',
    transformer: new NumericColumnTransformer()
  })
  gracePeriodIndicator: number;

  @Column({
    name: 'calc_gp_ind',
    transformer: new NumericColumnTransformer()
  })
  calculatedGracePeriodIndicator: number;

  @Column({
    name: 'test_type_cd',
  })
  testTypeCode: string;

  @Column({
    name: 'test_reason_cd',
  })
  testReasonCode: string;

  @Column({
    name: 'test_result_cd',
  })
  testResultCode: string;

  @Column({
    name: 'calc_test_result_cd',
  })
  calculatedTestResultCode: string;

  @Column({
    name: 'rpt_period_id',
    transformer: new NumericColumnTransformer()
  })
  reportPeriodId: number;

  @Column({
    name: 'test_description',
  })
  testDescription: string;

  @Column({
    type: 'date',
    name: 'begin_date'
  })
  beginDate: Date;

  @Column({
    name: 'begin_hour',
    transformer: new NumericColumnTransformer()
  })
  beginHour: number;

  @Column({
    name: 'begin_min',
    transformer: new NumericColumnTransformer()
  })
  beginMinute: number;

  @Column({
    type: 'date',
    name: 'end_date'
  })
  endDate: Date;

  @Column({
    name: 'end_hour',
    transformer: new NumericColumnTransformer()
  })
  endHour: number;

  @Column({
    name: 'end_min',
    transformer: new NumericColumnTransformer()
  })
  endMinute: number;

  @Column({
    name: 'calc_span_value',
    transformer: new NumericColumnTransformer()
  })
  calculatedSpanValue: number;

  @Column({
    name: 'test_comment',
  })
  testComment: string;

  @Column({
    type: 'date',
    name: 'last_updated'
  })
  lastUpdated: Date;

  @Column({ name: 'updated_status_flg' })
  updatedStatusFlag: string;
  
  @Column({ name: 'needs_eval_flg' })
  needsEvalFlag: string;

  @Column({ name: 'eval_status_cd' })
  evalStatusCode: string;

  @Column({ name: 'userid' })
  userId: string;

  @Column({
    name: 'add_date'
  })
  addDate: Date;

  @Column({
    name: 'update_date'
  })
  updateDate: Date;

  @Column({
    name: 'span_scale_cd',
  })
  spanScaleCode: string;

  @Column({
    name: 'injection_protocol_cd',
  })
  injectionProtocolCode: string;

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

  @OneToMany(
    () => LinearitySummary,
    ls => ls.testSummary,
  )
  @JoinColumn({ name: 'test_sum_id' })
  linearitySummaries: LinearitySummary[];

  @ManyToOne(
    () => ReportingPeriod,
    rp => rp.testSummaries,
  )
  @JoinColumn({ name: 'rpt_period_id' })
  reportingPeriod: ReportingPeriod;
}
