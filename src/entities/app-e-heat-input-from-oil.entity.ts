import {
  Entity,
  BaseEntity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';
import { AppECorrelationTestRun } from './app-e-correlation-test-run.entity';
import { MonitorSystem } from './monitor-system.entity';

@Entity({
  name: 'camdecmps.ae_hi_oil',
})
export class AppEHeatInputFromOil extends BaseEntity {
  @PrimaryColumn({
    type: 'varchar',
    name: 'ae_hi_oil_id',
  })
  id: string;

  @Column({
    type: 'varchar',
    nullable: false,
    name: 'ae_corr_test_run_id',
  })
  appECorrTestRunId: string;

  @Column({
    name: 'mon_sys_id',
  })
  monitoringSystemId: string;

  @Column({
    name: 'oil_mass',
    transformer: new NumericColumnTransformer(),
  })
  oilMass: number;

  @Column({
    name: 'calc_oil_mass',
    transformer: new NumericColumnTransformer(),
  })
  calculatedOilMass: number;

  @Column({
    name: 'oil_hi',
    transformer: new NumericColumnTransformer(),
  })
  oilHeatInput: number;

  @Column({
    name: 'calc_oil_hi',
    transformer: new NumericColumnTransformer(),
  })
  calculatedOilHeatInput: number;

  @Column({
    name: 'oil_gcv',
    transformer: new NumericColumnTransformer(),
  })
  oilGCV: number;

  @Column({
    name: 'oil_gcv_uom_cd',
  })
  oilGCVUnitsOfMeasureCode: string;

  @Column({
    name: 'oil_volume',
    transformer: new NumericColumnTransformer(),
  })
  oilVolume: number;

  @Column({
    name: 'oil_volume_uom_cd',
  })
  oilVolumeUnitsOfMeasureCode: string;

  @Column({
    name: 'oil_density',
    transformer: new NumericColumnTransformer(),
  })
  oilDensity: number;

  @Column({
    name: 'oil_density_uom_cd',
  })
  oilDensityUnitsOfMeasureCode: string;

  @Column({
    type: 'timestamp',
    name: 'add_date',
  })
  addDate: string;

  @Column({
    type: 'timestamp',
    name: 'update_date',
  })
  updateDate: string;

  @Column({
    type: 'varchar',
    name: 'userid',
  })
  userId: string;

  @ManyToOne(
    () => AppECorrelationTestRun,
    aectr => aectr.appEHeatInputFromOils,
  )
  @JoinColumn({ name: 'ae_corr_test_run_id' })
  appECorrelationTestRun: AppECorrelationTestRun;

  @ManyToOne(
    () => MonitorSystem,
    ms => ms.appEHeatInputFromOils,
  )
  @JoinColumn({ name: 'mon_sys_id' })
  system: MonitorSystem;
}
