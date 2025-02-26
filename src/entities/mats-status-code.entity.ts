import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';

@Entity({ name: 'camdecmpsmd.mats_status_code' })
export class MatsStatusCode extends BaseEntity {
  @PrimaryColumn({ name: 'mats_status_cd' })
  matsStatusCode: string;

  @Column({ name: 'mats_status_description' })
  matsStatusDescription: string;
}
