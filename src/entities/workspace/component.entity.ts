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
import { AnalyzerRange } from './analyzerRange.entity';

@Entity({ name: 'camdecmpswks.component' })
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
    o => o.systems,
  )
  @JoinColumn({ name: 'mon_loc_id' })
  location: MonitorLocation;

  @OneToMany(
    () => AnalyzerRange,
    ar => ar.component,
  )
  analyzerRanges: AnalyzerRange[];

  @OneToMany(
    () => TestSummary,
    o => o.component,
  )
  @JoinColumn({ name: 'mon_loc_id' })
  testSummaries: TestSummary[];

  @OneToMany(
    () => QASuppData,
    o => o.component,
  )
  @JoinColumn({ name: 'component_id' })
  qaSuppData: QASuppData[];
}
