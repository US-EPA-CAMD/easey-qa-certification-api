import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'camdecmpsmd.pressure_measure_code' })
export class PressureMeasureCode extends BaseEntity {
  @PrimaryColumn({
    type: 'varchar',
    name: 'pressure_meas_cd',
  })
  pressureMeasureCode: string;

  @Column({
    type: 'varchar',
    name: 'pressure_meas_cd_description',
  })
  pressureMeasureCodeDescription: string;
}
