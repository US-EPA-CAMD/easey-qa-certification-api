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
import { RataRun } from './rata-run.entity';
import { RataTraverse } from './rata-traverse.entity';

@Entity({ name: 'camdecmpswks.flow_rata_run' })
export class FlowRataRun extends BaseEntity {
  @PrimaryColumn({ name: 'flow_rata_run_id' })
  id: string;

  @Column({ name: 'rata_run_id' })
  rataRunId: string;

  @Column({
    name: 'num_traverse_point',
    transformer: new NumericColumnTransformer(),
  })
  numberOfTraversePoints: number;

  @Column({
    name: 'barometric_pressure',
    transformer: new NumericColumnTransformer(),
  })
  barometricPressure: number;

  @Column({
    name: 'static_stack_pressure',
    transformer: new NumericColumnTransformer(),
  })
  staticStackPressure: number;

  @Column({ name: 'percent_co2', transformer: new NumericColumnTransformer() })
  percentCO2: number;

  @Column({ name: 'percent_o2', transformer: new NumericColumnTransformer() })
  percentO2: number;

  @Column({
    name: 'percent_moisture',
    transformer: new NumericColumnTransformer(),
  })
  percentMoisture: number;

  @Column({
    name: 'dry_molecular_weight',
    transformer: new NumericColumnTransformer(),
  })
  dryMolecularWeight: number;

  @Column({
    name: 'calc_dry_molecular_weight',
    transformer: new NumericColumnTransformer(),
  })
  calculatedDryMolecularWeight: number;

  @Column({
    name: 'wet_molecular_weight',
    transformer: new NumericColumnTransformer(),
  })
  wetMolecularWeight: number;

  @Column({
    name: 'calc_wet_molecular_weight',
    transformer: new NumericColumnTransformer(),
  })
  calculatedWetMolecularWeight: number;

  @Column({
    name: 'avg_vel_wo_wall',
    transformer: new NumericColumnTransformer(),
  })
  averageVelocityWithoutWallEffects: number;

  @Column({
    name: 'calc_avg_vel_wo_wall',
    transformer: new NumericColumnTransformer(),
  })
  calculatedAverageVelocityWithoutWallEffects: number;

  @Column({
    name: 'avg_vel_w_wall',
    transformer: new NumericColumnTransformer(),
  })
  averageVelocityWithWallEffects: number;

  @Column({
    name: 'calc_avg_vel_w_wall',
    transformer: new NumericColumnTransformer(),
  })
  calculatedAverageVelocityWithWallEffects: number;

  @Column({ name: 'calc_waf', transformer: new NumericColumnTransformer() })
  calculatedWAF: number;

  @Column({
    name: 'calc_calc_waf',
    transformer: new NumericColumnTransformer(),
  })
  calculatedCalculatedWAF: number;

  @Column({
    name: 'avg_stack_flow_rate',
    transformer: new NumericColumnTransformer(),
  })
  averageStackFlowRate: number;

  @Column({ name: 'userid' })
  userId: string;

  @Column({ name: 'add_date' })
  addDate: Date;

  @Column({ name: 'update_date' })
  updateDate: Date;

  @ManyToOne(
    () => RataRun,
    r => r.FlowRataRuns,
  )
  @JoinColumn({ name: 'rata_run_id' })
  RataRun: RataRun;

  @OneToMany(
    () => RataTraverse,
    rt => rt.FlowRataRun,
  )
  @JoinColumn({ name: 'flow_rata_run_id' })
  RataTraverses: RataTraverse[];
}
