import {
  BaseEntity,
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';

import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';

import { Plant } from './plant.entity';
import { MonitorLocation } from './monitor-location.entity';

@Entity({ name: 'camd.unit' })
export class Unit extends BaseEntity {
  @PrimaryColumn({
    name: 'unit_id',
    transformer: new NumericColumnTransformer(),
  })
  id: number;

  @Column({
    name: 'unitid',
  })
  name: string;

  @Column({
    name: 'unit_description',
  })
  description: string;

  @Column({
    type: 'date',
    name: 'comr_op_date',
  })
  commercialOperationDate: Date;

  @Column({
    type: 'date',
    name: 'comm_op_date',
  })
  operationDate: Date;

  @Column({
    name: 'non_load_based_ind',
    transformer: new NumericColumnTransformer(),
  })
  nonLoadBasedIndicator: number;

  @Column({
    name: 'fac_id',
  })
  facId: number;

  @ManyToOne(
    () => Plant,
    plant => plant.units,
  )
  @JoinColumn({ name: 'fac_id' })
  plant: Plant;

  @OneToOne(
    () => MonitorLocation,
    location => location.unit,
  )
  location: MonitorLocation;
}
