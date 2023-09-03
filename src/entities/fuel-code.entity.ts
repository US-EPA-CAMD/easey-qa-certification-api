import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'camdecmpsmd.fuel_code' })
export class FuelCode extends BaseEntity {
  @PrimaryColumn({
    name: 'fuel_cd',
  })
  fuelCode: string;

  @Column({
    name: 'fuel_group_cd',
  })
  fuelGroupCode: string;

  @Column({
    name: 'unit_fuel_cd',
  })
  unitFuelCode: string;

  @Column({
    name: 'fuel_cd_description',
  })
  fuelCodeDescription: string;
}
