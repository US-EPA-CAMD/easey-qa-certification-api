import {
  BaseEntity,
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

@Entity({ name: 'camdecmpswks.monitor_location' })
export class MonitorLocation extends BaseEntity {
  @PrimaryColumn({
    name: 'mon_loc_id',
  })
  id: string;

  @OneToOne(
    () => StackPipe,
    stackPipe => stackPipe.location,
    { eager: true },
  )
  @JoinColumn({ name: 'stack_pipe_id' })
  stackPipe: StackPipe;

  @OneToOne(
    () => Unit,
    unit => unit.location,
    { eager: true },
  )
  @JoinColumn({ name: 'unit_id' })
  unit: Unit;

  @OneToMany(
    () => Component,
    c => c.location
  )
  @JoinColumn({ name: 'mon_loc_id' })
  components: Component[];

  @OneToMany(
    () => MonitorSystem,
    ms => ms.location
  )
  @JoinColumn({ name: 'mon_loc_id' })
  systems: MonitorSystem[];  

  @OneToMany(
    () => TestSummary,
    ts => ts.location
  )
  @JoinColumn({ name: 'mon_loc_id' })
  testSummaries: TestSummary[];
}
