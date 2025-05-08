import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryColumn,
} from 'typeorm';

import { MatsPollutantCode } from './mats-pollutant-code.entity';

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

  @Column({ name: 'enforce_attachment_rules' })
  enforceAttachmentRules: boolean;

  @ManyToMany(
    () => MatsPollutantCode,
    o => o.reportTypes,
  )
  @JoinTable({
    name: 'camdecmpsmd.mats_report_type_to_pollutant_crosscheck',
    joinColumn: {
      name: 'mats_rpt_type_cd',
      referencedColumnName: 'code',
    },
    inverseJoinColumn: {
      name: 'mats_pollutant_cd',
      referencedColumnName: 'code',
    },
  })
  pollutants: MatsPollutantCode[];
}
