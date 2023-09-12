import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'camdecmpsmd.required_test_code' })
export class RequiredTestCode extends BaseEntity {
  @PrimaryColumn({
    name: 'required_test_cd',
  })
  requiredTestCode: string;

  @Column({
    name: 'required_test_cd_description',
  })
  requiredTestCodeDescription: string;
}
