import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'camdecmpsmd.mats_status_code' })
export class MatsStatusCode extends BaseEntity {
  @PrimaryColumn({ name: 'mats_status_cd' })
  code: string;

  @Column({ name: 'mats_status_description' })
  description: string;
}
