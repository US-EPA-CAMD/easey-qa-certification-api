import {
  BaseEntity,
  Entity,
  Column,
  PrimaryColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';

import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';

import { TestSummary } from './test-summary.entity';
import { QASuppData } from './qa-supp-data.entity';

@Entity({ name: 'camdecmpsmd.reporting_period' })
export class ReportingPeriod extends BaseEntity {
  @PrimaryColumn({
    name: 'rpt_period_id',
    transformer: new NumericColumnTransformer(),
  })
  id: number;

  @Column({
    name: 'calendar_year',
    transformer: new NumericColumnTransformer(),
  })
  year: number;

  @Column({
    name: 'quarter',
    transformer: new NumericColumnTransformer(),
  })
  quarter: number;

  @OneToMany(
    () => TestSummary,
    o => o.reportingPeriod,
  )
  @JoinColumn({ name: 'rpt_period_id' })
  testSummaries: TestSummary[];

  @OneToMany(
    () => QASuppData,
    o => o.reportingPeriod,
  )
  @JoinColumn({ name: 'rpt_period_id' })
  qaSuppData: QASuppData[];
}
