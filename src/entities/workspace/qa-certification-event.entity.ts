import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

import { MonitorLocation } from './monitor-location.entity';
import { Component } from './component.entity';
import { MonitorSystem } from './monitor-system.entity';

@Entity({ name: 'camdecmpswks.qa_cert_event' })
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
  monitoringSystemID: string;

  @Column({
    name: 'component_id',
    type: 'varchar',
  })
  componentID: string;

  @Column({
    name: 'qa_cert_event_cd',
    type: 'varchar',
  })
  qaCertEventCode: string;

  @Column({
    name: 'qa_cert_event_date',
    type: 'date',
  })
  qaCertEventDate: Date;

  @Column({
    name: 'qa_cert_event_hour',
    type: 'numeric',
  })
  qaCertEventHour: number;

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
  })
  submissionId: number;

  @Column({
    name: 'submission_availability_cd',
    type: 'varchar',
  })
  submissionAvailabilityCode: string;

  @Column({
    name: 'pending_status_cd',
    type: 'varchar',
  })
  pendingStatusCode: string;

  @Column({
    name: 'eval_status_cd',
    type: 'varchar',
  })
  evalStatusCode: string;

  @Column({
    name: 'userid',
    type: 'varchar',
  })
  userId: string;

  @Column({
    name: 'add_date',
    type: 'timestamp without time zone',
  })
  addDate: Date;

  @Column({
    name: 'update_date',
    type: 'timestamp without time zone',
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