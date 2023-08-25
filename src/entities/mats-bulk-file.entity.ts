import {
  BaseEntity,
  Column,
  Entity,
  PrimaryColumn,
  ViewColumn,
  ViewEntity,
} from 'typeorm';

import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';

@ViewEntity({ name: 'camdecmpswks.vw_mats_bulk_file_eval_and_submit' })
export class MatsBulkFile extends BaseEntity {
  @ViewColumn({
    name: 'oris_code',
    transformer: new NumericColumnTransformer(),
  })
  orisCode: number;

  @ViewColumn({ name: 'facility_name' })
  facilityName: string;

  @ViewColumn({ name: 'mon_plan_id' })
  monPlanIdentifier: string;

  @ViewColumn({ name: 'location_info' })
  locationInfo: string;

  @ViewColumn({ name: 'mats_bulk_file_id' })
  matsBulkFileIdentifier: any;

  @ViewColumn({ name: 'mon_loc_id' })
  monLOCIdentifier: string;

  @ViewColumn({ name: 'system_component_identifier' })
  systemComponentIdentifier: string;

  @ViewColumn({ name: 'userid' })
  userid: string;

  @ViewColumn({ name: 'update_date' })
  updateDate: string;

  @ViewColumn({ name: 'submission_availability_cd' })
  submissionAvailabilityCode: string;

  @ViewColumn({ name: 'submission_availability_cd_description' })
  submissionAvailabilityCodeDescription: string;

  @ViewColumn({ name: 'test_num' })
  testNumber: string;

  @ViewColumn({ name: 'filename' })
  filename: string;

  @ViewColumn({ name: 'updated_status_flg' })
  updatedStatusFLG: string;
}
