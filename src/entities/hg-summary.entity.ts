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
import { HgInjection } from './hg-injection.entity';

@Entity({
  name: 'camdecmps.hg_test_summary',
})
export class HgSummary extends BaseEntity {
  @PrimaryColumn({
    type: 'varchar',
    nullable: false,
    name: 'hg_test_sum_id',
  })
  id: string;

  @Column({
    type: 'varchar',
    nullable: false,
    name: 'test_sum_id',
  })
  testSumId: string;

  @Column({
    type: 'varchar',
    name: 'gas_level_cd',
  })
  gasLevelCode: string;

  @Column({
    transformer: new NumericColumnTransformer(),
    name: 'mean_measured_value',
  })
  meanMeasuredValue: number;

  @Column({
    transformer: new NumericColumnTransformer(),
    name: 'calc_mean_measured_value',
  })
  calculatedMeanMeasuredValue: number;

  @Column({
    transformer: new NumericColumnTransformer(),
    name: 'mean_ref_value',
  })
  meanReferenceValue: number;

  @Column({
    transformer: new NumericColumnTransformer(),
    name: 'calc_mean_ref_value',
  })
  calculatedMeanReferenceValue: number;

  @Column({
    transformer: new NumericColumnTransformer(),
    name: 'percent_error',
  })
  percentError: number;

  @Column({
    transformer: new NumericColumnTransformer(),
    name: 'calc_percent_error',
  })
  calculatedPercentError: number;

  @Column({
    transformer: new NumericColumnTransformer(),
    name: 'aps_ind',
  })
  apsIndicator: number;

  @Column({
    transformer: new NumericColumnTransformer(),
    name: 'calc_aps_ind',
  })
  calculatedAPSIndicator: number;

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
    type: 'varchar',
    name: 'userid',
  })
  userId: string;

  @ManyToOne(
    () => TestSummary,
    o => o.HgSummary,
  )
  @JoinColumn({ name: 'test_sum_id' })
  testSummary: TestSummary;

  @OneToMany(
    () => HgSummary,
    o => o.testSummary,
  )
  @JoinColumn({ name: 'hg_test_sum_id' })
  HgInjection: HgInjection[];
}
