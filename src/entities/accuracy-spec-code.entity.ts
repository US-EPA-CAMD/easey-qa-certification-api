import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'camdecmpsmd.accuracy_spec_code' })
export class AccuracySpecCode extends BaseEntity {
  @PrimaryColumn({
    name: 'accuracy_spec_cd',
  })
  accuracySpecCode: string;

  @Column({
    name: 'accuracy_spec_cd_description',
  })
  accuracySpecCodeDescription: string;
}
