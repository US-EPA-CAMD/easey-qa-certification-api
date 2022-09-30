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

  @Entity({ name: 'camdecmps.ae_correlation_test_sum' })

export class AeCorrelationSummaryTest extends BaseEntity {
  @PrimaryColumn({ 
    type: 'varchar',
    name: 'ae_corr_test_sum_id' 
  })
  id: string;


  @Column({ 
    type: 'varchar',
    name: 'test_sum_id' 
  })
  testSumId: string;

  
  @Column({
    type: 'varchar',
    name: 'userid',
  })
  userId: string;

  @Column({
    name: 'op_level_num',
    nullable: false,
    transformer: new NumericColumnTransformer(),
  })
  operatingLevelForRun: number;

  @Column({
    name: 'mean_ref_value',
    transformer: new NumericColumnTransformer(),
  })
  meanReferenceValue: number;

  @Column({
    name: 'calc_mean_ref_value',
    transformer: new NumericColumnTransformer(),
  })
  calculatedMeanReferenceValue: number;

  @Column({
    name: 'avg_hrly_hi_rate',
    transformer: new NumericColumnTransformer(),
  })
  averageHourlyHeatInputRate: number;

  @Column({
    name: 'calc_avg_hrly_hi_rate',
    transformer: new NumericColumnTransformer(),
  })
  calculatedAverageHourlyHeatInputRate: number;

  @Column({
    name: 'f_factor',
    transformer: new NumericColumnTransformer(),
  })
  fFactor: number;

  @Column({
    type: 'time without time zone',
    name: 'add_date',
  })
  addDate: Date;

  @Column({
    type: 'time without time zone',
    name: 'update_date',
  })
  updateDate: Date;

  @ManyToOne(
    () => TestSummary,
    o => o.appECorrelationTests,
  )
  @JoinColumn({ name: 'test_sum_id' })
  testSummary: TestSummary;
}