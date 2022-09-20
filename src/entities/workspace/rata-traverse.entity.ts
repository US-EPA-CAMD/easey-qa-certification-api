import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';
import { FlowRataRun } from './flow-rata-run.entity';

@Entity({ name: 'camdecmpswks.rata_traverse' })
export class RataTraverse extends BaseEntity {
  @PrimaryColumn({
    type: 'varchar',
    name: 'rata_traverse_id',
  })
  id: string;

  @Column({
    type: 'varchar',
    name: 'flow_rata_run_id',
  })
  flowRataRunId: string;

  @Column({
    type: 'varchar',
    name: 'probeid',
  })
  probeId: string;

  @Column({
    type: 'varchar',
    name: 'probe_type_cd',
  })
  probeTypeCode: string;

  @Column({
    type: 'varchar',
    name: 'pressure_meas_cd',
  })
  pressureMeasureCode: string;

  @Column({
    type: 'varchar',
    name: 'method_traverse_point_id',
  })
  methodTraversePointId: string;

  @Column({
    type: 'numeric',
    transformer: new NumericColumnTransformer(),
    name: 'vel_cal_coef',
  })
  velocityCalibrationCoefficient: number;

  @Column({
    type: 'numeric',
    transformer: new NumericColumnTransformer(),
    name: 'last_probe_date',
  })
  lastProbeDate: Date;

  @Column({
    type: 'numeric',
    transformer: new NumericColumnTransformer(),
    name: 'avg_vel_diff_pressure',
  })
  avgVelDiffPressure: number;

  @Column({
    type: 'numeric',
    transformer: new NumericColumnTransformer(),
    name: 'avg_sq_vel_diff_pressure',
  })
  avgSquareVelDiffPressure: number;

  @Column({
    type: 'numeric',
    transformer: new NumericColumnTransformer(),
    name: 't_stack_temp',
  })
  tStackTemperature: number;

  @Column({
    type: 'numeric',
    transformer: new NumericColumnTransformer(),
    name: 'point_used_ind',
  })
  pointUsedIndicator: number;

  @Column({
    type: 'numeric',
    transformer: new NumericColumnTransformer(),
    name: 'num_wall_effects_points',
  })
  numberWallEffectsPoints: number;

  @Column({
    type: 'numeric',
    transformer: new NumericColumnTransformer(),
    name: 'yaw_angle',
  })
  yawAngle: number;

  @Column({
    type: 'numeric',
    transformer: new NumericColumnTransformer(),
    name: 'pitch_angle',
  })
  pitchAngle: number;

  @Column({
    type: 'numeric',
    transformer: new NumericColumnTransformer(),
    name: 'calc_vel',
  })
  calculatedVelocity: number;

  @Column({
    type: 'numeric',
    transformer: new NumericColumnTransformer(),
    name: 'rep_vel',
  })
  replacementVelocity: number;

  @Column({
    type: 'numeric',
    transformer: new NumericColumnTransformer(),
    name: 'calc_calc_vel',
  })
  calculatedCalculatedVelocity: number;

  @Column({
    type: 'varchar',
    name: 'userid',
  })
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
    () => FlowRataRun,
    fr => fr.RataTraverses,
  )
  @JoinColumn({ name: 'flow_rata_run_id' })
  FlowRataRun: FlowRataRun;
}
