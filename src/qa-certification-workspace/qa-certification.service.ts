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
import { buildQACertificationExport } from '../utilities/remove-non-reported-values';

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
    // Use the shared utility function to build the export data
    return buildQACertificationExport(
      params,
      {
        testSummaryService: this.testSummaryService,
        qaCertEventService: this.qaCertEventService,
        testExtensionExemptionService: this.testExtensionExemptionService,
      },
      this.easeyContentService.QaCertificationSchema?.version,
      rptValuesOnly,
    );
  }

  /**
   * Process import data for a specific data type
   * Refactored to reduce nesting and improve readability
   *
   * @param locations Location identifiers
   * @param dataItems Data items to import
   * @param userId User ID
   * @param importFn Import function to call
   * @param qaSupprecords Optional QA supplemental records
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

    // Process all items in parallel
    return Promise.all(
      dataItems.map(async (item: any, idx: number) => {
        // Find matching location
        const location = locations.find(i =>
          i.unitId === item.unitId && i.stackPipeId === item.stackPipeId
        );

        if (!location) {
          throw new Error(`Location not found for unitId ${item.unitId} and stackPipeId ${item.stackPipeId}`);
        }

        // Get supplemental ID if available
        const suppId = qaSupprecords && qaSupprecords[idx]
          ? qaSupprecords[idx].testSumId
          : null;

        // Call the import function with transaction entity manager
        return importFn(location.locationId, item, userId, suppId, trx);
      })
    );
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
   * Refactored to reduce nesting and improve readability
   *
   * @param locations Location identifiers
   * @param payload Import payload
   * @param userId User ID
   * @param qaSupprecords QA supplemental records
   * @returns Promise resolving to import result
   */
  async import(
    locations: LocationIdentifiers[],
    payload: QACertificationImportDTO,
    userId: string,
    qaSupprecords: QASuppData[],
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

        // Process all data types in parallel
        await Promise.all([
          this.processTestSummaryData(locations, payload.testSummaryData, userId, qaSupprecords, trx),
          this.processTestExtensionData(locations, payload.testExtensionExemptionData, userId, trx),
          this.processCertificationEventData(locations, payload.certificationEventData, userId, trx),
        ]);

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