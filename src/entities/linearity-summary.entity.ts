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

import { TestSummary } from './test-summary.entity';
import { LinearityInjection } from './linearity-injection.entity';

@Entity({ name: 'camdecmps.linearity_summary' })
export class LinearitySummary extends BaseEntity {
  @PrimaryColumn({
    name: 'lin_sum_id',
  })
  id: string;

  @Column({
    name: 'test_sum_id',
  })
  testSumId: string;

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
    name: 'mean_measured_value',
    transformer: new NumericColumnTransformer(),
  })
  meanMeasuredValue: number;

  @Column({
    name: 'calc_mean_measured_value',
    transformer: new NumericColumnTransformer(),
  })
  calculatedMeanMeasuredValue: number;

  @Column({
    name: 'percent_error',
    transformer: new NumericColumnTransformer(),
  })
  percentError: number;

  @Column({
    name: 'calc_percent_error',
    transformer: new NumericColumnTransformer(),
  })
  calculatedPercentError: number;

  @Column({
    name: 'aps_ind',
    transformer: new NumericColumnTransformer(),
  })
  apsIndicator: number;

  @Column({
    name: 'calc_aps_ind',
    transformer: new NumericColumnTransformer(),
  })
  calculatedAPSIndicator: number;

  @Column({ name: 'gas_level_cd' })
  gasLevelCode: string;

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

  @ManyToOne(
    () => TestSummary,
    ts => ts.linearitySummaries,
  )
  @JoinColumn({ name: 'test_sum_id' })
  testSummary: TestSummary;

  @OneToMany(
    () => LinearityInjection,
    li => li.linearitySummary,
  )
  @JoinColumn({ name: 'lin_sum_id' }) 
  injections: LinearityInjection[];
}
