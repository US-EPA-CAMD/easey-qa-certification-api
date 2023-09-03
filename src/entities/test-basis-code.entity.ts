import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'camdecmpsmd.test_basis_code' })
export class TestBasisCode extends BaseEntity {
  @PrimaryColumn({
    name: 'test_basis_cd',
  })
  testBasisCode: string;

  @Column({
    name: 'test_basis_description',
  })
  testBasisCodeDescription: string;
}
