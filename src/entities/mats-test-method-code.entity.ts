import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';
import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'camdecmpsmd.mats_test_method_code' })
export class MatsTestMethodCode extends BaseEntity {
  @PrimaryColumn({ name: 'mats_test_meth_cd' })
  code: string;

  @Column({ name: 'mats_test_method_description' })
  description: string;

  @Column({
    name: 'display_order',
    transformer: new NumericColumnTransformer(),
  })
  displayOrder: number;
}
