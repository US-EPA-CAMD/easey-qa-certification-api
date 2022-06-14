import {
  BaseEntity,
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';

import { LinearitySummary } from './linearity-summary.entity';

@Entity({ name: 'camdecmpswks.linearity_injection' })
export class LinearityInjection extends BaseEntity {
  @PrimaryColumn({
    name: 'lin_inj_id',
  })
  id: string;

  @Column({
    name: 'lin_sum_id',
  })
  linSumId: string;

  @Column({
    type: 'date',
    name: 'injection_date',
  })
  injectionDate: Date;

  @Column({
    name: 'injection_hour',
    transformer: new NumericColumnTransformer()
  })
  injectionHour: number;

  @Column({
    name: 'injection_min',
    transformer: new NumericColumnTransformer()
  })
  injectionMinute: number;

  @Column({
    name: 'measured_value',
    transformer: new NumericColumnTransformer()
  })
  measuredValue: number;

  @Column({
    name: 'ref_value',
    transformer: new NumericColumnTransformer()
  })
  referenceValue: number;

  @Column({ name: 'userid' })
  userId: string;

  @Column({
    name: 'add_date'
  })
  addDate: Date;

  @Column({
    name: 'update_date'
  })
  updateDate: Date;

  @ManyToOne(
    () => LinearitySummary,
    ls => ls.injections,
  )
  @JoinColumn({ name: 'lin_sum_id' })
  linearitySummary: LinearitySummary;
}