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
import { UnitDefaultTestRun } from './unit-default-test-run.entity';

@Entity({
  name: 'camdecmpswks.unit_default_test',
})
export class UnitDefaultTest extends BaseEntity {
  @PrimaryColumn({
    type: 'varchar',
    nullable: false,
    name: 'unit_default_test_sum_id',
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
    nullable: false,
    name: 'fuel_cd',
  })
  fuelCode: string;

  @Column({
    transformer: new NumericColumnTransformer(),
    name: 'nox_default_rate',
  })
  noxDefaultRate: number;

  @Column({
    transformer: new NumericColumnTransformer(),
    name: 'calc_nox_default_rate',
  })
  calculatedNoxDefaultRate: number;

  @Column({
    type: 'varchar',
    name: 'operating_condition_cd',
  })
  operatingConditionCode: string;

  @Column({
    type: 'varchar',
    name: 'group_id',
  })
  groupID: string;

  @Column({
    transformer: new NumericColumnTransformer(),
    name: 'num_units_in_group',
  })
  numberOfUnitsInGroup: number;

  @Column({
    transformer: new NumericColumnTransformer(),
    name: 'num_tests_for_group',
  })
  numberOfTestsForGroup: number;

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
    o => o.unitDefaultTest,
  )
  @JoinColumn({ name: 'test_sum_id' })
  testSummary: TestSummary;

  @OneToMany(
    () => UnitDefaultTestRun,
    o => o.unitDefaultTest,
  )
  @JoinColumn({ name: 'unit_default_test_sum_id' })
  unitDefaultTestRuns: UnitDefaultTestRun[];
}
