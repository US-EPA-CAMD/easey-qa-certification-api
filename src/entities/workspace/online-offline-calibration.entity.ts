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
    name: 'online_zero_cal_error'
  })
  onlineZeroCalibrationError: number;

  @Column({
    transformer: new NumericColumnTransformer(),
    name: 'calc_online_zero_cal_error'
  })
  calculatedOnlineZeroCalibrationError: number;

  @Column({
    transformer: new NumericColumnTransformer(),
    name: 'online_zero_measured_value'
  })
  onlineZeroMeasuredValue: number;

  @Column({
    transformer: new NumericColumnTransformer(),
    name: 'online_zero_ref_value'
  })
  onlineZeroReferenceValue: number;

  @Column({
    transformer: new NumericColumnTransformer(),
    name: 'online_upscale_cal_error'
  })
  onlineUpscaleCalibrationError: number;

  @Column({
    transformer: new NumericColumnTransformer(),
    name: 'calc_online_upscale_cal_error'
  })
  calculatedOnlineUpscaleCalibrationError: number;

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
    name: 'online_upscale_measured_value'
  })
  onlineUpscaleMeasuredValue: number;

  @Column({
    transformer: new NumericColumnTransformer(),
    name: 'online_upscale_ref_value'
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
    name: 'offline_zero_cal_error'
  })
  offlineZeroCalibrationError: number;

  @Column({
    transformer: new NumericColumnTransformer(),
    name: 'calc_offline_zero_cal_error'
  })
  calculatedOfflineZeroCalibrationError: number;

  @Column({
    transformer: new NumericColumnTransformer(),
    name: 'offline_zero_measured_value'
  })
  offlineZeroMeasuredValue: number;

  @Column({
    transformer: new NumericColumnTransformer(),
    name: 'offline_zero_ref_value'
  })
  offlineZeroReferenceValue: number;

  @Column({
    transformer: new NumericColumnTransformer(),
    name: 'offline_upscale_cal_error'
  })
  offlineUpscaleCalibrationError: number;

  @Column({
    transformer: new NumericColumnTransformer(),
    name: 'calc_offline_upscale_cal_error'
  })
  calculatedOfflineUpscaleCalibrationError: number;

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
    name: 'offline_upscale_measured_value'
  })
  offlineUpscaleMeasuredValue: number;

  @Column({
    transformer: new NumericColumnTransformer(),
    name: 'offline_upscale_ref_value'
  })
  offlineUpscaleReferenceValue: number;

  @Column({
    type: 'time without time zone',
    name: 'add_date',
  })
  addDate: string;

  @Column({
    type: 'time without time zone',
    name: 'update_date',
  })
  updateDate: string;

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
