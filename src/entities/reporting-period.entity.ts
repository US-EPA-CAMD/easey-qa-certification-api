import {
  BaseEntity,
  Entity,
  Column,
  PrimaryColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';

import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';

import { TestSummary } from './workspace/test-summary.entity';
import { QASuppData } from './workspace/qa-supp-data.entity';

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

  @Column({
    type: 'date',
    name: 'begin_date',
  })
  beginDate: Date;

  @Column({
    type: 'date',
    name: 'end_date',
  })
  endDate: Date;

  @Column({
    name: 'period_abbreviation',
  })
  periodAbbreviation: string;

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
