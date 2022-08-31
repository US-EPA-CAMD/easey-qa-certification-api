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
    name: 'test_qualification_id',
  })
  id: string;

  @Column({
    name: 'test_sum_id',
  })
  testSumId: string;

  @Column({
    name: 'test_claim_cd',
  })
  testClaimCode: string;

  @Column({
    name: 'hi_load_pct',
    transformer: new NumericColumnTransformer(),
  })
  highLoadPercentage: number;

  @Column({
    name: 'mid_load_pct',
    transformer: new NumericColumnTransformer(),
  })
  midLoadPercentage: number;

  @Column({
    name: 'low_load_pct',
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

  @Column({ name: 'userid' })
  userId: string;

  @Column({
    name: 'add_date',
  })
  addDate: Date;

  @Column({
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
