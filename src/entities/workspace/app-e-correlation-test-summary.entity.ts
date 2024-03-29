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

@Entity({ name: 'camdecmpswks.ae_correlation_test_sum' })
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
    transformer: new NumericColumnTransformer(),
  })
  operatingLevelForRun: number;

  @Column({
    name: 'mean_ref_value',
    transformer: new NumericColumnTransformer(),
  })
  meanReferenceValue: number;

  @Column({
    name: 'calc_mean_ref_value',
    transformer: new NumericColumnTransformer(),
  })
  calculatedMeanReferenceValue: number;

  @Column({
    name: 'avg_hrly_hi_rate',
    transformer: new NumericColumnTransformer(),
  })
  averageHourlyHeatInputRate: number;

  @Column({
    name: 'calc_avg_hrly_hi_rate',
    transformer: new NumericColumnTransformer(),
  })
  calculatedAverageHourlyHeatInputRate: number;

  @Column({
    name: 'f_factor',
    transformer: new NumericColumnTransformer(),
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
