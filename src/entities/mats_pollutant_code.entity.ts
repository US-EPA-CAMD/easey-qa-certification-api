import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'camdecmpsmd.mats_pollutant_code' })
export class MatsPollutantCode extends BaseEntity {
  @PrimaryColumn({ name: 'mats_pollutant_code' })
  code: string;

  @Column({ name: 'mats_pollutant_description' })
  description: string;

  @Column({ name: 'metadata_pollutant_cd' })
  metadataPollutantCode: string;
}
