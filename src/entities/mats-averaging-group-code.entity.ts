import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';

@Entity({ name: 'camdecmpsmd.mats_averaging_group_code' })
export class MatsAveragingGroupCode extends BaseEntity {
  @PrimaryColumn({ name: 'mats_avg_group_cd' })
  matsAveragingGroupCode: string;

  @Column({ name: 'mats_avg_group_description' })
  matsAveragingGroupDescription: string;
}
