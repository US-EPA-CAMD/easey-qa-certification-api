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

@Entity({ name: 'camdecmps.flow_rata_run' })
export class FlowRataRun extends BaseEntity {
  @PrimaryColumn({ name: 'flow_rata_run_id' })
  id: string;

  @Column({ name: 'rata_run_id' })
  rataRunId: string;

  @Column({
    name: 'num_traverse_point',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  numberOfTraversePoints: number;

  @Column({
    name: 'barometric_pressure',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  barometricPressure: number;

  @Column({
    name: 'static_stack_pressure',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  staticStackPressure: number;

  @Column({
    name: 'percent_co2',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  percentCO2: number;

  @Column({
    name: 'percent_o2',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  percentO2: number;

  @Column({
    name: 'percent_moisture',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  percentMoisture: number;

  @Column({
    name: 'dry_molecular_weight',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  dryMolecularWeight: number;

  @Column({
    name: 'calc_dry_molecular_weight',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  calculatedDryMolecularWeight: number;

  @Column({
    name: 'wet_molecular_weight',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  wetMolecularWeight: number;

  @Column({
    name: 'calc_wet_molecular_weight',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  calculatedWetMolecularWeight: number;

  @Column({
    name: 'avg_vel_wo_wall',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  averageVelocityWithoutWallEffects: number;

  @Column({
    name: 'calc_avg_vel_wo_wall',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  calculatedAverageVelocityWithoutWallEffects: number;

  @Column({
    name: 'avg_vel_w_wall',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  averageVelocityWithWallEffects: number;

  @Column({
    name: 'calc_avg_vel_w_wall',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  calculatedAverageVelocityWithWallEffects: number;

  @Column({
    name: 'calc_waf',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  calculatedWAF: number;

  @Column({
    name: 'calc_calc_waf',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
  })
  calculatedCalculatedWAF: number;

  @Column({
    name: 'avg_stack_flow_rate',
    transformer: new NumericColumnTransformer(),
    type: 'numeric',
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
