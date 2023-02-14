import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'camdecmpsmd.gas_type_code' })
export class GasTypeCode {
  @PrimaryColumn({
    name: 'gas_type_cd',
  })
  gasTypeCode: string;

  @Column({
    name: 'gas_type_description',
  })
  gasTypeCodeDescription: string;
}
