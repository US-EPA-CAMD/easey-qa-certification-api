import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class GasTypeCode {
  @PrimaryColumn({
    name: 'gas_type_cd',
  })
  gasTypeCode: string;

  @Column({
    name: 'gas_type_cd',
  })
  gasTypeCodeDescription: string;
}
