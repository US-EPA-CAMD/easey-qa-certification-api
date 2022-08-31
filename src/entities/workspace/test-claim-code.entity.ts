import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { TestQualification } from './test-qualification.entity';

@Entity({ name: 'camdecmpsmd.test_claim_code' })
export class TestClaimCode extends BaseEntity {
  @PrimaryColumn({
    name: 'test_claim_cd',
  })
  testClaimCode: string;

  @Column({
    name: 'test_claim_cd_description',
  })
  testClaimCodeDescription: string;

  @OneToMany(
    () => TestQualification,
    o => o.TestClaimCode,
  )
  @JoinColumn({ name: 'test_claim_cd' })
  TestQualifications: TestQualification[];
}
