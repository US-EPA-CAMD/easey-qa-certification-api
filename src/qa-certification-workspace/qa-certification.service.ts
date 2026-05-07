import { Injectable, BadRequestException } from '@nestjs/common';
import { EntityManager } from 'typeorm';

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
import { buildQaSuppKey } from './qa-certification-checks.service';

@Injectable()
export class QACertificationWorkspaceService {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly logger: Logger,
    private readonly testSummaryService: TestSummaryWorkspaceService,
    private readonly testExtensionExemptionService: TestExtensionExemptionsWorkspaceService,
    private readonly qaCertEventService: QACertificationEventWorkspaceService,
    private readonly easeyContentService: EaseyContentService,
  ) {}

  // Shared location lookup with priority-based matching (stackPipeId preferred)
  private findLocationByIdentifiers(
    locations: LocationIdentifiers[],
    identifiers: { unitId?: string; stackPipeId?: string }
  ): LocationIdentifiers | undefined {
    return locations.find(i => {
      if (identifiers.stackPipeId) {
        // Always prefer stackPipeId when present (matches checks.service.ts logic)
        return i.stackPipeId === identifiers.stackPipeId;
      } else if (identifiers.unitId) {
        // Only use unitId if no stackPipeId provided
        return i.unitId === identifiers.unitId;
      }
      return false;
    });
  }

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
    const results = {version, ...(await Promise.all(promises))};

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
    qaSuppByKey: Map<string, QASuppData>,
  ): Promise<any> {
    return await this.entityManager.transaction(async (trx: EntityManager) => {
    this.logger.log(
      `Importing QA Certification data for Facility Id/Oris Code [${payload.orisCode}]`,
    );

    const promises = [];
    payload.testSummaryData?.forEach((summary) => {
      promises.push(
        new Promise((resolve, _reject) => {
          //Use shared location lookup with priority-based matching
          const location = this.findLocationByIdentifiers(locations, summary);

          if (!location) {
            throw new BadRequestException(
              `Location not found for unitId: ${summary.unitId}, stackPipeId: ${summary.stackPipeId}`
            );
          }
          const locationId = location.locationId;

          // Look up the historical testSumId by this summary's natural identity
          // (locationId + testTypeCode + testNumber). Issue #7182.
          const historicalRecord = qaSuppByKey.get(
            buildQaSuppKey(
              locationId,
              summary.testTypeCode,
              summary.testNumber,
            ),
          );

          const results = this.testSummaryService.import(
            locationId,
            summary,
            userId,
            historicalRecord ? historicalRecord.testSumId : null,
            trx,
          );

          resolve(results);
        }),
      );
    });

    payload.testExtensionExemptionData?.forEach(
      (qaTestExtensionExemptionId, idx) => {
        promises.push(
          new Promise((resolve, _reject) => {
            // Use shared location lookup with priority-based matching
            const location = this.findLocationByIdentifiers(locations, qaTestExtensionExemptionId);

            if (!location) {
              throw new BadRequestException(
                `Location not found for unitId: ${qaTestExtensionExemptionId.unitId}, stackPipeId: ${qaTestExtensionExemptionId.stackPipeId}`
              );
            }
            const locationId = location.locationId;

            const results = this.testExtensionExemptionService.import(
              locationId,
              qaTestExtensionExemptionId,
              userId,
                trx,
            );
            resolve(results);
          }),
        );
      },
    );
    payload.certificationEventData?.forEach((qaCertEvent, idx) => {
      promises.push(
        new Promise((resolve, _reject) => {
          // Use shared location lookup with priority-based matching
          const location = this.findLocationByIdentifiers(locations, qaCertEvent);

          if (!location) {
            throw new BadRequestException(
              `Location not found for unitId: ${qaCertEvent.unitId}, stackPipeId: ${qaCertEvent.stackPipeId}`
            );
          }
          const locationId = location.locationId;

          const results = this.qaCertEventService.import(
            locationId,
            qaCertEvent,
            userId,
              trx,
          );

          resolve(results);
        }),
      );
    });

      const results = await Promise.allSettled(promises);

      // Check for any rejected promises
      const errors = results
        .filter(result => result.status === 'rejected')
        .map(result => (result as PromiseRejectedResult).reason);

      // If any errors occurred, throw the first one to trigger transaction rollback
      if (errors.length > 0) {
        throw errors[0];
      }

    return {
      message: `Successfully Imported QA Certification Data for Facility Id/Oris Code [${payload.orisCode}]`,
    };
    });
  }
}
