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
import { MatsPollutantCode } from './mats-pollutant-code.entity';

@Entity({ name: 'camdecmpsaux.mats_data_submission_pollutant' })
export class MatsDataSubmissionPollutant extends BaseEntity {
  @PrimaryGeneratedColumn('increment', {
    name: 'mats_data_sub_pollutant_id',
  })
  id: number;

  @Column({
    name: 'mats_data_sub_id',
    transformer: new NumericColumnTransformer(),
  })
  submissionId: number;

  @Column({ name: 'mats_pollutant_cd' })
  pollutantCode: string;

  @ManyToOne(() => MatsDataSubmission)
  @JoinColumn({ name: 'mats_data_sub_id' })
  submission: MatsDataSubmission;

  @ManyToOne(() => MatsPollutantCode)
  @JoinColumn({ name: 'mats_pollutant_cd' })
  pollutant: MatsPollutantCode;
}
