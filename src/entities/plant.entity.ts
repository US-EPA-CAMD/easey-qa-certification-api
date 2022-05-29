import {
  BaseEntity,
  Entity,
  Column,
  PrimaryColumn,
  OneToMany,
} from 'typeorm';

import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';

import { Unit } from './unit.entity';
import { StackPipe } from './stack-pipe.entity';

@Entity({ name: 'camd.plant' })
export class Plant extends BaseEntity {
  @PrimaryColumn({
    name: 'fac_id',
    transformer: new NumericColumnTransformer(),
  })
  id: number;

  @Column({
    name: 'oris_code',
    transformer: new NumericColumnTransformer(),
  })
  orisCode: number;

  @Column({
    name: 'facility_name',
  })
  name: string;

  @Column()
  state: string;

  @Column({
    name: 'epa_region',
    transformer: new NumericColumnTransformer(),
  })
  region: number;

  @OneToMany(
    () => Unit,
    unit => unit.plant,
  )
  units: Unit[];

  @OneToMany(
    () => StackPipe,
    stackPipe => stackPipe.plant,
  )
  stackPipes: StackPipe[];
}
