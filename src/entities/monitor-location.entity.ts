import {
  BaseEntity,
  Entity,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';

import { Unit } from './unit.entity';
import { StackPipe } from './stack-pipe.entity';
import { TestSummary } from './test-summary.entity';

@Entity({
  name: 'camdecmps.monitor_location',
})
export class MonitorLocation extends BaseEntity {
  @PrimaryColumn({
    name: 'mon_loc_id',
  })
  id: string;

  @ManyToOne(
    () => StackPipe,
    stackPipe => stackPipe.locations,
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
    () => TestSummary,
    ts => ts.location
  )
  testSummaries: TestSummary[];
}
