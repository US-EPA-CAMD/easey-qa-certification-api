import {
  BaseEntity,
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';

import { Rata } from './rata.entity';

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
  })
  averageGrossUnitLoad: number;

  @Column({
    name: 'calc_avg_gross_unit_load',
    transformer: new NumericColumnTransformer(),
  })
  calculatedAverageGrossUnitLoad: number;

  @Column({
    name: 'ref_method_cd',
  })
  referenceMethodCode: string;

  @Column({
    name: 'mean_cem_value',
    transformer: new NumericColumnTransformer(),
  })
  meanCEMValue: number;

  @Column({
    name: 'calc_mean_cem_value',
    transformer: new NumericColumnTransformer(),
  })
  calculatedMeanCEMValue: number;

  @Column({
    name: 'mean_rata_ref_value',
    transformer: new NumericColumnTransformer(),
  })
  meanRATAReferenceValue: number;

  @Column({
    name: 'calc_mean_rata_ref_value',
    transformer: new NumericColumnTransformer(),
  })
  calculatedMeanRATAReferenceValue: number;

  @Column({
    name: 'mean_diff',
    transformer: new NumericColumnTransformer(),
  })
  meanDifference: number;

  @Column({
    name: 'calc_mean_diff',
    transformer: new NumericColumnTransformer(),
  })
  calculatedMeanDifference: number;

  @Column({
    name: 'stnd_dev_diff',
    transformer: new NumericColumnTransformer(),
  })
  standardDeviationDifference: number;

  @Column({
    name: 'calc_stnd_dev_diff',
    transformer: new NumericColumnTransformer(),
  })
  calculatedStandardDeviationDifference: number;

  @Column({
    name: 'confidence_coef',
    transformer: new NumericColumnTransformer(),
  })
  confidenceCoefficient: number;

  @Column({
    name: 'calc_confidence_coef',
    transformer: new NumericColumnTransformer(),
  })
  calculatedConfidenceCoefficient: number;

  @Column({
    name: 't_value',
    transformer: new NumericColumnTransformer(),
  })
  tValue: number;

  @Column({
    name: 'calc_t_value',
    transformer: new NumericColumnTransformer(),
  })
  calculatedTValue: number;

  @Column({
    name: 'aps_ind',
    transformer: new NumericColumnTransformer(),
  })
  apsIndicator: number;

  @Column({
    name: 'calc_aps_ind',
    transformer: new NumericColumnTransformer(),
  })
  calculatedApsIndicator: number;

  @Column({
    name: 'aps_cd',
  })
  apsCode: string;

  @Column({
    name: 'relative_accuracy',
    transformer: new NumericColumnTransformer(),
  })
  relativeAccuracy: number;

  @Column({
    name: 'calc_relative_accuracy',
    transformer: new NumericColumnTransformer(),
  })
  calculatedRelativeAccuracy: number;

  @Column({
    name: 'bias_adj_factor',
    transformer: new NumericColumnTransformer(),
  })
  biasAdjustmentFactor: number;

  @Column({
    name: 'calc_bias_adj_factor',
    transformer: new NumericColumnTransformer(),
  })
  calculatedBiasAdjustmentFactor: number;

  @Column({
    name: 'co2_o2_ref_method_cd',
  })
  co2OrO2ReferenceMethodCode: string;

  @Column({
    name: 'stack_diameter',
    transformer: new NumericColumnTransformer(),
  })
  stackDiameter: number;

  @Column({
    name: 'stack_area',
    transformer: new NumericColumnTransformer(),
  })
  stackArea: number;

  @Column({
    name: 'calc_stack_area',
    transformer: new NumericColumnTransformer(),
  })
  calculatedStackArea: number;

  @Column({
    name: 'num_traverse_point',
    transformer: new NumericColumnTransformer(),
  })
  numberOfTraversePoints: number;

  @Column({
    name: 'calc_waf',
    transformer: new NumericColumnTransformer(),
  })
  calculatedWAF: number;

  @Column({
    name: 'calc_calc_waf',
    transformer: new NumericColumnTransformer(),
  })
  calculatedCalculatedWAF: number;

  @Column({
    name: 'default_waf',
    transformer: new NumericColumnTransformer(),
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

  // rataRun: RataRun[]
}
