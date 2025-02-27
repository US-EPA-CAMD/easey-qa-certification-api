import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'camdecmpsmd.mats_report_type_code' })
export class MatsReportTypeCode extends BaseEntity {
  @PrimaryColumn({ name: 'mats_rpt_type_cd' })
  code: string;

  @Column({ name: 'mats_rpt_type_description' })
  description: string;

  @Column({ name: 'metadata_rpt_type_cd' })
  metadataReportTypeCode: string;

  @Column({ name: 'requires_pollutant' })
  requiresPollutant: boolean;

  @Column({ name: 'requires_test_method' })
  requiresTestMethod: boolean;
}
