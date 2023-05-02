import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
  name: 'camdecmpswks.vw_test_summary_eval_and_submit',
})
export class TestSummaryReviewAndSubmit {
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

  @ViewColumn({
    name: 'eval_status_cd',
  })
  evalStatusCode: string;

  @ViewColumn({
    name: 'submission_availability_cd',
  })
  submissionCode: string;

  @ViewColumn({
    name: 'period_abbreviation',
  })
  periodAbbreviation: string;
}
