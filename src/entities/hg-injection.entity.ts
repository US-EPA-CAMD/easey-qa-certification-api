import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';
import { HgSummary } from './hg-summary.entity';

@Entity({
  name: 'camdecmps.hg_test_injection',
})
export class HgInjection extends BaseEntity {
  @PrimaryColumn({
    type: 'varchar',
    name: 'hg_test_inj_id',
  })
  id: string;

  @Column({
    type: 'varchar',
    name: 'hg_test_sum_id',
  })
  hgTestSumId: string;

  @Column({
    type: 'date',
    name: 'injection_date',
  })
  injectionDate: Date;

  @Column({
    transformer: new NumericColumnTransformer(),
    name: 'injection_hour',
  })
  injectionHour: number;

  @Column({
    transformer: new NumericColumnTransformer(),
    name: 'injection_min',
  })
  injectionMinute: number;

  @Column({
    transformer: new NumericColumnTransformer(),
    name: 'measured_value',
  })
  measuredValue: number;

  @Column({
    transformer: new NumericColumnTransformer(),
    name: 'ref_value',
  })
  referenceValue: number;

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
    () => HgSummary,
    o => o.HgInjection,
  )
  @JoinColumn({ name: 'hg_test_sum_id' })
  HgSummary: HgSummary;
}
