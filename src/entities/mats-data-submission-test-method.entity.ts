import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { MatsDataSubmission } from './mats-data-submission.entity';
import { MatsTestMethodCode } from './mats-test-method-code.entity';

@Entity({ name: 'camdecmpsaux.mats_data_submission_test_method' })
export class MatsDataSubmissionTestMethod extends BaseEntity {
  @PrimaryGeneratedColumn('increment', {
    name: 'mats_data_sub_test_method_id',
    type: 'bigint',
  })
  id: string; // TypeORM returns BIGINT as string because its value can exceed Number.MAX_SAFE_INTEGER

  @Column({ name: 'mats_data_sub_id' })
  submissionId: string;

  @Column({ name: 'mats_test_meth_cd' })
  testMethodCode: string;

  @ManyToOne(() => MatsDataSubmission)
  @JoinColumn({ name: 'mats_data_sub_id' })
  submission: MatsDataSubmission;

  @ManyToOne(() => MatsTestMethodCode)
  @JoinColumn({ name: 'mats_test_meth_cd' })
  testMethod: MatsTestMethodCode;
}
