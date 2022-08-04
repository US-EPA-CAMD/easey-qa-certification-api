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
  gasTypeCode: string;

  @Column({ type: 'varchar', name: 'vendor_id' })
  vendorID: string;

  @Column({
    type: 'varchar',
    name: 'cylinder_id',
  })
  cylinderID: string;

  @Column({
    type: 'date',
    name: 'expiration_date',
  })
  expirationDate: Date;

  @Column({
    type: 'time without time zone',
    name: 'add_date',
  })
  addDate: string;

  @Column({
    type: 'time without time zone',
    name: 'update_date',
  })
  updateDate: string;

  @Column({
    type: 'varchar',
    name: 'userid',
  })
  userId: string;

  @ManyToOne(
    () => TestSummary,
    o => o.linearitySummaries,
  )
  @JoinColumn({ name: 'test_sum_id' })
  testSummary: TestSummary;
}
