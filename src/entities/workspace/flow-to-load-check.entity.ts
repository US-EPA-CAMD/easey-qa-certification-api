import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';
import { TestSummary } from './test-summary.entity';

@Entity({ name: 'camdecmpswks.flow_to_load_check' })
export class FlowToLoadCheck extends BaseEntity {
  @PrimaryColumn({
    type: 'varchar',
    name: 'flow_load_check_id',
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
    type: 'varchar',
    name: 'test_basis_cd',
  })
  testBasisCode: string;

  @Column({
    type: 'varchar',
    name: 'op_level_cd',
  })
  operatingLevelCode: string;

  @Column({
    name: 'bias_adjusted_ind',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  biasAdjustedIndicator: number;

  @Column({
    name: 'avg_abs_pct_diff',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  averageAbsolutePercentDifference: number;

  @Column({
    name: 'num_hrs',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  numberOfHours: number;

  @Column({
    name: 'nhe_fuel',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  numberOfHoursExcludedForFuel: number;

  @Column({
    name: 'nhe_ramping',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  numberOfHoursExcludedRamping: number;

  @Column({
    name: 'nhe_bypass',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  numberOfHoursExcludedBypass: number;

  @Column({
    name: 'nhe_pre_rata',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  numberOfHoursExcludedPreRATA: number;

  @Column({
    name: 'nhe_test',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  numberOfHoursExcludedTest: number;

  @Column({
    name: 'nhe_main_bypass',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  numberOfHoursExcMainBypass: number;

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
    o => o.flowToLoadCheck,
  )
  @JoinColumn({ name: 'test_sum_id' })
  testSummary: TestSummary;
}
