import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { RataSummary } from './rata-summary.entity';

@Entity({ name: 'camdecmpsmd.ref_method_code' })
export class ReferenceMethodCode extends BaseEntity {
  @PrimaryColumn({
    type: 'varchar',
    length: 7,
    name: 'ref_method_cd',
  })
  referenceMethodCode: string;

  @Column({
    type: 'varchar',
    length: 1000,
    nullable: false,
    name: 'ref_method_cd_description',
  })
  referenceMethodCodeDescription: string;

  @PrimaryColumn({
    type: 'varchar',
    length: 9,
    name: 'parameter_cd',
  })
  parameterCode: string;

  @OneToMany(
    () => RataSummary,
    rs => rs.ReferenceMethodCode,
  )
  @OneToMany(
    () => RataSummary,
    rs => rs.Co2OrO2ReferenceMethodCode,
  )
  @JoinColumn({ name: 'ref_method_cd' })
  RataSummary: RataSummary[];
}
