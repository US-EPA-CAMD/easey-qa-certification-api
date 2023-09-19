import { BaseEntity, ViewColumn, ViewEntity } from 'typeorm';

import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';

@ViewEntity({
  name: 'camdecmps.vw_test_extension_exemption_eval_and_submit',
})
export class TeeReviewAndSubmitGlobal extends BaseEntity {
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

  @ViewColumn({ name: 'test_extension_exemption_id' })
  testExtensionExemptionIdentifier: string;

  @ViewColumn({ name: 'extens_exempt_cd' })
  extensExemptCode: string;

  @ViewColumn({ name: 'mon_loc_id' })
  monLocIdentifier: string;

  @ViewColumn({ name: 'system_component_identifier' })
  systemComponentIdentifier: string;

  @ViewColumn({
    name: 'rpt_period_id',
    transformer: new NumericColumnTransformer(),
  })
  rptPeriodIdentifier: number;

  @ViewColumn({ name: 'userid' })
  userid: string;

  @ViewColumn({ name: 'update_date' })
  updateDate: Date;

  evalStatusCode: string;

  submissionAvailabilityCode: string;

  evalStatusCodeDescription: string;

  submissionAvailabilityCodeDescription: string;

  @ViewColumn({ name: 'period_abbreviation' })
  periodAbbreviation: string;

  @ViewColumn({ name: 'fuel_cd' })
  fuelCode: string;

  @ViewColumn({
    name: 'hours_used',
    transformer: new NumericColumnTransformer(),
  })
  hoursUsed: number;

  @ViewColumn({ name: 'span_scale_cd' })
  spanScaleCode: string;
}
