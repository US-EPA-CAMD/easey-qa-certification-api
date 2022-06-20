import { Injectable } from '@nestjs/common';

import { Logger } from '@us-epa-camd/easey-common/logger';

import {
  QACertificationDTO,
  QACertificationImportDTO,
} from '../dto/qa-certification.dto';

import { LocationIdentifiers } from './../interfaces/location-identifiers.interface';
import { QACertificationParamsDTO } from '../dto/qa-certification-params.dto';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';

@Injectable()
export class QACertificationWorkspaceService {
  constructor(
    private readonly logger: Logger,
    private readonly testSummaryService: TestSummaryWorkspaceService,
  ) {}

  async export(
    params: QACertificationParamsDTO,
  ): Promise<QACertificationDTO> {
    const promises = [];

    const SUMMARIES = 0;
    promises.push(
      this.testSummaryService.export(
        params.facilityId,
        params.unitIds,
        params.stackPipeIds,
      )
    );

    const EVENTS = SUMMARIES + 1;
    const EXT_EXEMPTIONS = EVENTS + 1;

    const results = await Promise.all(promises);

    return {
      orisCode: params.facilityId,
      testSummaryData: results[SUMMARIES],
      certificationEventData: results[EVENTS],
      testExtensionExemptionData: results[EXT_EXEMPTIONS],
    };
  }

  async import(
    locations: LocationIdentifiers[],
    payload: QACertificationImportDTO,
    userId: string,
  ): Promise<void> {
    this.logger.info(`Importing QA Certification data for Facility Id/Oris Code [${payload.orisCode}]`);

    const promises = [];
    payload.testSummaryData.forEach(summary => {
      promises.push(
        new Promise(async (resolve, _reject) => {
          const locationId = locations.find(i => {
            return i.unitId === summary.unitId &&
              i.stackPipeId === summary.stackPipeId
          }).locationId;

          const results = this.testSummaryService.import(locationId, summary, userId)

          resolve(results);
        }),
      );
    });

    await Promise.all(promises);
  }
}
