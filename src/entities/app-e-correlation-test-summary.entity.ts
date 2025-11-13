import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';

import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';
import { TestSummary } from './test-summary.entity';
import { AppECorrelationTestRun } from './app-e-correlation-test-run.entity';

@Entity({ name: 'camdecmps.ae_correlation_test_sum' })
export class AppECorrelationTestSummary extends BaseEntity {
  @PrimaryColumn({
    type: 'varchar',
    name: 'ae_corr_test_sum_id',
  })
  id: string;

  @Column({
    type: 'varchar',
    name: 'test_sum_id',
  })
  testSumId: string;

  @Column({
    type: 'varchar',
    name: 'userid',
  })
  userId: string;

  @Column({
    name: 'op_level_num',
    nullable: false,
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  operatingLevelForRun: number;

  @Column({
    name: 'mean_ref_value',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  meanReferenceValue: number;

  @Column({
    name: 'calc_mean_ref_value',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  calculatedMeanReferenceValue: number;

  @Column({
    name: 'avg_hrly_hi_rate',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  averageHourlyHeatInputRate: number;

  @Column({
    name: 'calc_avg_hrly_hi_rate',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  calculatedAverageHourlyHeatInputRate: number;

  @Column({
    name: 'f_factor',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  fFactor: number;

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

  @ManyToOne(
    () => TestSummary,
    o => o.appECorrelationTestSummaries,
  )
  @JoinColumn({ name: 'test_sum_id' })
  testSummary: TestSummary;

  @OneToMany(
    () => AppECorrelationTestRun,
    aectr => aectr.appECorrelationTestSummary,
  )
  @JoinColumn({ name: 'ae_corr_test_sum_id' })
  appECorrelationTestRuns: AppECorrelationTestRun[];
}
