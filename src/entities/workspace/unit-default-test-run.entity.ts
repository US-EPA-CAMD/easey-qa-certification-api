import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';
import { UnitDefaultTest } from './unit-default-test.entity';

@Entity({
  name: 'camdecmpswks.unit_default_test_run',
})
export class UnitDefaultTestRun extends BaseEntity {
  @PrimaryColumn({
    type: 'varchar',
    nullable: false,
    name: 'unit_default_test_run_id',
  })
  id: string;

  @Column({
    type: 'varchar',
    nullable: false,
    name: 'unit_default_test_sum_id',
  })
  unitDefaultTestSumId: string;

  @Column({
    name: 'op_level_num',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  operatingLevelForRun: number;

  @Column({
    name: 'run_num',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  runNumber: number;

  @Column({
    type: 'date',
    name: 'begin_date',
  })
  beginDate: Date;

  @Column({
    name: 'begin_hour',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  beginHour: number;

  @Column({
    name: 'begin_min',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
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
    type: 'numeric',
  })
  endHour: number;

  @Column({
    name: 'end_min',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  endMinute: number;

  @Column({
    name: 'response_time',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  responseTime: number;

  @Column({
    name: 'ref_value',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  referenceValue: number;

  @Column({
    name: 'run_used_ind',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  runUsedIndicator: number;

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
    () => UnitDefaultTest,
    o => o.unitDefaultTestRuns,
  )
  @JoinColumn({ name: 'unit_default_test_sum_id' })
  unitDefaultTest: UnitDefaultTest;
}
