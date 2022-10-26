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
  name: 'camdecmpswks.on_off_cal',
})
export class OnlineOfflineCalibration extends BaseEntity {
  @PrimaryColumn({
    type: 'varchar',
    name: 'on_off_cal_id',
  })
  id: string;

  @Column({
    type: 'varchar',
    nullable: false,
    name: 'test_sum_id',
  })
  testSumId: string;

  @Column({
    type: 'varchar',
    name: 'upscale_gas_level_cd',
  })
  upscaleGasLevelCode: string;

  @Column({
    type: 'date',
    name: 'online_zero_injection_date',
  })
  onlineZeroInjectionDate: Date;

  @Column({
    transformer: new NumericColumnTransformer(),
    name: 'online_zero_injection_hour',
  })
  onlineZeroInjectionHour: number;

  @Column({
    transformer: new NumericColumnTransformer(),
    name: 'online_zero_cal_error',
  })
  onlineZeroCalibrationError: number;

  @Column({
    transformer: new NumericColumnTransformer(),
    name: 'online_zero_aps_ind',
  })
  onlineZeroAPSIndicator: number;

  @Column({
    transformer: new NumericColumnTransformer(),
    name: 'online_zero_measured_value',
  })
  onlineZeroMeasuredValue: number;

  @Column({
    transformer: new NumericColumnTransformer(),
    name: 'online_zero_ref_value',
  })
  onlineZeroReferenceValue: number;

  @Column({
    transformer: new NumericColumnTransformer(),
    name: 'online_upscale_cal_error',
  })
  onlineUpscaleCalibrationError: number;

  @Column({
    transformer: new NumericColumnTransformer(),
    name: 'online_upscale_aps_ind',
  })
  onlineUpscaleAPSIndicator: number;

  @Column({
    type: 'date',
    name: 'online_upscale_injection_date',
  })
  onlineUpscaleInjectionDate: Date;

  @Column({
    transformer: new NumericColumnTransformer(),
    name: 'online_upscale_injection_hour',
  })
  onlineUpscaleInjectionHour: number;

  @Column({
    transformer: new NumericColumnTransformer(),
    name: 'online_upscale_measured_value',
  })
  onlineUpscaleMeasuredValue: number;

  @Column({
    transformer: new NumericColumnTransformer(),
    name: 'online_upscale_ref_value',
  })
  onlineUpscaleReferenceValue: number;

  @Column({
    type: 'date',
    name: 'offline_zero_injection_date',
  })
  offlineZeroInjectionDate: Date;

  @Column({
    transformer: new NumericColumnTransformer(),
    name: 'offline_zero_injection_hour',
  })
  offlineZeroInjectionHour: number;

  @Column({
    transformer: new NumericColumnTransformer(),
    name: 'offline_zero_cal_error',
  })
  offlineZeroCalibrationError: number;

  @Column({
    transformer: new NumericColumnTransformer(),
    name: 'offline_zero_aps_ind',
  })
  offlineZeroAPSIndicator: number;

  @Column({
    transformer: new NumericColumnTransformer(),
    name: 'offline_zero_measured_value',
  })
  offlineZeroMeasuredValue: number;

  @Column({
    transformer: new NumericColumnTransformer(),
    name: 'offline_zero_ref_value',
  })
  offlineZeroReferenceValue: number;

  @Column({
    transformer: new NumericColumnTransformer(),
    name: 'offline_upscale_cal_error',
  })
  offlineUpscaleCalibrationError: number;

  @Column({
    transformer: new NumericColumnTransformer(),
    name: 'offline_upscale_aps_ind',
  })
  offlineUpscaleAPSIndicator: number;

  @Column({
    type: 'date',
    name: 'offline_upscale_injection_date',
  })
  offlineUpscaleInjectionDate: Date;

  @Column({
    transformer: new NumericColumnTransformer(),
    name: 'offline_upscale_injection_hour',
  })
  offlineUpscaleInjectionHour: number;

  @Column({
    transformer: new NumericColumnTransformer(),
    name: 'offline_upscale_measured_value',
  })
  offlineUpscaleMeasuredValue: number;

  @Column({
    transformer: new NumericColumnTransformer(),
    name: 'offline_upscale_ref_value',
  })
  offlineUpscaleReferenceValue: number;

  @Column({
    name: 'add_date',
  })
  addDate: Date;

  @Column({
    name: 'update_date',
  })
  updateDate: Date;

  @Column({
    type: 'varchar',
    name: 'userid',
  })
  userId: string;

  @ManyToOne(
    () => TestSummary,
    o => o.onlineOfflineCalibrations,
  )
  @JoinColumn({ name: 'test_sum_id' })
  testSummary: TestSummary;
}
