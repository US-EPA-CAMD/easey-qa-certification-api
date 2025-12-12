import {
  BaseEntity,
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';

import { Rata } from './rata.entity';
import { RataRun } from './rata-run.entity';

@Entity({ name: 'camdecmps.rata_summary' })
export class RataSummary extends BaseEntity {
  @PrimaryColumn({
    name: 'rata_sum_id',
  })
  id: string;

  @Column({
    name: 'rata_id',
  })
  rataId: string;

  @Column({
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
    name: 'ref_method_cd',
  })
  referenceMethodCode: string;

  @Column({
    name: 'mean_cem_value',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  meanCEMValue: number;

  @Column({
    name: 'calc_mean_cem_value',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  calculatedMeanCEMValue: number;

  @Column({
    name: 'mean_rata_ref_value',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  meanRATAReferenceValue: number;

  @Column({
    name: 'calc_mean_rata_ref_value',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  calculatedMeanRATAReferenceValue: number;

  @Column({
    name: 'mean_diff',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  meanDifference: number;

  @Column({
    name: 'calc_mean_diff',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  calculatedMeanDifference: number;

  @Column({
    name: 'stnd_dev_diff',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  standardDeviationDifference: number;

  @Column({
    name: 'calc_stnd_dev_diff',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  calculatedStandardDeviationDifference: number;

  @Column({
    name: 'confidence_coef',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  confidenceCoefficient: number;

  @Column({
    name: 'calc_confidence_coef',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  calculatedConfidenceCoefficient: number;

  @Column({
    name: 't_value',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  tValue: number;

  @Column({
    name: 'calc_t_value',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  calculatedTValue: number;

  @Column({
    name: 'aps_ind',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  apsIndicator: number;

  @Column({
    name: 'calc_aps_ind',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  calculatedApsIndicator: number;

  @Column({
    name: 'aps_cd',
  })
  apsCode: string;

  @Column({
    name: 'relative_accuracy',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  relativeAccuracy: number;

  @Column({
    name: 'calc_relative_accuracy',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  calculatedRelativeAccuracy: number;

  @Column({
    name: 'bias_adj_factor',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  biasAdjustmentFactor: number;

  @Column({
    name: 'calc_bias_adj_factor',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  calculatedBiasAdjustmentFactor: number;

  @Column({
    name: 'co2_o2_ref_method_cd',
  })
  co2OrO2ReferenceMethodCode: string;

  @Column({
    name: 'stack_diameter',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  stackDiameter: number;

  @Column({
    name: 'stack_area',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  stackArea: number;

  @Column({
    name: 'calc_stack_area',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  calculatedStackArea: number;

  @Column({
    name: 'num_traverse_point',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  numberOfTraversePoints: number;

  @Column({
    name: 'calc_waf',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  calculatedWAF: number;

  @Column({
    name: 'calc_calc_waf',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  calculatedCalculatedWAF: number;

  @Column({
    name: 'default_waf',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  defaultWAF: number;

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
    () => Rata,
    r => r.rataSummaries,
  )
  @JoinColumn({ name: 'rata_id' })
  rata: Rata;

  @OneToMany(
    () => RataRun,
    rr => rr.RataSummary,
  )
  @JoinColumn({ name: 'rata_sum_id' })
  RataRuns: RataRun[];
}
