import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';
import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryColumn,
} from 'typeorm';

import { MatsPollutantCode } from './mats-pollutant-code.entity';

@Entity({ name: 'camdecmpsmd.mats_test_method_code' })
export class MatsTestMethodCode extends BaseEntity {
  @PrimaryColumn({ name: 'mats_test_meth_cd' })
  code: string;

  @Column({ name: 'mats_test_meth_description' })
  description: string;

  @Column({
    name: 'display_order',
    transformer: new NumericColumnTransformer(),
  })
  displayOrder: number;

  @ManyToMany(
    () => MatsPollutantCode,
    o => o.testMethods,
  )
  @JoinTable({
    name: 'camdecmpsmd.mats_test_method_to_pollutant_crosscheck',
    joinColumn: {
      name: 'mats_test_meth_cd',
      referencedColumnName: 'code',
    },
    inverseJoinColumn: {
      name: 'mats_pollutant_cd',
      referencedColumnName: 'code',
    },
  })
  pollutants: MatsPollutantCode[];
}
