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

@Entity({
  name: 'camdecmpswks.calibration_injection',
})
export class CalibrationInjection extends BaseEntity {
  @PrimaryColumn({
    type: 'varchar',
    name: 'cal_inj_id',
  })
  id: string;

  @Column({
    type: 'varchar',
    nullable: false,
    name: 'test_sum_id',
  })
  testSumId: string;

  @Column({
    name: 'online_offline_ind',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  onlineOfflineIndicator: number;

  @Column({
    name: 'zero_ref_value',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  zeroReferenceValue: number;

  @Column({
    name: 'zero_cal_error',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  zeroCalibrationError: number;

  @Column({
    name: 'calc_zero_cal_error',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  calculatedZeroCalibrationError: number;

  @Column({
    name: 'zero_aps_ind',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  zeroAPSIndicator: number;

  @Column({
    name: 'calc_zero_aps_ind',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  calculatedZeroAPSIndicator: number;

  @Column({
    name: 'zero_injection_date',
    type: 'date',
  })
  zeroInjectionDate: Date;

  @Column({
    name: 'zero_injection_hour',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  zeroInjectionHour: number;

  @Column({
    name: 'zero_injection_min',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  zeroInjectionMinute: number;

  @Column({
    name: 'upscale_ref_value',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  upscaleReferenceValue: number;

  @Column({
    name: 'zero_measured_value',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  zeroMeasuredValue: number;

  @Column({
    type: 'varchar',
    name: 'upscale_gas_level_cd',
  })
  upscaleGasLevelCode: string;

  @Column({
    name: 'upscale_measured_value',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  upscaleMeasuredValue: number;

  @Column({
    name: 'upscale_cal_error',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  upscaleCalibrationError: number;

  @Column({
    name: 'calc_upscale_cal_error',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  calculatedUpscaleCalibrationError: number;

  @Column({
    name: 'upscale_aps_ind',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  upscaleAPSIndicator: number;

  @Column({
    name: 'calc_upscale_aps_ind',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  calculatedUpscaleAPSIndicator: number;

  @Column({
    name: 'upscale_injection_date',
    type: 'date',
  })
  upscaleInjectionDate: Date;

  @Column({
    name: 'upscale_injection_hour',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  upscaleInjectionHour: number;

  @Column({
    name: 'upscale_injection_min',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  upscaleInjectionMinute: number;

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
    o => o.calibrationInjections,
  )
  @JoinColumn({ name: 'test_sum_id' })
  testSummary: TestSummary;
}
