import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'camdecmpsmd.extension_exemption_code' })
export class ExtensionExemptionCode extends BaseEntity {
  @PrimaryColumn({
    name: 'extens_exempt_cd',
  })
  extensionExemptionCode: string;

  @Column({
    name: 'extens_exempt_cd_description',
  })
  extensionExemptionCodeDescription: string;
}
