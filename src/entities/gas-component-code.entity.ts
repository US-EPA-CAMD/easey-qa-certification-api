import { Column, Entity, PrimaryColumn } from 'typeorm';
import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';

@Entity({ name: 'camdecmpsmd.gas_component_code' })
export class GasComponentCode {
  @PrimaryColumn({
    name: 'gas_component_cd',
  })
  gasComponentCode: string;

  @Column({
    name: 'gas_component_description',
  })
  gasComponentCodeDescription: string;

  @PrimaryColumn({
    name: 'can_combine_ind',
    transformer: new NumericColumnTransformer(),
  })
  canCombineIndicator: number;

  @Column({
    name: 'balance_component_ind',
    transformer: new NumericColumnTransformer(),
  })
  balanceComponentIndicator: number;
}