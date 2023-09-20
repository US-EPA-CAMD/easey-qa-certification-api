import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'camdecmpsmd.probe_type_code' })
export class ProbeTypeCode extends BaseEntity {
  @PrimaryColumn({
    name: 'probe_type_cd',
  })
  probeTypeCode: string;

  @Column({
    name: 'probe_type_cd_description',
  })
  probeTypeCodeDescription: string;
}
