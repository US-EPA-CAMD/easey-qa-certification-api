import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { MatsAveragingGroupCode } from './mats-averaging-group-code.entity';
import { MatsReportTypeCode } from './mats-report-type-code.entity';
import { MatsStatusCode } from './mats-status-code.entity';
import { MatsTestMethodCode } from './mats-test-method-code.entity';
import { MatsPollutantCode } from './mats-pollutant-code.entity';
import { MatsDataSubmissionPayloadFile } from './mats-data-submission-payload-file.entity';
import { MonitorLocation } from './monitor-location.entity';
import { MonitorPlan } from './monitor-plan.entity';
import { Plant } from './plant.entity';

@Entity({ name: 'camdecmpsaux.mats_data_submission' })
export class MatsDataSubmission extends BaseEntity {
  /* COLUMNS */

  @PrimaryGeneratedColumn('increment', {
    name: 'mats_data_sub_id',
    type: 'bigint',
  })
  id: string; // TypeORM returns BIGINT as string because its value can exceed Number.MAX_SAFE_INTEGER

  @Column({ name: 'test_number' })
  testNumber: string;

  @Column({ name: 'test_date' })
  testDate: Date;

  @Column({ name: 'test_comment' })
  testComment: string;

  @Column({ name: 'mon_loc_id' })
  locationId: string;

  @Column({ name: 'mon_plan_id' })
  monitorPlanId: string;

  @Column({ name: 'mats_rpt_type_cd' })
  reportTypeCode: string;

  @Column({ name: 'mats_avg_group_cd' })
  averagingGroupCode: string;

  @Column({ name: 'original_sub_id' })
  originalSubmissionId: string;

  @Column({ name: 'fac_id', transformer: new NumericColumnTransformer() })
  facilityId: number;

  @Column({ name: 'mats_status_cd' })
  statusCode: string;

  @Column({ name: 'year', transformer: new NumericColumnTransformer() })
  year: number;

  @Column({ name: 'quarter', transformer: new NumericColumnTransformer() })
  quarter: number;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'add_time' })
  addTime: Date;

  @Column({ name: 'update_time' })
  updateTime: Date;

  /* RELATIONS */

  @ManyToOne(() => MonitorPlan)
  @JoinColumn({ name: 'mon_plan_id' })
  plan: MonitorPlan;

  @ManyToOne(() => MonitorLocation)
  @JoinColumn({ name: 'mon_loc_id' })
  location: MonitorLocation;

  @ManyToOne(() => MatsReportTypeCode)
  @JoinColumn({ name: 'mats_rpt_type_cd' })
  reportType: MatsReportTypeCode;

  @ManyToOne(() => MatsAveragingGroupCode)
  @JoinColumn({ name: 'mats_avg_group_cd' })
  averagingGroup: MatsAveragingGroupCode;

  @ManyToOne(() => MatsStatusCode)
  @JoinColumn({ name: 'mats_status_cd' })
  status: MatsStatusCode;

  @OneToOne(() => MatsDataSubmission)
  @JoinColumn({ name: 'original_sub_id' })
  originalSubmission: MatsDataSubmission;

  @ManyToOne(() => Plant)
  @JoinColumn({ name: 'fac_id' })
  facility: Plant;

  @ManyToMany(() => MatsPollutantCode)
  @JoinTable({
    name: 'camdecmpsaux.mats_data_submission_pollutant',
    joinColumn: { name: 'mats_data_sub_id' },
    inverseJoinColumn: { name: 'mats_pollutant_cd' },
  })
  pollutants: MatsPollutantCode[];

  @ManyToMany(() => MatsTestMethodCode)
  @JoinTable({
    name: 'camdecmpsaux.mats_data_submission_test_method',
    joinColumn: { name: 'mats_data_sub_id' },
    inverseJoinColumn: { name: 'mats_test_meth_cd' },
  })
  testMethods: MatsTestMethodCode[];

  @OneToMany(
    () => MatsDataSubmissionPayloadFile,
    file => file.submission,
  )
  payloadFiles: MatsDataSubmissionPayloadFile[];
}
