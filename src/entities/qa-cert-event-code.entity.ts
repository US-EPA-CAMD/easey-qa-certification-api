import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'camdecmpsmd.qa_cert_event_code' })
export class QACertEventCode extends BaseEntity {
  @PrimaryColumn({
    name: 'qa_cert_event_cd',
  })
  certificationEventCode: string;

  @Column({
    name: 'qa_cert_event_cd_description',
  })
  certificationEventDescription: string;
}
