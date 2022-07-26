import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
  name: 'camdecmpsmd.vw_test_summary_master_data_relationships',
})
export class TestSummaryMasterDataRelationship {
  @ViewColumn({
    name: 'test_type_code',
  })
  testTypeCode: string;

  @ViewColumn({
    name: 'test_reason_code',
  })
  testReasonCode: string;

  @ViewColumn({
    name: 'test_result_code',
  })
  testResultCode: string;

  @ViewColumn({
    name: 'gas_level_code',
  })
  gasLevelCode: string;
}
