import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
  name: 'camdecmpswks.vw_qa_test_summary_review_and_submit',
})
export class TestSummaryReviewAndSubmit {
  @ViewColumn({
    name: 'oris_code',
  })
  orisCd: number;

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
    name: 'test_info',
  })
  testInfo: string;

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
  updateDate: string;

  @ViewColumn({
    name: 'eval_status_cd',
  })
  evalStatusCd: string;

  @ViewColumn({
    name: 'submission_availability_cd',
  })
  submissionCd: string;
}
