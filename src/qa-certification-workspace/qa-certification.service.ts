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
import { QACertificationEventWorkspaceService } from '../qa-certification-event-workspace/qa-certification-event-workspace.service';
import { removeNonReportedValues } from '../utilities/remove-non-reported-values';
import { EaseyContentService } from '../qa-certification-easey-content/easey-content.service';

@Injectable()
export class QACertificationWorkspaceService {
  constructor(
    private readonly logger: Logger,
    private readonly testSummaryService: TestSummaryWorkspaceService,
    private readonly testExtensionExemptionService: TestExtensionExemptionsWorkspaceService,
    private readonly qaCertEventService: QACertificationEventWorkspaceService,
    private readonly easeyContentService: EaseyContentService,
  ) {}

  async export(
    params: QACertificationParamsDTO,
    rptValuesOnly: boolean = false,
  ): Promise<QACertificationDTO> {
    const promises = [];

    const SUMMARIES = 0;
    promises.push(
      params.testSummaryIds ||
        (!params.testSummaryIds &&
          !params.qaCertificationEventIds &&
          !params.qaTestExtensionExemptionIds)
        ? this.testSummaryService.export(
            params.facilityId,
            params.unitIds,
            params.stackPipeIds,
            params.testSummaryIds,
            params.testTypeCodes,
            params.beginDate,
            params.endDate,
          )
        : [],
    );

    const EVENTS = SUMMARIES + 1;
    promises.push(
      params.qaCertificationEventIds ||
        (!params.testSummaryIds &&
          !params.qaCertificationEventIds &&
          !params.qaTestExtensionExemptionIds)
        ? this.qaCertEventService.export(
            params.facilityId,
            params.unitIds,
            params.stackPipeIds,
            params.qaCertificationEventIds,
            params.beginDate,
            params.endDate,
          )
        : [],
    );

    const EXT_EXEMPTIONS = EVENTS + 1;
    promises.push(
      params.qaTestExtensionExemptionIds ||
        (!params.testSummaryIds &&
          !params.qaCertificationEventIds &&
          !params.qaTestExtensionExemptionIds)
        ? this.testExtensionExemptionService.export(
            params.facilityId,
            params.unitIds,
            params.stackPipeIds,
            params.qaTestExtensionExemptionIds,
            params.beginDate,
            params.endDate,
          )
        : [],
    );

    const version = this.easeyContentService.QaCertificationSchema?.version;
    const results = {version, ...await Promise.all(promises)};

    const resultObject = {
      version,
      orisCode: Number(params.facilityId),
      testSummaryData: results[SUMMARIES],
      certificationEventData: results[EVENTS],
      testExtensionExemptionData: results[EXT_EXEMPTIONS],
    };

    if (rptValuesOnly) {
      await removeNonReportedValues(resultObject);
    }

    return resultObject;
  }

  async import(
    locations: LocationIdentifiers[],
    payload: QACertificationImportDTO,
    userId: string,
    qaSupprecords: QASuppData[],
  ): Promise<any> {
    this.logger.log(
      `Importing QA Certification data for Facility Id/Oris Code [${payload.orisCode}]`,
    );

    const promises = [];
    payload.testSummaryData?.forEach((summary, idx) => {
      promises.push(
        new Promise((resolve, _reject) => {
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
            qaSupprecords[idx] ? qaSupprecords[idx].testSumId : null,
          );

          resolve(results);
        }),
      );
    });

    payload.testExtensionExemptionData?.forEach(
      (qaTestExtensionExemptionId, idx) => {
        promises.push(
          new Promise((resolve, _reject) => {
            const locationId = locations.find(i => {
              return (
                i.unitId === qaTestExtensionExemptionId.unitId &&
                i.stackPipeId === qaTestExtensionExemptionId.stackPipeId
              );
            }).locationId;

            const results = this.testExtensionExemptionService.import(
              locationId,
              qaTestExtensionExemptionId,
              userId,
            );
            resolve(results);
          }),
        );
      },
    );
    payload.certificationEventData?.forEach((qaCertEvent, idx) => {
      promises.push(
        new Promise((resolve, _reject) => {
          const locationId = locations.find(i => {
            return (
              i.unitId === qaCertEvent.unitId &&
              i.stackPipeId === qaCertEvent.stackPipeId
            );
          }).locationId;

          const results = this.qaCertEventService.import(
            locationId,
            qaCertEvent,
            userId,
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
