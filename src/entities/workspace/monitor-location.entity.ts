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

@Entity({ name: 'camdecmpswks.monitor_location' })
export class MonitorLocation extends BaseEntity {
  @PrimaryColumn({
    name: 'mon_loc_id',
  })
  id: string;

  @Column({
    name: 'unit_id',
  })
  unitId: string;
  
  @Column({
    name: 'stack_pipe_id',
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
    o => o.location
  )
  @JoinColumn({ name: 'mon_loc_id' })
  components: Component[];

  @OneToMany(
    () => MonitorSystem,
    o => o.location
  )
  @JoinColumn({ name: 'mon_loc_id' })
  systems: MonitorSystem[];  

  @OneToMany(
    () => TestSummary,
    o => o.location
  )
  @JoinColumn({ name: 'mon_loc_id' })
  testSummaries: TestSummary[];

  @OneToMany(
    () => QASuppData,
    o => o.location
  )
  @JoinColumn({ name: 'mon_loc_id' })
  qaSuppData: QASuppData[];
}
