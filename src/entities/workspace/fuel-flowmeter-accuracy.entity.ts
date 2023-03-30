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

@Entity({ name: 'camdecmpswks.fuel_flowmeter_accuracy' })
export class FuelFlowmeterAccuracy extends BaseEntity {
  @PrimaryColumn({
    type: 'varchar',
    name: 'fuel_flow_acc_id',
  })
  id: string;

  @Column({
    type: 'varchar',
    name: 'test_sum_id',
  })
  testSumId: string;

  @Column({
    type: 'varchar',
    name: 'acc_test_method_cd',
  })
  accuracyTestMethodCode: string;

  @Column({
    type: 'date',
    name: 'reinstall_date',
  })
  reinstallationDate: Date;

  @Column({
    name: 'reinstall_hour',
    transformer: new NumericColumnTransformer(),
  })
  reinstallationHour: number;

  @Column({
    name: 'low_fuel_accuracy',
    transformer: new NumericColumnTransformer(),
  })
  lowFuelAccuracy: number;

  @Column({
    name: 'mid_fuel_accuracy',
    transformer: new NumericColumnTransformer(),
  })
  midFuelAccuracy: number;

  @Column({
    name: 'high_fuel_accuracy',
    transformer: new NumericColumnTransformer(),
  })
  highFuelAccuracy: number;

  @Column({
    type: 'varchar',
    name: 'userid',
  })
  userId: string;

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
    ffma => ffma.fuelFlowmeterAccuracy,
  )
  @JoinColumn({ name: 'test_sum_id' })
  testSummary: TestSummary;
}
