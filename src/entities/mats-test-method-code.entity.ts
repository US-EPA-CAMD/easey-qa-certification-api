import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';

@Entity({ name: 'camdecmpsmd.mats_test_method_code' })
export class MatsTestMethodCode extends BaseEntity {
  @PrimaryColumn({ name: 'mats_test_meth_cd' })
  matsTestMethodCode: string;

  @Column({ name: 'mats_test_method_description' })
  matsTestMethodDescription: string;

  @Column({
    name: 'display_order',
    transformer: new NumericColumnTransformer(),
  })
  displayOrder: number;
}
