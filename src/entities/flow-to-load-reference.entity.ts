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
    name: 'userid',
  })
  userId: string;

  @Column({
    type: 'varchar',
    name: 'op_level_cd',
  })
  operatingLevelCode: string;

  @Column({
    type: 'varchar',
    name: 'rata_test_num',
  })
  rataTestNumber: string;

  @Column({
    name: 'avg_gross_unit_load',
    transformer: new NumericColumnTransformer(),
  })
  averageGrossUnitLoad: number;

  @Column({
    name: 'avg_ref_method_flow',
    transformer: new NumericColumnTransformer(),
  })
  averageReferenceMethodFlow: number;

  @Column({
    name: 'ref_flow_load_ratio',
    transformer: new NumericColumnTransformer(),
  })
  referenceFlowToLoadRatio: number;

  @Column({
    name: 'avg_hrly_hi_rate',
    transformer: new NumericColumnTransformer(),
  })
  averageHourlyHeatInputRate: number;

  @Column({
    name: 'ref_ghr',
    transformer: new NumericColumnTransformer(),
  })
  referenceGrossHeatRate: number;

  @Column({
    name: 'calc_sep_ref_ind',
    transformer: new NumericColumnTransformer(),
  })
  calculatedSeparateReferenceIndicator: number;

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
    o => o.flowToLoadReference,
  )
  @JoinColumn({ name: 'test_sum_id' })
  testSummary: TestSummary;
}
