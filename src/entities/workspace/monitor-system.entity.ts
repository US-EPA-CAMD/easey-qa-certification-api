import {
  BaseEntity,
  Entity,
  Column,
  PrimaryColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { TestSummary } from './test-summary.entity';
import { MonitorLocation } from './monitor-location.entity';

@Entity({ name: 'camdecmpswks.monitor_system' })
export class MonitorSystem extends BaseEntity {
  @PrimaryColumn({ type: 'varchar', length: 45, name: 'mon_sys_id' })
  id: string;

  @Column({ type: 'varchar', length: 45, nullable: false, name: 'mon_loc_id' })
  locationId: string;

  @Column({
    type: 'varchar',
    length: 3,
    nullable: true,
    name: 'system_identifier',
  })
  monitoringSystemId: string;

  @ManyToOne(
    () => MonitorLocation,
    ml => ml.systems,
  )
  @JoinColumn({ name: 'mon_loc_id' })
  location: MonitorLocation;

  @OneToMany(
    () => TestSummary,
    ts => ts.system,
  )
  @JoinColumn({ name: 'mon_loc_id' })
  testSummaries: TestSummary[];
}