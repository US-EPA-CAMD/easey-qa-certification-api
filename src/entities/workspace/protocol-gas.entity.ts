import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { TestSummary } from './test-summary.entity';

@Entity({
  name: 'camdecmpswks.protocol_gas',
})
export class ProtocolGas extends BaseEntity {
  @PrimaryColumn({
    type: 'varchar',
    name: 'protocol_gas_id',
  })
  id: string;

  @Column({
    type: 'varchar',
    nullable: false,
    name: 'test_sum_id',
  })
  testSumId: string;

  @Column({
    type: 'varchar',
    name: 'gas_level_cd',
  })
  gasLevelCode: string;

  @Column({
    type: 'varchar',
    name: 'gas_type_cd',
  })
  gasTypeCode: string[];

  @Column({ type: 'varchar', name: 'vendor_id' })
  vendorIdentifier: string;

  @Column({
    type: 'varchar',
    name: 'cylinder_id',
  })
  cylinderIdentifier: string;

  @Column({
    type: 'date',
    name: 'expiration_date',
  })
  expirationDate: Date;

  @Column({
    type: 'timestamp',
    name: 'add_date',
  })
  addDate: Date;

  @Column({
    type: 'timestamp',
    name: 'update_date',
  })
  updateDate: Date;

  @Column({
    type: 'varchar',
    name: 'userid',
  })
  userId: string;

  @ManyToOne(
    () => TestSummary,
    o => o.protocolGases,
  )
  @JoinColumn({ name: 'test_sum_id' })
  testSummary: TestSummary;
}
