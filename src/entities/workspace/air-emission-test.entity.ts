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
  name: 'camdecmpswks.air_emission_testing',
})
export class AirEmissionTesting extends BaseEntity {
  @PrimaryColumn({
    type: 'varchar',
    name: 'air_emission_test_id',
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
    name: 'qi_last_name',
  })
  qiLastName: string;

  @Column({
    type: 'varchar',
    name: 'qi_first_name',
  })
  qiFirstName: string;

  @Column({
    type: 'varchar',
    name: 'qi_middle_initial',
  })
  qiMiddleInitial: string;

  @Column({
    type: 'varchar',
    name: 'aetb_name',
  })
  aetbName: string;

  @Column({
    type: 'varchar',
    name: 'aetb_phone_number',
  })
  aetbPhoneNumber: string;

  @Column({
    type: 'varchar',
    name: 'aetb_email',
  })
  aetbEmail: string;

  @Column({
    type: 'date',
    name: 'exam_date',
  })
  examDate: Date;

  @Column({
    type: 'varchar',
    name: 'provider_name',
  })
  providerName: string;

  @Column({
    type: 'varchar',
    name: 'provider_email',
  })
  providerEmail: string;

  @Column({
    type: 'time without time zone',
    name: 'add_date',
  })
  addDate: Date;

  @Column({
    type: 'time without time zone',
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
    o => o.airEmissionTestings,
  )
  @JoinColumn({ name: 'test_sum_id' })
  testSummary: TestSummary;
}
