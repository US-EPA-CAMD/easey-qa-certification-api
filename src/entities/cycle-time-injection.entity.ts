import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { CycleTimeSummary } from './cycle-time-summary.entity';

@Entity({ name: 'camdecmps.cycle_time_injection' })
export class CycleTimeInjection extends BaseEntity {
  @PrimaryColumn({
    type: 'varchar',
    name: 'cycle_time_inj_id',
  })
  id: string;

  @Column({
    type: 'varchar',
    name: 'cycle_time_sum_id',
  })
  cycleTimeSumId: string;

  @Column({
    type: 'varchar',
    name: 'gas_level_cd',
  })
  gasLevelCode: string;

  @Column({
    type: 'numeric',
    name: 'cal_gas_value',
  })
  calibrationGasValue: number;

  @Column({
    type: 'date',
    name: 'begin_date',
  })
  beginDate: Date;

  @Column({
    type: 'numeric',
    name: 'begin_hour',
  })
  beginHour: number;

  @Column({
    type: 'numeric',
    name: 'begin_min',
  })
  beginMinute: number;

  @Column({
    type: 'date',
    name: 'end_date',
  })
  endDate: Date;

  @Column({
    type: 'numeric',
    name: 'end_hour',
  })
  endHour: number;

  @Column({
    type: 'numeric',
    name: 'end_min',
  })
  endMinute: number;

  @Column({
    type: 'numeric',
    name: 'injection_cycle_time',
  })
  injectionCycleTime: number;

  @Column({
    type: 'numeric',
    name: 'begin_monitor_value',
  })
  beginMonitorValue: number;

  @Column({
    type: 'numeric',
    name: 'end_monitor_value',
  })
  endMonitorValue: number;

  @Column({
    type: 'varchar',
    name: 'userid',
  })
  userId: string;

  @Column({
    type: 'timestamp without time zone',
    name: 'add_date',
  })
  addDate: Date;

  @Column({
    type: 'timestamp without time zone',
    name: 'update_date',
  })
  updateDate: Date;

  @ManyToOne(
    () => CycleTimeSummary,
    o => o.cycleTimeInjections,
  )
  @JoinColumn({ name: 'cycle_time_sum_id' })
  cycleTimeSummary: CycleTimeSummary;
}
