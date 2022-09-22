import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'camdecmpsmd.run_status_code' })
export class RunStatusCode extends BaseEntity {
  @PrimaryColumn({
    type: 'varchar',
    name: 'run_status_cd',
  })
  runStatusCode: string;

  @Column({
    type: 'varchar',
    name: 'run_status_description',
  })
  runStatusDescription: string;
}
