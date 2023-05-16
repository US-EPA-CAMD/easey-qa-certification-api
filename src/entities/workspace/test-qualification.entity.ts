import {
  BaseEntity,
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';

import { TestClaimCode } from './test-claim-code.entity';
import { TestSummary } from './test-summary.entity';

@Entity({ name: 'camdecmpswks.test_qualification' })
export class TestQualification extends BaseEntity {
  @PrimaryColumn({
    type: 'varchar',
    name: 'test_qualification_id',
  })
  id: string;

  @Column({
    type: 'varchar',
    name: 'test_sum_id',
  })
  testSumId: string;

  @Column({
    type: 'varchar',
    name: 'test_claim_cd',
  })
  testClaimCode: string;

  @Column({
    type: 'numeric',
    name: 'hi_load_pct',
    transformer: new NumericColumnTransformer(),
  })
  highLoadPercentage: number;

  @Column({
    name: 'mid_load_pct',
    type: 'numeric',
    transformer: new NumericColumnTransformer(),
  })
  midLoadPercentage: number;

  @Column({
    name: 'low_load_pct',
    type: 'numeric',
    transformer: new NumericColumnTransformer(),
  })
  lowLoadPercentage: number;

  @Column({
    type: 'date',
    name: 'begin_date',
  })
  beginDate: Date;

  @Column({
    type: 'date',
    name: 'end_date',
  })
  endDate: Date;

  @Column({
    type: 'varchar',
    name: 'userid',
  })
  userId: string;

  @Column({
    type: 'timestamp',
    name: 'add_date',
  })
  addDate: Date;

  @Column({
    type: 'timestamp',
    name: 'update_date',
  })
  updateDate: Date;

  @ManyToOne(
    () => TestSummary,
    o => o.testQualifications,
  )
  @JoinColumn({ name: 'test_sum_id' })
  testSummary: TestSummary;

  @ManyToOne(
    () => TestClaimCode,
    tcc => tcc.TestQualifications,
  )
  @JoinColumn({ name: 'test_claim_cd' })
  TestClaimCode: TestClaimCode;
}
