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

@Entity({ name: 'camdecmps.component' })
export class Component extends BaseEntity {
  @PrimaryColumn({ type: 'varchar', length: 45, name: 'component_id' })
  id: string;

  @Column({ type: 'varchar', length: 45, nullable: false, name: 'mon_loc_id' })
  locationId: string;

  @Column({
    type: 'varchar',
    length: 3,
    nullable: false,
    name: 'component_identifier',
  })
  componentID: string;

  @Column({
    type: 'varchar',
    length: 7,
    nullable: false,
    name: 'component_type_cd',
  })
  componentTypeCode: string;

  @ManyToOne(
    () => MonitorLocation,
    ml => ml.systems,
  )
  @JoinColumn({ name: 'mon_loc_id' })
  location: MonitorLocation;

  @OneToMany(
    () => TestSummary,
    ts => ts.component,
  )
  @JoinColumn({ name: 'mon_loc_id' })
  testSummaries: TestSummary[];
}
