import {
  BaseEntity,
  Entity,
  Column,
  PrimaryColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';

import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';
import { ProtocolGas } from '../protocol-gas.entity';

@Entity({ name: 'camdecmps.protocol_gas_vendor' })
export class ProtocolGasVendor extends BaseEntity {
  @PrimaryColumn({
    type: 'varchar',
    name: 'vendor_id',
  })
  vendorID: string;

  @Column({
    name: 'vendor_name',
  })
  vendorName: string;

  @Column({
    name: 'active_ind',
    transformer: new NumericColumnTransformer(),
  })
  activeIndicator: number;

  @Column({
    type: 'date',
    name: 'activation_date',
  })
  activationDate: Date;

  @Column({
    type: 'date',
    name: 'deactivation_date',
  })
  deactivationDate: Date;

  @Column({ name: 'userid' })
  userId: string;

  @Column({
    name: 'add_date',
  })
  addDate: Date;

  @Column({
    name: 'update_date',
  })
  updateDate: Date;

  @OneToMany(
    () => ProtocolGas,
    o => o.protocolGasVendor,
  )
  @JoinColumn({ name: 'vendor_id' })
  protocolGas: ProtocolGas[];
}
