import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'camdecmpsmd.mats_averaging_group_code' })
export class MatsAveragingGroupCode extends BaseEntity {
  @PrimaryColumn({ name: 'mats_avg_group_cd' })
  code: string;

  @Column({ name: 'mats_avg_group_description' })
  description: string;
}
