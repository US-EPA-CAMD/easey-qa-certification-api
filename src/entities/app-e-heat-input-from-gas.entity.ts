import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';
import { AppECorrelationTestRun } from './app-e-correlation-test-run.entity';

@Entity({ name: 'camdecmps.ae_hi_gas' })
export class AppEHeatInputFromGas extends BaseEntity {
  @PrimaryColumn({
    type: 'varchar',
    name: 'ae_hi_gas_id',
  })
  id: string;

  @Column({
    type: 'varchar',
    name: 'ae_corr_test_run_id',
  })
  appECorrTestRunId: string;

  @Column({
    type: 'numeric',
    name: 'gas_volume',
    transformer: new NumericColumnTransformer(),
  })
  gasVolume: number;

  @Column({
    type: 'numeric',
    name: 'gas_gcv',
    transformer: new NumericColumnTransformer(),
  })
  gasGCV: number;

  @Column({
    type: 'numeric',
    name: 'gas_hi',
    transformer: new NumericColumnTransformer(),
  })
  gasHeatInput: number;

  @Column({
    type: 'numeric',
    name: 'calc_gas_hi',
    transformer: new NumericColumnTransformer(),
  })
  calculatedGasHeatInput: number;

  @Column({
    type: 'varchar',
    name: 'mon_sys_id',
  })
  monitoringSystemID: string;

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
    () => AppECorrelationTestRun,
    aectr => aectr.appEHeatInputFromGases,
  )
  @JoinColumn({ name: 'ae_corr_test_run_id' })
  appECorrelationTestRun: AppECorrelationTestRun;
}
