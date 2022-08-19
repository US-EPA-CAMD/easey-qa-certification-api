import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { RataSummary } from './rata-summary.entity';

@Entity({ name: 'camdecmpsmd.aps_code' })
export class ApsCode extends BaseEntity {
  @PrimaryColumn({ type: 'varchar', name: 'aps_cd' })
  apsCode: string;

  @Column({ type: 'varchar', name: 'aps_description' })
  apsCodeDescription: string;

  @OneToMany(
    () => RataSummary,
    o => o.ApsCode,
  )
  @JoinColumn({ name: 'aps_cd' })
  RataSummary: RataSummary[];
}
