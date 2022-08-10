import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { Rata } from '../rata.entity';

@Entity({ name: 'camdecmpsmd.rata_frequency_code' })
export class RataFrequencyCode extends BaseEntity {
  @PrimaryColumn({ type: 'varchar', name: 'rata_frequency_cd' })
  rataFrequencyCode: string;

  @Column({ type: 'varchar', name: 'rata_frequency_cd_description' })
  rataFrequencyCodeDescription: string;

  @OneToMany(
    () => Rata,
    o => o.rataFrequencyCode,
  )
  @JoinColumn({ name: 'rata_frequency_cd' })
  rata: Rata[];
}
