import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';
import { CrossCheckCatalog } from './cross-check-catalog.entity';

@Entity({
  name: 'camdecmpsmd.cross_check_catalog_value',
})
export class CrossCheckCatalogValue extends BaseEntity {
  @PrimaryColumn({
    type: 'numeric',
    name: 'cross_chk_catalog_value_id',
    transformer: new NumericColumnTransformer(),
  })
  id: number;

  @Column({
    type: 'numeric',
    name: 'cross_chk_catalog_id',
    transformer: new NumericColumnTransformer(),
  })
  crossChkCatalogId: number;

  @Column({
    name: 'value1',
  })
  value1: string;

  @Column({
    name: 'value2',
  })
  value2: string;

  @Column({
    name: 'value3',
  })
  value3: string;

  @ManyToOne(
    () => CrossCheckCatalog,
    ccc => ccc.crossCheckCatalogValues,
  )
  @JoinColumn({
    name: 'cross_chk_catalog_id',
  })
  crossCheckCatalog: CrossCheckCatalog;
}
