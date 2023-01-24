import { Injectable } from '@nestjs/common';

import { Logger } from '@us-epa-camd/easey-common/logger';

import {
  QACertificationDTO,
  QACertificationImportDTO,
} from '../dto/qa-certification.dto';

import { LocationIdentifiers } from '../interfaces/location-identifiers.interface';
import { QACertificationParamsDTO } from '../dto/qa-certification-params.dto';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';
import { QASuppData } from '../entities/workspace/qa-supp-data.entity';
import { TestExtensionExemptionsWorkspaceService } from '../test-extension-exemptions-workspace/test-extension-exemptions-workspace.service';
import { QaCertificationEventWorkshopService } from '../qa-certification-event-workshop/qa-certification-event-workshop.service';

@Injectable()
export class QACertificationWorkspaceService {
  constructor(
    private readonly logger: Logger,
    private readonly testSummaryService: TestSummaryWorkspaceService,
    private readonly testExtensionExemptionService: TestExtensionExemptionsWorkspaceService,
    private readonly qaCertEventService: QaCertificationEventWorkshopService,
  ) {}

  async export(params: QACertificationParamsDTO): Promise<QACertificationDTO> {
    const promises = [];

    const SUMMARIES = 0;
    promises.push(
      this.testSummaryService.export(
        params.facilityId,
        params.unitIds,
        params.stackPipeIds,
        params.testSummaryIds,
        params.testTypeCodes,
        params.beginDate,
        params.endDate,
      ),
    );

    const EVENTS = SUMMARIES + 1;
    promises.push(
      this.qaCertEventService.export(
        params.facilityId,
        params.unitIds,
        params.stackPipeIds,
        params.qaCertificationEventIds,
      ),
    );
    const EXT_EXEMPTIONS = EVENTS + 1;
    promises.push(
      this.testExtensionExemptionService.export(
        params.facilityId,
        params.unitIds,
        params.stackPipeIds,
        params.qaTestExtensionExemptionIds,
      ),
    );

    const results = await Promise.all(promises);

    return {
      orisCode: Number(params.facilityId),
      testSummaryData: results[SUMMARIES],
      certificationEventData: results[EVENTS],
      testExtensionExemptionData: results[EXT_EXEMPTIONS],
    };
  }

  async import(
    locations: LocationIdentifiers[],
    payload: QACertificationImportDTO,
    userId: string,
    qaSupprecords: QASuppData[],
  ): Promise<any> {
    this.logger.info(
      `Importing QA Certification data for Facility Id/Oris Code [${payload.orisCode}]`,
    );

    const promises = [];
    payload.testSummaryData.forEach((summary, idx) => {
      promises.push(
        new Promise(async (resolve, _reject) => {
          const locationId = locations.find(i => {
            return (
              i.unitId === summary.unitId &&
              i.stackPipeId === summary.stackPipeId
            );
          }).locationId;

          const results = this.testSummaryService.import(
            locationId,
            summary,
            userId,
            qaSupprecords[idx] !== undefined
              ? qaSupprecords[idx]?.testSumId
              : null,
          );

          resolve(results);
        }),
      );
    });

    await Promise.all(promises);

    return {
      message: `Successfully Imported QA Certification Data for Facility Id/Oris Code [${payload.orisCode}]`,
    };
  }
}
