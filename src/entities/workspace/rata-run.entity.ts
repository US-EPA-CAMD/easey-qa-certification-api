import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';
import { RataSummary } from './rata-summary.entity';
import { FlowRataRun } from './flow-rata-run.entity';

@Entity({ name: 'camdecmpswks.rata_run' })
export class RataRun extends BaseEntity {
  @PrimaryColumn({ name: 'rata_run_id' })
  id: string;

  @Column({ name: 'rata_sum_id' })
  rataSumId: string;

  @Column({ name: 'run_num', transformer: new NumericColumnTransformer() })
  runNumber: number;

  @Column({ type: 'date', name: 'begin_date' })
  beginDate: Date;

  @Column({ name: 'begin_hour', transformer: new NumericColumnTransformer() })
  beginHour: number;

  @Column({ name: 'begin_min', transformer: new NumericColumnTransformer() })
  beginMinute: number;

  @Column({ type: 'date', name: 'end_date' })
  endDate: Date;

  @Column({ name: 'end_hour', transformer: new NumericColumnTransformer() })
  endHour: number;

  @Column({ name: 'end_min', transformer: new NumericColumnTransformer() })
  endMinute: number;

  @Column({ name: 'cem_value', transformer: new NumericColumnTransformer() })
  cemValue: number;

  @Column({
    name: 'rata_ref_value',
    transformer: new NumericColumnTransformer(),
  })
  rataReferenceValue: number;

  @Column({
    name: 'calc_rata_ref_value',
    transformer: new NumericColumnTransformer(),
  })
  calculatedRataReferenceValue: number;

  @Column({
    name: 'gross_unit_load',
    transformer: new NumericColumnTransformer(),
  })
  grossUnitLoad: number;

  @Column({ name: 'run_status_cd' })
  runStatusCode: string;

  @Column({ name: 'userid' })
  userId: string;

  @Column({
    name: 'add_date',
  })
  addDate: Date;

  @Column({
    name: 'update_date',
  })
  updateDate: Date;

  @ManyToOne(
    () => RataSummary,
    r => r.RataRuns,
  )
  @JoinColumn({ name: 'rata_sum_id' })
  RataSummary: RataSummary;

  @ManyToOne(
    () => FlowRataRun,
    r => r.RataRun,
  )
  @JoinColumn({ name: 'rata_run_id' })
  FlowRataRuns: FlowRataRun[];
}
