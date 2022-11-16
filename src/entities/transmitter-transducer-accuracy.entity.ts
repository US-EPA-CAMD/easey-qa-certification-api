import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { TestSummary } from './test-summary.entity';
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';

@Entity({
  name: 'camdecmps.trans_accuracy',
})
export class TransmitterTransducerAccuracy extends BaseEntity {
  @PrimaryColumn({
    type: 'varchar',
    name: 'trans_ac_id',
  })
  id: string;

  @Column({
    type: 'varchar',
    nullable: false,
    name: 'test_sum_id',
  })
  testSumId: string;

  @Column({
    transformer: new NumericColumnTransformer(),
    name: 'low_level_accuracy',
  })
  lowLevelAccuracy: number;

  @Column({
    type: 'varchar',
    name: 'low_level_accuracy_spec_cd',
  })
  lowLevelAccuracySpecCode: string;

  @Column({
    transformer: new NumericColumnTransformer(),
    name: 'mid_level_accuracy',
  })
  midLevelAccuracy: number;

  @Column({
    type: 'varchar',
    name: 'mid_level_accuracy_spec_cd',
  })
  midLevelAccuracySpecCode: string;

  @Column({
    transformer: new NumericColumnTransformer(),
    name: 'high_level_accuracy',
  })
  highLevelAccuracy: number;

  @Column({
    type: 'varchar',
    name: 'high_level_accuracy_spec_cd',
  })
  highLevelAccuracySpecCode: string;

  @Column({
    type: 'time without time zone',
    name: 'add_date',
  })
  addDate: string;

  @Column({
    type: 'time without time zone',
    name: 'update_date',
  })
  updateDate: string;

  @Column({
    type: 'varchar',
    name: 'userid',
  })
  userId: string;

  @ManyToOne(
    () => TestSummary,
    testSum => testSum.transmitterTransducerAccuracies,
  )
  @JoinColumn({ name: 'test_sum_id' })
  testSummary: TestSummary;
}
