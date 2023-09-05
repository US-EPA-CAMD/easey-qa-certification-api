import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

import { NumericColumnTransformer } from '@us-epa-camd/easey-common/transforms';

@Entity({ name: 'camdecmpswks.mats_bulk_file' })
export class MatsBulkFile extends BaseEntity {
  @PrimaryColumn({ name: 'mats_bulk_file_id' })
  matsBulkFileIdentifier: number;

  @Column({
    name: 'fac_id',
    type: 'numeric',
    transformer: new NumericColumnTransformer(),
  })
  facIdentifier: number;

  @Column({
    name: 'oris_code',
    type: 'numeric',
    transformer: new NumericColumnTransformer(),
  })
  orisCode: number;

  @Column({ name: 'location' })
  location: string;

  @Column({ name: 'test_type_code' })
  testTypeCode: string;

  @Column({ name: 'test_type_code_description' })
  testTypeCodeDescription: string;

  @Column({ name: 'facility_name' })
  facilityName: string;

  @Column({ name: 'mon_plan_id' })
  monPlanIdentifier: string;

  @Column({ name: 'test_num' })
  testNumber: string;

  @Column({ name: 'filename' })
  filename: string;

  @Column({ name: 'last_updated' })
  lastUpdated: string;

  @Column({ name: 'updated_status_flg' })
  updatedStatusFLG: string;

  @Column({
    name: 'submission_id',
    type: 'numeric',
    transformer: new NumericColumnTransformer(),
  })
  submissionIdentifier: number;

  @Column({ name: 'submission_availability_cd' })
  submissionAvailabilityCode: string;

  @Column({ name: 'userid' })
  userid: string;

  @Column({ name: 'add_date' })
  addDate: string;

  @Column({ name: 'bucket_location' })
  bucketLocation: string;
}
