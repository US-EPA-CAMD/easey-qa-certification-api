import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'camdecmpsmd.test_reason_code' })
export class TestReasonCode extends BaseEntity {
  @PrimaryColumn({
    name: 'test_reason_cd',
  })
  testReasonCode: string;

  @Column({
    name: 'test_reason_cd_description',
  })
  testReasonDescription: string;
}
