import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';
import { TestSummary } from './test-summary.entity';
import { CycleTimeInjection } from './cycle-time-injection.entity';

@Entity({
  name: 'camdecmps.cycle_time_summary',
})
export class CycleTimeSummary extends BaseEntity {
  @PrimaryColumn({
    type: 'varchar',
    nullable: false,
    name: 'cycle_time_sum_id',
  })
  id: string;

  @Column({
    type: 'varchar',
    nullable: false,
    name: 'test_sum_id',
  })
  testSumId: string;

  @Column({
    transformer: new NumericColumnTransformer(),
    name: 'total_time',
  })
  totalTime: number;

  @Column({
    transformer: new NumericColumnTransformer(),
    name: 'calc_total_time',
  })
  calculatedTotalTime: number;

  @Column({
    type: 'timestamp',
    name: 'add_date',
  })
  addDate: Date;

  @Column({
    type: 'timestamp',
    name: 'update_date',
  })
  updateDate: Date;

  @Column({
    type: 'varchar',
    name: 'userid',
  })
  userId: string;

  @ManyToOne(
    () => TestSummary,
    o => o.cycleTimeSummary,
  )
  @JoinColumn({ name: 'test_sum_id' })
  testSummary: TestSummary;

  @OneToMany(
    () => CycleTimeInjection,
    o => o.cycleTimeSummary,
  )
  @JoinColumn({ name: 'cycle_time_sum_id' })
  cycleTimeInjections: CycleTimeInjection[];
}
