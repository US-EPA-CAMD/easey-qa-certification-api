import { BaseEntity, Column, Entity, ManyToMany, PrimaryColumn } from 'typeorm';

import { MatsReportTypeCode } from './mats-report-type-code.entity';
import { MatsTestMethodCode } from './mats-test-method-code.entity';

@Entity({ name: 'camdecmpsmd.mats_pollutant_code' })
export class MatsPollutantCode extends BaseEntity {
  @PrimaryColumn({ name: 'mats_pollutant_cd' })
  code: string;

  @Column({ name: 'mats_pollutant_description' })
  description: string;

  @Column({ name: 'metadata_pollutant_cd' })
  metadataPollutantCode: string;

  @ManyToMany(
    () => MatsReportTypeCode,
    reportType => reportType.pollutants,
  )
  reportTypes: MatsReportTypeCode[];

  @ManyToMany(
    () => MatsTestMethodCode,
    testMethod => testMethod.pollutants,
  )
  testMethods: MatsTestMethodCode[];
}
