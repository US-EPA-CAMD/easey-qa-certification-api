import {
  BaseEntity,
  Entity,
  Column,
  PrimaryColumn,
  OneToMany,
  JoinColumn,
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

  @OneToMany(
    () => Unit,
    unit => unit.plant,
  )
  @JoinColumn({ name: 'unit_id' })
  units: Unit[];

  @OneToMany(
    () => StackPipe,
    stackPipe => stackPipe.plant,
  )
  @JoinColumn({ name: 'stack_pipe_id' })
  stackPipes: StackPipe[];
}
