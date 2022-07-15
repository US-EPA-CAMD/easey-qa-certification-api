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

@Entity({ name: 'camdecmpswks.qa_supp_data' })
export class QASuppData extends BaseEntity {
  @PrimaryColumn({
    name: 'qa_supp_data_id',
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
    name: 'test_type_cd',
  })
  testTypeCode: string;

  @Column({
    name: 'test_sum_id',
  })
  testSumId: string;

  @Column({
    name: 'test_reason_cd',
  })
  testReasonCode: string;

  @Column({
    name: 'test_num',
  })
  testNumber: string;

  @Column({
    name: 'span_scale',
  })
  spanScaleCode: string;

  @Column({
    type: 'date',
    name: 'begin_date',
  })
  beginDate: Date;

  @Column({
    name: 'begin_hour',
    transformer: new NumericColumnTransformer(),
  })
  beginHour: number;

  @Column({
    name: 'begin_min',
    transformer: new NumericColumnTransformer(),
  })
  beginMinute: number;

  @Column({
    type: 'date',
    name: 'end_date',
  })
  endDate: Date;

  @Column({
    name: 'end_hour',
    transformer: new NumericColumnTransformer(),
  })
  endHour: number;

  @Column({
    name: 'end_min',
    transformer: new NumericColumnTransformer(),
  })
  endMinute: number;

  @Column({
    name: 'rpt_period_id',
    transformer: new NumericColumnTransformer(),
  })
  reportPeriodId: number;

  @Column({
    name: 'test_result_cd',
  })
  testResultCode: string;

  @Column({
    name: 'gp_ind',
    transformer: new NumericColumnTransformer(),
  })
  gracePeriodIndicator: number;

  @Column({
    type: 'date',
    name: 'reinstallation_date',
  })
  reinstallationDate: Date;

  @Column({
    name: 'reinstallation_hour',
    transformer: new NumericColumnTransformer(),
  })
  reinstallationHour: number;

  @Column({
    type: 'date',
    name: 'test_expire_date',
  })
  testExpireDate: Date;

  @Column({
    name: 'test_expire_hour',
    transformer: new NumericColumnTransformer(),
  })
  testExpireHour: number;

  @Column({ name: 'op_level_cd' })
  opLevelCode: string;

  @Column({ name: 'operating_condition_cd' })
  operatingConditionCode: string;

  @Column({ name: 'fuel_cd' })
  fuelCode: string;

  // TODO: There is not column in the database model
  @Column({ name: 'CAN_SUBMIT' })
  canSubmit: string;

  @ManyToOne(
    () => MonitorLocation,
    o => o.qaSuppData,
  )
  @JoinColumn({ name: 'mon_loc_id' })
  location: MonitorLocation;

  @ManyToOne(
    () => Component,
    o => o.qaSuppData,
  )
  @JoinColumn({ name: 'component_id' })
  component: Component;

  @ManyToOne(
    () => MonitorSystem,
    o => o.qaSuppData,
  )
  @JoinColumn({ name: 'mon_sys_id' })
  system: MonitorSystem;

  @ManyToOne(
    () => ReportingPeriod,
    o => o.qaSuppData,
  )
  @JoinColumn({ name: 'rpt_period_id' })
  reportingPeriod: ReportingPeriod;
}
