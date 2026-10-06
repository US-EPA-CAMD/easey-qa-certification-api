import {
  BaseEntity,
  Column,
  Entity,
  PrimaryColumn,
  JoinColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';

import { Unit } from './unit.entity';
import { Component } from './component.entity';
import { StackPipe } from './stack-pipe.entity';
import { TestSummary } from './test-summary.entity';
import { MonitorSystem } from './monitor-system.entity';
import { QASuppData } from './qa-supp-data.entity';
import { MonitorMethod } from './monitor-method.entity';
import { QACertificationEvent } from './qa-certification-event.entity';

@Entity({ name: 'camdecmpswks.monitor_location' })
export class MonitorLocation extends BaseEntity {
  @PrimaryColumn({
    name: 'mon_loc_id',
    type: 'varchar',
  })
  id: string;

  @Column({
    name: 'unit_id',
    type: 'varchar',
  })
  unitId: number;

  @Column({
    name: 'stack_pipe_id',
    type: 'varchar',
  })
  stackPipeId: string;

  @OneToOne(
    () => StackPipe,
    o => o.location,
    { eager: true },
  )
  @JoinColumn({ name: 'stack_pipe_id' })
  stackPipe: StackPipe;

  @OneToOne(
    () => Unit,
    o => o.location,
    { eager: true },
  )
  @JoinColumn({ name: 'unit_id' })
  unit: Unit;

  @OneToMany(
    () => Component,
    o => o.location,
  )
  @JoinColumn({ name: 'mon_loc_id' })
  components: Component[];

  @OneToMany(
    () => MonitorSystem,
    o => o.location,
  )
  @JoinColumn({ name: 'mon_loc_id' })
  systems: MonitorSystem[];

  @OneToMany(
    () => MonitorMethod,
    method => method.location,
  )
  methods: MonitorMethod[];

  @OneToMany(
    () => TestSummary,
    o => o.location,
  )
  @JoinColumn({ name: 'mon_loc_id' })
  testSummaries: TestSummary[];

  @OneToMany(
    () => QASuppData,
    o => o.location,
  )
  @JoinColumn({ name: 'mon_loc_id' })
  qaSuppData: QASuppData[];

  @OneToMany(
    () => QACertificationEvent,
    o => o.location,
  )
  @JoinColumn({ name: 'mon_loc_id' })
  qaCertEvents: QACertificationEvent[];
}
