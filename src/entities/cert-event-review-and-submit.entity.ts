import { BaseEntity, ViewEntity, ViewColumn } from 'typeorm';

import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';

@ViewEntity({ name: 'camdecmps.vw_qa_cert_event_eval_and_submit' })
export class CertEventReviewAndSubmitGlobal extends BaseEntity {
  @ViewColumn({
    name: 'oris_code',
    transformer: new NumericColumnTransformer(),
  })
  orisCode: number;

  @ViewColumn({ name: 'facility_name' })
  facilityName: string;

  @ViewColumn({ name: 'mon_plan_id' })
  monPlanId: string;

  @ViewColumn({ name: 'location_info' })
  locationInfo: string;

  @ViewColumn({ name: 'qa_cert_event_id' })
  qaCertEventIdentifier: string;

  @ViewColumn({ name: 'qa_cert_event_cd' })
  qaCertEventCode: string;

  @ViewColumn({ name: 'mon_loc_id' })
  monLocIdentifier: string;

  @ViewColumn({ name: 'system_component_identifier' })
  systemComponentIdentifier: string;

  @ViewColumn({ name: 'event_date' })
  eventDate: string;

  @ViewColumn({ name: 'required_test_cd' })
  requiredTestCode: string;

  @ViewColumn({ name: 'condition_date' })
  conditionDate: string;

  @ViewColumn({ name: 'last_completion' })
  lastCompletion: string;

  @ViewColumn({ name: 'userid' })
  userid: string;

  @ViewColumn({ name: 'update_date' })
  updateDate: Date;

  evalStatusCode: string;

  evalStatusCodeDescription: string;

  submissionAvailabilityCode: string;

  submissionAvailabilityCodeDescription: string;
}
