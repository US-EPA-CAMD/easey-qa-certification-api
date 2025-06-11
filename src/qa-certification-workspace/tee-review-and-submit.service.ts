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

      if (quarters && quarters.length > 0) {
        data = data.filter(f => quarters.includes(f.periodAbbreviation));
      }

      for (const d of data) {
            const severity = await this.entityManager.query(
             `select sc.severity_cd_description from camdecmpswks.test_extension_exemption t
              JOIN camdecmpswks.check_session cs on cs.chk_session_id = t.chk_session_id
              JOIN camdecmpsmd.severity_code sc on sc.severity_cd = cs.severity_cd
              where t.test_extension_exemption_id = $1;`,
              [d.testExtensionExemptionIdentifier],
            );

        d.severityDescription = severity?.[0]?.severity_cd_description;
      }
      return data;
    } catch (e) {
      throw new EaseyException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
