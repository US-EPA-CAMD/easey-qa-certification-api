import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'camdecmpsmd.system_type_code' })
export class SystemTypeCode extends BaseEntity {
  @PrimaryColumn({
    name: 'sys_type_cd',
  })
  systemTypeCode: string;

  @Column({
    name: 'sys_type_description',
  })
  systemTypeDescription: string;
}
