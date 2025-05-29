import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'camdecmpsmd.mats_data_file_type_code' })
export class MatsFileTypeCode extends BaseEntity {
  @PrimaryColumn({ name: 'mats_data_file_type_cd' })
  code: string;

  @Column({ name: 'mats_data_file_type_description' })
  description: string;
}
