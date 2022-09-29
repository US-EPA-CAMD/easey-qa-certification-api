import { BaseEntity, Entity, Column, PrimaryColumn } from 'typeorm';

import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';

@Entity({ name: 'camdecmps.ae_correlation_test_run' })
export class AppECorrelationTestRun extends BaseEntity {
  @PrimaryColumn({
    name: 'ae_corr_test_run_id',
  })
  id: string;

  @Column({
    name: 'ae_corr_test_sum_id',
  })
  appECorrTestSumId: string;

  @Column({
    name: 'run_num',
    transformer: new NumericColumnTransformer(),
  })
  runNumber: number;

  @Column({
    name: 'ref_value',
    transformer: new NumericColumnTransformer(),
  })
  referenceValue: number;

  @Column({
    name: 'hourly_hi_rate',
    transformer: new NumericColumnTransformer(),
  })
  hourlyHeatInputRate: number;

  @Column({
    name: 'calc_hourly_hi_rate',
    transformer: new NumericColumnTransformer(),
  })
  calculatedHourlyHeatInputRate: number;

  @Column({
    name: 'total_hi',
    transformer: new NumericColumnTransformer(),
  })
  totalHeatInput: number;

  @Column({
    name: 'calc_total_hi',
    transformer: new NumericColumnTransformer(),
  })
  calculatedTotalHeatInput: number;

  @Column({
    name: 'response_time',
    transformer: new NumericColumnTransformer(),
  })
  responseTime: number;

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

  @Column({ name: 'userid' })
  userId: string;

  @Column({
    name: 'add_date',
  })
  addDate: Date;

  @Column({
    name: 'update_date',
  })
  updateDate: Date;

  // @ManyToOne(
  //   () => AppECorrelationTestSummary,
  //   apcts => apcts.appECorrelationTestRuns,
  // )
  // @JoinColumn({ name: 'ae_corr_test_sum_id' })
  // appECorrelationTestSummary: AppECorrelationTestSummary;

  // TODO: Need to Join Columns for Appendix E Correlation Test Summary (Add this to entity)
  // @OneToMany(
  //   () => AppECorrelationTestRun,
  //   aectr => aectr.appECorrelationTestSummary,
  // )
  // @JoinColumn({ name: 'ae_corr_test_sum_id' })
  // appECorrelationTestRuns: AppECorrelationTestRun[];

  // TODO: Need to Join Columns for Appendix E Heat Input From Oil
  // TODO: Need to Join Columns for Appendix E Heat Input From Gas
}
