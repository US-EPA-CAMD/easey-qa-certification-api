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

@Entity({ name: 'camdecmps.fuel_flow_to_load_check' })
export class FuelFlowToLoadTest extends BaseEntity {
  @PrimaryColumn({
    name: 'fuel_flow_load_id',
  })
  id: string;

  @Column({
    name: 'test_sum_id',
  })
  testSumId: string;

  @Column({
    name: 'test_basis_cd',
  })
  testBasisCode: string;

  @Column({
    name: 'avg_diff',
    transformer: new NumericColumnTransformer(),
  })
  averageDifference: number;

  @Column({
    name: 'num_hrs',
    transformer: new NumericColumnTransformer(),
  })
  numberOfHoursUsed: number;

  @Column({
    name: 'nhe_cofiring',
    transformer: new NumericColumnTransformer(),
  })
  numberOfHoursExcludedCofiring: number;

  @Column({
    name: 'nhe_ramping',
    transformer: new NumericColumnTransformer(),
  })
  numberOfHoursExcludedRamping: number;

  @Column({
    name: 'nhe_low_range',
    transformer: new NumericColumnTransformer(),
  })
  numberOfHoursExcludedLowRange: number;

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
    o => o.fuelFlowToLoadTests,
  )
  @JoinColumn({ name: 'test_sum_id' })
  testSummary: TestSummary;
}
