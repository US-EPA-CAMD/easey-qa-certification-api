import {
  BaseEntity,
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';

import { TestSummary } from './test-summary.entity';
import { RataFrequencyCode } from './rata-frequency-code.entity';

@Entity({ name: 'camdecmpswks.rata' })
export class Rata extends BaseEntity {
  @PrimaryColumn({
    name: 'rata_id',
  })
  id: string;

  @Column({
    name: 'test_sum_id',
  })
  testSumId: string;

  @Column({
    name: 'rata_frequency_cd',
  })
  rataFrequencyCode: string;

  @Column({
    name: 'calc_rata_frequency_cd',
  })
  calculatedRataFrequencyCode: string;

  @Column({
    name: 'relative_accuracy',
    transformer: new NumericColumnTransformer(),
  })
  relativeAccuracy: number;

  @Column({
    name: 'calc_relative_accuracy',
    transformer: new NumericColumnTransformer(),
  })
  calculatedRelativeAccuracy: number;

  @Column({
    name: 'overall_bias_adj_factor',
    transformer: new NumericColumnTransformer(),
  })
  overallBiasAdjustmentFactor: number;

  @Column({
    name: 'calc_overall_bias_adj_factor',
    transformer: new NumericColumnTransformer(),
  })
  calculatedOverallBiasAdjustmentFactor: number;

  @Column({
    name: 'num_load_level',
    transformer: new NumericColumnTransformer(),
  })
  numberLoadLevel: number;

  @Column({
    name: 'calc_num_load_level',
    transformer: new NumericColumnTransformer(),
  })
  calculatedNumberLoadLevel: number;

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
    o => o.ratas,
  )
  @JoinColumn({ name: 'test_sum_id' })
  testSummary: TestSummary;

  @ManyToOne(
    () => RataFrequencyCode,
    o => o.rata,
  )
  @JoinColumn({ name: 'rata_frequency_cd' })
  rataFrequency: RataFrequencyCode;
}
