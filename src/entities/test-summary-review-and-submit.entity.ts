import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
  name: 'camdecmps.vw_test_summary_eval_and_submit',
})
export class TestSummaryReviewAndSubmitGlobal {
  @ViewColumn({
    name: 'oris_code',
  })
  orisCode: number;

  @ViewColumn({
    name: 'facility_name',
  })
  facilityName: string;

  @ViewColumn({
    name: 'mon_plan_id',
  })
  monPlanId: string;

  @ViewColumn({
    name: 'location_info',
  })
  locationInfo: string;

  @ViewColumn({
    name: 'system_component_identifier',
  })
  systemComponentId: string;

  @ViewColumn({
    name: 'test_sum_id',
  })
  testSumId: string;

  @ViewColumn({
    name: 'test_type_cd',
  })
  testTypeCode: string;

  @ViewColumn({
    name: 'test_num',
  })
  testNum: string;

  @ViewColumn({
    name: 'begin_date',
  })
  beginDate: string;

  @ViewColumn({
    name: 'end_date',
  })
  endDate: string;

  @ViewColumn({
    name: 'userid',
  })
  userId: string;

  @ViewColumn({
    name: 'update_date',
  })
  updateDate: Date;

  evalStatusCode: string;

  evalStatusCodeDescription: string;

  submissionAvailabilityCodeDescription: string;

  submissionCode: string;

  @ViewColumn({
    name: 'period_abbreviation',
  })
  periodAbbreviation: string;
}
