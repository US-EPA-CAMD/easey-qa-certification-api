import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
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
import { EaseyContentService } from '../qa-certification-easey-content/easey-content.service';
import * as exportUtility from '../utilities/remove-non-reported-values';
import { settlePromises } from '../utilities/constants';

@Injectable()
export class QACertificationWorkspaceService {
    constructor(
        @InjectEntityManager()
        private readonly entityManager: EntityManager,
        private readonly logger: Logger,
        private readonly testSummaryService: TestSummaryWorkspaceService,
        private readonly testExtensionExemptionService: TestExtensionExemptionsWorkspaceService,
        private readonly qaCertEventService: QACertificationEventWorkspaceService,
        private readonly easeyContentService: EaseyContentService,
    ) {}

    /**
     * Export QA certification data
     * @param params Export parameters
     * @param rptValuesOnly Whether to include only reported values
     * @returns QA certification data
     */
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
    const results = await settlePromises(promises, this.logger);

    // Create result object with the correct type structure
    const resultObject: QACertificationDTO = {
      orisCode: Number(params.facilityId),
      testSummaryData: results[SUMMARIES] as any,
      certificationEventData: results[EVENTS] as any,
      testExtensionExemptionData: results[EXT_EXEMPTIONS] as any,
    };

    (resultObject as any).version = version;

    if (rptValuesOnly) {
      await exportUtility.removeNonReportedValues(resultObject);
    }

    return resultObject;
  }

  /**
   * Process import data for a specific data type
   * @param locations Location identifiers
   * @param dataItems Data items to import
   * @param userId User ID
   * @param importFn Import function to call
   * @param qaSupprecords Optional QA supplemental records
   * @param trx Optional transaction entity manager
   * @returns Promise resolving to array of results
   */
  private async processImportData<T>(
    locations: LocationIdentifiers[],
    dataItems: T[],
    userId: string,
    importFn: (locationId: string, item: T, userId: string, suppId?: string, trx?: EntityManager) => Promise<any>,
    qaSupprecords?: QASuppData[],
    trx?: EntityManager,
  ): Promise<any[]> {
    // Early return if no data items
    if (!dataItems?.length) {
      return [];
    }

    // Process all items in parallel and collect errors
    const promises = dataItems.map(async (item: any, idx: number) => {
      // Find matching location
      const location = locations.find(i =>
        i.unitId === item.unitId && i.stackPipeId === item.stackPipeId
      );

      if (!location) {
        throw new Error(`Location not found for unitId ${item.unitId} and stackPipeId ${item.stackPipeId}`);
      }

      // Get supplemental ID if available
      const suppId = qaSupprecords?.[idx]?.testSumId ?? null;

      // Call the import function with transaction entity manager
      return importFn(location.locationId, item, userId, suppId, trx);
    });

    // Use Promise.allSettled to collect all results and errors
    const results = await Promise.allSettled(promises);
    const successResults: any[] = [];
    const errors: Error[] = [];

    // Process the results
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        successResults.push(result.value);
      } else {
        const error = result.reason;
        if (this.logger) {
          this.logger.error(`Error in promise at index ${index}: ${error.message}`);
        }
        errors.push(error);
      }
    });

    // If there were errors, log a summary
    if (errors.length > 0 && this.logger) {
      this.logger.error(`${errors.length} errors occurred while processing promises`);
    }

    // Always rethrow errors in processImportData to ensure they propagate
    if (errors.length > 0) {
      throw errors[0];
    }

    return successResults;
  }

  /**
   * Process test summary data
   * @param locations Location identifiers
   * @param data Test summary data
   * @param userId User ID
   * @param qaSupprecords QA supplemental records
   * @param trx Optional transaction entity manager
   * @returns Promise resolving to array of results
   */
  private async processTestSummaryData(
    locations: LocationIdentifiers[],
    data: any[] | undefined,
    userId: string,
    qaSupprecords: QASuppData[],
    trx?: EntityManager,
  ): Promise<any[]> {
    return this.processImportData(
      locations,
      data || [],
      userId,
      (locationId, item, userId, suppId, trx) =>
        this.testSummaryService.import(locationId, item, userId, suppId, trx),
      qaSupprecords,
      trx,
    );
  }

  /**
   * Process test extension exemption data
   * @param locations Location identifiers
   * @param data Test extension exemption data
   * @param userId User ID
   * @param trx Optional transaction entity manager
   * @returns Promise resolving to array of results
   */
  private async processTestExtensionData(
    locations: LocationIdentifiers[],
    data: any[] | undefined,
    userId: string,
    trx?: EntityManager,
  ): Promise<any[]> {
    return this.processImportData(
      locations,
      data || [],
      userId,
      (locationId, item, userId, suppId, trx) =>
        this.testExtensionExemptionService.import(locationId, item, userId, trx),
      undefined,
      trx,
    );
  }

  /**
   * Process certification event data
   * @param locations Location identifiers
   * @param data Certification event data
   * @param userId User ID
   * @param trx Optional transaction entity manager
   * @returns Promise resolving to array of results
   */
  private async processCertificationEventData(
    locations: LocationIdentifiers[],
    data: any[] | undefined,
    userId: string,
    trx?: EntityManager,
  ): Promise<any[]> {
    return this.processImportData(
      locations,
      data || [],
      userId,
      (locationId, item, userId, suppId, trx) =>
        this.qaCertEventService.import(locationId, item, userId, trx),
      undefined,
      trx,
    );
  }

  /**
   * Import QA certification data
   * @param locations Location identifiers
   * @param payload Import payload
   * @param userId User ID
   * @param qaSupprecords QA supplemental records
   * @param rethrowErrors Optional flag to rethrow errors (useful for testing)
   * @returns Promise resolving to import result
   */
  async import(
    locations: LocationIdentifiers[],
    payload: QACertificationImportDTO,
    userId: string,
    qaSupprecords: QASuppData[],
    rethrowErrors: boolean = false,
  ): Promise<any> {
    this.logger.log(
      `Importing QA Certification data for Facility Id/Oris Code [${payload.orisCode}]`,
    );

    // Use transaction to ensure atomic operations
    return this.entityManager.transaction(async (trx: EntityManager) => {
      try {
        this.logger.log(
          `Starting QA Certification import transaction for Facility Id/Oris Code [${payload.orisCode}]`,
        );

        // Process all data types in parallel and collect errors
        const promises = [
          this.processTestSummaryData(locations, payload.testSummaryData, userId, qaSupprecords, trx),
          this.processTestExtensionData(locations, payload.testExtensionExemptionData, userId, trx),
          this.processCertificationEventData(locations, payload.certificationEventData, userId, trx),
        ];

        // Use Promise.allSettled to collect all results and errors
        const results = await Promise.allSettled(promises);
        const errors: Error[] = [];

        // Process the results
        results.forEach((result, index) => {
          if (result.status === 'rejected') {
            const error = result.reason;
            if (this.logger) {
              this.logger.error(`Error in promise at index ${index}: ${error.message}`);
            }
            errors.push(error);
          }
        });

        // If there were errors, log a summary
        if (errors.length > 0 && this.logger) {
          this.logger.error(`${errors.length} errors occurred while processing promises`);
        }

        // If rethrowErrors is true and there are errors, throw the first one
        if (rethrowErrors && errors.length > 0) {
          throw errors[0];
        }

        this.logger.log(
          `Successfully completed QA Certification import transaction for Facility Id/Oris Code [${payload.orisCode}]`,
        );

        return {
          message: `Successfully Imported QA Certification Data for Facility Id/Oris Code [${payload.orisCode}]`,
        };
      } catch (error) {
        this.logger.error(
          `Error in QA Certification import transaction for Facility Id/Oris Code [${payload.orisCode}]: ${error.message}`,
        );
        throw error; // Transaction will automatically rollback
      }
    });
  }
}
