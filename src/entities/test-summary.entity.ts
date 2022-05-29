import {
  BaseEntity,
  Entity,
  Column,
  PrimaryColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';

import { MonitorLocation } from './monitor-location.entity';

@Entity({ name: 'camdecmps.test_summary' })
export class TestSummary extends BaseEntity {
  @PrimaryColumn({
    name: 'test_sum_id',
  })
  id: string;

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


  @Column({ name: 'userid' })
  userId: string;

  @Column({
    type: 'date',
    name: 'add_date'
  })
  addDate: Date;

  @Column({
    type: 'date',
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

  @OneToOne(
    () => MonitorLocation,
    ml => ml.testSummaries,
  )
  @JoinColumn({ name: 'mon_loc_id' })
  location: MonitorLocation;
}