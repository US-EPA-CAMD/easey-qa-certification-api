import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { MatsDataSubmission } from './mats-data-submission.entity';
import { MatsFileTypeCode } from './mats-file-type-code.entity';

@Entity({ name: 'camdecmpsaux.mats_data_submission_payload_file' })
export class MatsDataSubmissionPayloadFile extends BaseEntity {
  /* COLUMNS */

  @PrimaryGeneratedColumn('increment', {
    name: 'mats_data_sub_payload_file_id',
  })
  id: number;

  @Column({
    name: 'mats_data_sub_id',
    transformer: new NumericColumnTransformer(),
  })
  submissionId: number;

  @Column({ name: 'mats_data_file_type_cd' })
  fileTypeCode: string;

  @Column({ name: 'file_name' })
  fileName: string;

  @Column({ name: 'temp_s3_bucket_file_path' })
  tempS3BucketFilePath: string;

  @Column({ name: 'temp_s3_bucket_file_time' })
  tempS3BucketFileTime: Date;

  @Column({ name: 'main_s3_bucket_file_path' })
  mainS3BucketFilePath: string;

  @Column({ name: 'main_s3_bucket_file_time' })
  mainS3BucketFileTime: Date;

  /* RELATIONS */

  @ManyToOne(() => MatsDataSubmission)
  @JoinColumn({ name: 'mats_data_sub_id' })
  submission: MatsDataSubmission;

  @ManyToOne(() => MatsFileTypeCode)
  @JoinColumn({ name: 'mats_data_file_type_cd' })
  fileType: MatsFileTypeCode;
}
