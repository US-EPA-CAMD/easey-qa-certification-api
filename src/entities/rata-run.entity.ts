import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';

@Entity({ name: 'camdecmps.rata_run' })
export class RataRun extends BaseEntity {

  @PrimaryColumn({ name: 'rata_run_id' })
  id: string;

  @Column({ name: 'rata_sum_id' })
  rataSummaryId: string;

  @Column({ name: 'run_num', transformer: new NumericColumnTransformer() })
  runNumber: number;

  @Column({ name: 'begin_date' })
  beginDate: Date;

  @Column({ name: 'begin_hour', transformer: new NumericColumnTransformer() })
  beginHour: number;

  @Column({ name: 'begin_min', transformer: new NumericColumnTransformer() })
  beginMinute: number;

  @Column({ name: 'end_date' })
  endDate: Date;

  @Column({ name: 'end_hour', transformer: new NumericColumnTransformer() })
  endHour: number;

  @Column({ name: 'end_min', transformer: new NumericColumnTransformer() })
  endMinute: number;

  @Column({ name: 'cem_value', transformer: new NumericColumnTransformer() })
  cemValue: number;

  @Column({ name: 'rata_ref_value', transformer: new NumericColumnTransformer() })
  rataReferenceValue: number;

  @Column({ name: 'gross_unit_load', transformer: new NumericColumnTransformer() })
  grossUnitLoad: number;

  @Column({ name: 'run_status_cd' })
  runStatusCode: string;
}