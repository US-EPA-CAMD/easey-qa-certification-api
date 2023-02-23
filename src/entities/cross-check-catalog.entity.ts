import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';
import { CrossCheckCatalogValue } from './cross-check-catalog-value.entity';

@Entity({
  name: 'camdecmpsmd.cross_check_catalog',
})
export class CrossCheckCatalog extends BaseEntity {
  @PrimaryColumn({
    type: 'numeric',
    name: 'cross_chk_catalog_id',
    transformer: new NumericColumnTransformer(),
  })
  id: number;

  @Column({
    type: 'varchar',
    name: 'cross_chk_catalog_name',
  })
  crossCheckCatalogName: string;

  @Column({
    type: 'varchar',
    name: 'cross_chk_catalog_description',
  })
  crossCheckCatalogDescription: string;

  @Column({
    type: 'varchar',
    name: 'table_name1',
  })
  tableName1: string;

  @Column({
    type: 'varchar',
    name: 'column_name1',
  })
  columnName1: string;

  @Column({
    type: 'varchar',
    name: 'description1',
  })
  description1: string;

  @Column({
    type: 'varchar',
    name: 'field_type_cd1',
  })
  fieldTypeCode1: string;

  @Column({
    type: 'varchar',
    name: 'table_name2',
  })
  tableName2: string;

  @Column({
    type: 'varchar',
    name: 'column_name2',
  })
  columnName2: string;

  @Column({
    type: 'varchar',
    name: 'description2',
  })
  description2: string;

  @Column({
    type: 'varchar',
    name: 'field_type_cd2',
  })
  fieldTypeCode2: string;

  @Column({
    type: 'varchar',
    name: 'table_name3',
  })
  tableName3: string;

  @Column({
    type: 'varchar',
    name: 'column_name3',
  })
  columnName3: string;

  @Column({
    type: 'varchar',
    name: 'description3',
  })
  description3: string;

  @Column({
    type: 'varchar',
    name: 'field_type_cd3',
  })
  fieldTypeCode3: string;

  @OneToMany(
    () => CrossCheckCatalogValue,
    cccv => cccv.crossCheckCatalog,
  )
  @JoinColumn({
    name: 'cross_chk_catalog_id',
  })
  crossCheckCatalogValues: CrossCheckCatalogValue[];
}
