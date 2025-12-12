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

@Entity({ name: 'camdecmps.flow_to_load_reference' })
export class FlowToLoadReference extends BaseEntity {
  @PrimaryColumn({
    type: 'varchar',
    name: 'flow_load_ref_id',
  })
  id: string;

  @Column({
    type: 'varchar',
    name: 'test_sum_id',
  })
  testSumId: string;

  @Column({
    type: 'varchar',
    name: 'rata_test_num',
  })
  rataTestNumber: string;

  @Column({
    type: 'varchar',
    name: 'op_level_cd',
  })
  operatingLevelCode: string;

  @Column({
    name: 'avg_gross_unit_load',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  averageGrossUnitLoad: number;

  @Column({
    name: 'calc_avg_gross_unit_load',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  calculatedAverageGrossUnitLoad: number;

  @Column({
    name: 'avg_ref_method_flow',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  averageReferenceMethodFlow: number;

  @Column({
    name: 'calc_avg_ref_method_flow',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  calculatedAverageReferenceMethodFlow: number;

  @Column({
    name: 'ref_flow_load_ratio',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  referenceFlowLoadRatio: number;

  @Column({
    name: 'calc_ref_flow_load_ratio',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  calculatedReferenceFlowToLoadRatio: number;

  @Column({
    name: 'avg_hrly_hi_rate',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  averageHourlyHeatInputRate: number;

  @Column({
    name: 'ref_ghr',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  referenceGrossHeatRate: number;

  @Column({
    name: 'calc_ref_ghr',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  calculatedReferenceGrossHeatRate: number;

  @Column({
    name: 'calc_sep_ref_ind',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  calculatedSeparateReferenceIndicator: number;

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
    ts => ts.flowToLoadReference,
  )
  @JoinColumn({ name: 'test_sum_id' })
  testSummary: TestSummary;
}
