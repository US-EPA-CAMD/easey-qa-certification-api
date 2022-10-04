import {
  Entity,
  BaseEntity, PrimaryColumn, Column,
} from 'typeorm';
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';

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
  aeCorrTestRunId: string;

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
  oilGcvUomCode: string;

  @Column({
    name: 'oil_volume',
    transformer: new NumericColumnTransformer(),
  })
  oilVolume: number;

  @Column({
    name: 'oil_volume_uom_cd',
  })
  oilVolumeUomCode: string;

  @Column({
    name: 'oil_density',
    transformer: new NumericColumnTransformer(),
  })
  oilDensity: number;

  @Column({
    name: 'oil_density_uom_cd',
  })
  oilDensityUomCode: string;

  @Column({
    name: 'mon_sys_id',
  })
  monitoringSystemId: string;

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
}
