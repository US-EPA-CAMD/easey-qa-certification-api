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
import { QASuppData } from './qa-supp-data.entity';

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
  monitoringSystemID: string;

  @Column({
    type: 'varchar',
    name: 'sys_type_cd',
  })
  systemTypeCode: string;

  @ManyToOne(
    () => MonitorLocation,
    o => o.systems,
  )
  @JoinColumn({ name: 'mon_loc_id' })
  location: MonitorLocation;

  @OneToMany(
    () => TestSummary,
    o => o.system,
  )
  @JoinColumn({ name: 'mon_loc_id' })
  testSummaries: TestSummary[];

  @OneToMany(
    () => QASuppData,
    o => o.system,
  )
  @JoinColumn({ name: 'mon_loc_id' })
  qaSuppData: QASuppData[];
}
