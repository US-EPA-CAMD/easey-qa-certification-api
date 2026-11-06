import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';

import { MonitorLocation } from './monitor-location.entity';
import { Component } from './component.entity';
import { MonitorSystem } from './monitor-system.entity';

@Entity({ name: 'camdecmps.qa_cert_event' })
export class QACertificationEvent extends BaseEntity {
  @PrimaryColumn({
    name: 'qa_cert_event_id',
    type: 'varchar',
  })
  id: string;

  @Column({
    name: 'mon_loc_id',
    type: 'varchar',
  })
  locationId: string;

  @Column({
    name: 'mon_sys_id',
    type: 'varchar',
  })
  monitoringSystemRecordId: string;

  @Column({
    name: 'component_id',
    type: 'varchar',
  })
  componentRecordId: string;

  @Column({
    name: 'qa_cert_event_cd',
    type: 'varchar',
  })
  certificationEventCode: string;

  @Column({
    name: 'qa_cert_event_date',
    type: 'date',
  })
  certificationEventDate: Date;

  @Column({
    name: 'qa_cert_event_hour',
    type: 'numeric',
    transformer: new NumericColumnTransformer(),
  })
  certificationEventHour: number;

  @Column({
    name: 'required_test_cd',
    type: 'varchar',
  })
  requiredTestCode: string;

  @Column({
    name: 'conditional_data_begin_date',
    type: 'date',
  })
  conditionalBeginDate: Date;

  @Column({
    name: 'conditional_data_begin_hour',
    type: 'numeric',
    transformer: new NumericColumnTransformer(),
  })
  conditionalBeginHour: number;

  @Column({
    name: 'last_test_completed_date',
    type: 'date',
  })
  completionTestDate: Date;

  @Column({
    name: 'last_test_completed_hour',
    type: 'numeric',
    transformer: new NumericColumnTransformer(),
  })
  completionTestHour: number;

  @Column({
    name: 'last_updated',
    type: 'date',
  })
  lastUpdated: Date;

  @Column({
    name: 'updated_status_flg',
    type: 'varchar',
  })
  updatedStatusFlag: string;

  @Column({
    name: 'needs_eval_flg',
    type: 'varchar',
  })
  needsEvalFlag: string;

  @Column({
    name: 'chk_session_id',
    type: 'varchar',
  })
  checkSessionId: string;

  @Column({
    name: 'submission_id',
    type: 'numeric',
    transformer: new NumericColumnTransformer(),
  })
  submissionId: number;

  @Column({
    name: 'submission_availability_cd',
    type: 'varchar',
  })
  submissionAvailabilityCode: string;

  @Column({
    name: 'userid',
    type: 'varchar',
  })
  userId: string;

  @Column({
    name: 'add_date',
    type: 'timestamp',
  })
  addDate: Date;

  @Column({
    name: 'update_date',
    type: 'timestamp',
  })
  updateDate: Date;

  @ManyToOne(
    () => MonitorLocation,
    o => o.qaCertEvents,
  )
  @JoinColumn({ name: 'mon_loc_id' })
  location: MonitorLocation;

  @ManyToOne(
    () => Component,
    o => o.qaCertEvents,
  )
  @JoinColumn({ name: 'component_id' })
  component: Component;

  @ManyToOne(
    () => MonitorSystem,
    o => o.qaCertEvents,
  )
  @JoinColumn({ name: 'mon_sys_id' })
  system: MonitorSystem;
}
