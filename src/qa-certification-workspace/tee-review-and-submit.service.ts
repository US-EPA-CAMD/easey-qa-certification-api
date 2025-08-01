import { HttpStatus, Injectable } from '@nestjs/common';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { EntityManager, In } from 'typeorm';

import { TeeReviewAndSubmitDTO } from '../dto/tee-review-and-submit.dto';
import { TeeReviewAndSubmitMap } from '../maps/tee-review-and-submit.map';
import { TeeReviewAndSubmitGlobalRepository } from './tee-review-and-submit-global.repository';
import { TeeReviewAndSubmitRepository } from './tee-review-and-submit.repository';

@Injectable()
export class TeeReviewAndSubmitService {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly workspaceRepository: TeeReviewAndSubmitRepository,
    private readonly globalRepository: TeeReviewAndSubmitGlobalRepository,

    private readonly map: TeeReviewAndSubmitMap,
  ) {}

  returnManager(): any {
    return this.entityManager;
  }

  async getTeeRecords(
    orisCodes: number[],
    monPlanIds: string[],
    quarters: string[],
    isWorkspace: boolean = true,
  ): Promise<TeeReviewAndSubmitDTO[]> {
    const filteredDates = [];

    let repository;
    if (isWorkspace) {
      repository = this.workspaceRepository;
    } else {
      repository = this.globalRepository;
    }

    let data: TeeReviewAndSubmitDTO[];
    try {
      if (monPlanIds && monPlanIds.length > 0) {
        data = await this.map.many(
          await repository.find({ where: { monPlanId: In(monPlanIds) } }),
        );
      } else {
        data = await this.map.many(
          await repository.find({ where: { orisCode: In(orisCodes) } }),
        );
      }

      // Deduplicate records based on business keys
      data = this.deduplicateTeeRecords(data);

      if (quarters && quarters.length > 0) {
        data = data.filter(f => quarters.includes(f.periodAbbreviation));
      }

      if (data.length > 0 && isWorkspace) {
        const testExtensionExemptionIdentifiers = data.map(d => d.testExtensionExemptionIdentifier);

        const severities = await this.entityManager.query(
             `select t.test_extension_exemption_id, sc.severity_cd_description, sc.severity_cd from camdecmpswks.test_extension_exemption t
              JOIN camdecmpswks.check_session cs on cs.chk_session_id = t.chk_session_id
              JOIN camdecmpsmd.severity_code sc on sc.severity_cd = cs.severity_cd
              where t.test_extension_exemption_id =  ANY($1);`,
        [testExtensionExemptionIdentifiers],
        );
        
        const severityMap:Map<string, {description:string,severityCode:string}> = new Map(
          severities.map((s: any) => [s.test_extension_exemption_id, { description: s.severity_cd_description, severityCode: s.severity_cd }])
        );

        for (const d of data) {
          let {description, severityCode} = severityMap.get(d.testExtensionExemptionIdentifier) ?? {};
          d.severityDescription = description
          d.severityCode = severityCode
        }
      }

      return data;
    } catch (e) {
      throw new EaseyException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private deduplicateTeeRecords(data: TeeReviewAndSubmitDTO[]):
    TeeReviewAndSubmitDTO[] {
    const uniqueRecords = new Map<string, TeeReviewAndSubmitDTO>();

    for (const record of data) {
      // Business key: oris_code + location_info + system_component_id +calendar_year + quarter
      const businessKey = `${record.orisCode}_${record.locationInfo}_${record.systemComponentIdentifier}_${record.periodAbbreviation}`;

      if (!uniqueRecords.has(businessKey)) {
        uniqueRecords.set(businessKey, record);
      } else {
        // If duplicate found, keep the record with the most recent monPlanId (highest value)
        const existing = uniqueRecords.get(businessKey);
        if (record.monPlanId > existing.monPlanId) {
          uniqueRecords.set(businessKey, record);
        }
      }
    }

    // Sort by period_abbreviation DESC (year/qtr DESC)
    return Array.from(uniqueRecords.values()).sort((a, b) => {
      return b.periodAbbreviation.localeCompare(a.periodAbbreviation);
    });
  }
}

