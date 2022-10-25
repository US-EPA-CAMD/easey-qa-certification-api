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
import { AppEHeatInputFromGas } from './app-e-heat-input-from-gas.entity';
import { AppEHeatInputFromOil } from './app-e-heat-input-from-oil.entity';

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

  @Column({
    type: 'varchar',
    name: 'sys_designation_cd',
  })
  systemDesignationCode: string;

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

  @OneToMany(
    () => AppEHeatInputFromGas,
    aehig => aehig.system,
  )
  @JoinColumn({ name: 'mon_sys_id' })
  appEHeatInputFromGases: AppEHeatInputFromGas[];

  @OneToMany(
    () => AppEHeatInputFromOil,
    aehio => aehio.system,
  )
  @JoinColumn({ name: 'mon_sys_id' })
  appEHeatInputFromOils: AppEHeatInputFromOil[];
}
