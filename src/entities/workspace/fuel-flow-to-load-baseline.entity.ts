import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

import { TestSummary } from './test-summary.entity';

@Entity({ name: 'camdecmpswks.fuel_flow_to_load_baseline' })
export class FuelFlowToLoadBaseline extends BaseEntity {
  @PrimaryColumn({
    name: 'fuel_flow_baseline_id',
  })
  id: string;

  @Column({
    name: 'test_sum_id',
  })
  testSumId: string;

  @Column({
    name: 'accuracy_test_number',
  })
  accuracyTestNumber: string;

  @Column({
    name: 'pei_test_number',
  })
  peiTestNumber: string;

  @Column({
    name: 'avg_fuel_flow_rate',
    transformer: new NumericColumnTransformer(),
  })
  averageFuelFlowRate: number;

  @Column({
    name: 'avg_load',
    transformer: new NumericColumnTransformer(),
  })
  averageLoad: number;

  @Column({
    name: 'baseline_fuel_flow_load_ratio',
    transformer: new NumericColumnTransformer(),
  })
  baselineFuelFlowToLoadRatio: number;

  @Column({
    name: 'fuel_flow_load_uom_cd',
  })
  fuelFlowToLoadUOMCode: string;

  @Column({
    name: 'avg_hrly_hi_rate',
    transformer: new NumericColumnTransformer(),
  })
  averageHourlyHeatInputRate: number;

  @Column({
    name: 'baseline_ghr',
    transformer: new NumericColumnTransformer(),
  })
  baselineGHR: number;

  @Column({
    name: 'ghr_uom_cd',
  })
  ghrUnitsOfMeasureCode: string;

  @Column({
    name: 'nhe_cofiring',
    transformer: new NumericColumnTransformer(),
  })
  numberOfHoursExcludedCofiring: number;

  @Column({
    name: 'nhe_ramping',
    transformer: new NumericColumnTransformer(),
  })
  numberOfHoursExcludedRamping: number;

  @Column({
    name: 'nhe_low_range',
    transformer: new NumericColumnTransformer(),
  })
  numberOfHoursExcludedLowRange: number;

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
    () => TestSummary,
    ts => ts.fuelFlowToLoadBaseline,
  )
  @JoinColumn({ name: 'test_sum_id' })
  testSummary: TestSummary;
}
