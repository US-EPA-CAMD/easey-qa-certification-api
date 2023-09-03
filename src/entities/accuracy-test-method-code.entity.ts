import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'camdecmpsmd.accuracy_test_method_code' })
export class AccuracyTestMethodCode extends BaseEntity {
  @PrimaryColumn({
    name: 'acc_test_method_cd',
  })
  accuracyTestMethodCode: string;

  @Column({
    name: 'acc_test_method_cd_description',
  })
  accuracyTestMethodCodeDescription: string;
}
