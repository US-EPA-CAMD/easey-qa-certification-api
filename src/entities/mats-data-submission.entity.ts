import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';
import {
  BaseEntity,
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import { MonitorLocation } from './monitor-location.entity';
import { MonitorPlan } from './monitor-plan.entity';

@Entity({ name: 'camdecmpsaux.mats_data_submission' })
export class MatsDataSubmission extends BaseEntity {
  @PrimaryColumn({
    name: 'mats_data_sub_id',
    transformer: new NumericColumnTransformer(),
  })
  id: number;

  @Column({ name: 'mon_loc_id' })
  locationId: string;

  @Column({ name: 'mats_rpt_type_cd' })
  matsReportTypeCode: string;

  @Column({ name: 'mats_avg_group_cd' })
  matsAverageGroupCode: string;

  //@Column({ name: 'mats_test_meth_cd' })
  //matsTestMethodCode: string;

  @Column({ name: 'test_number' })
  testNumber: string;

  @Column({ name: 'test_date' })
  testDate: Date;

  @Column({ name: 'test_comment' })
  testComment: string;

  @Column({ name: 'year', transformer: new NumericColumnTransformer() })
  year: number;

  @Column({ name: 'quarter', transformer: new NumericColumnTransformer() })
  quarter: number;

  @Column({
    name: 'original_sub_id',
    transformer: new NumericColumnTransformer(),
  })
  originalSubmissionId: number;

  @Column({ name: 'fac_id', transformer: new NumericColumnTransformer() })
  facilityId: number;

  @Column({ name: 'mon_plan_id' })
  monitoringPlanId: string;

  @Column({ name: 'mats_status_cd' })
  matsStatusCode: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'add_time' })
  addTime: Date;

  @Column({ name: 'update_time' })
  updateTime: Date;
}
