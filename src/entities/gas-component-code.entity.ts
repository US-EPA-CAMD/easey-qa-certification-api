import { Column, Entity, PrimaryColumn } from 'typeorm';
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';

@Entity({ name: 'camdecmpsmd.vw_gas_component_code' })
export class GasComponentCode {
  @PrimaryColumn({
    name: 'code',
  })
  gasComponentCode: string;

  @Column({
    name: 'description',
  })
  gasComponentCodeDescription: string;

  @Column({
    name: 'can_combine_ind',
    transformer: new NumericColumnTransformer(),
  })
  canCombineIndicator: number;

  @Column({
    name: 'balance_component_ind',
    transformer: new NumericColumnTransformer(),
  })
  balanceComponentIndicator: number;

  @Column({
    name: 'group_cd',
  })
  groupCode: string;
}
