import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'camdecmpsmd.units_of_measure_code' })
export class UnitsOfMeasureCode extends BaseEntity {
  @PrimaryColumn({
    name: 'uom_cd',
  })
  unitsOfMeasureCode: string;

  @Column({
    name: 'uom_cd_description',
  })
  unitsOfMeasureCodeDescription: string;
}
