import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

import { MatsDataSubmission } from './mats-data-submission.entity';
import { MatsTestMethodCode } from './mats-test-method-code.entity';

@Entity({ name: 'camdecmpsaux.mats_data_submission_test_method' })
export class MatsDataSubmissionTestMethod extends BaseEntity {
  @PrimaryColumn({
    name: 'mats_data_sub_test_method_id',
    transformer: new NumericColumnTransformer(),
  })
  id: number;

  @Column({
    name: 'mats_data_submission_id',
    transformer: new NumericColumnTransformer(),
  })
  submissionId: number;

  @Column({ name: 'mats_test_meth_cd' })
  testMethodCode: string;

  @ManyToOne(() => MatsDataSubmission)
  @JoinColumn({ name: 'mats_data_submission_id' })
  submission: MatsDataSubmission;

  @ManyToOne(() => MatsTestMethodCode)
  @JoinColumn({ name: 'mats_test_meth_cd' })
  testMethod: MatsTestMethodCode;
}
