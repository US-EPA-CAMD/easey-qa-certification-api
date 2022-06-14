import { BadRequestException, Injectable } from '@nestjs/common';

import { Logger } from '@us-epa-camd/easey-common/logger';

import { QACertificationImportDTO } from '../dto/qa-certification.dto';
import { LocationIdentifiers } from '../interfaces/location-identifiers.interface';
import { LocationWorkspaceService } from '../location-workspace/location.service';
import { TestSummaryWorkspaceService } from '../test-summary-workspace/test-summary.service';

@Injectable()
export class ImportChecksService {
  constructor(
    private readonly logger: Logger,
    private readonly locationService: LocationWorkspaceService,
    private readonly testSummaryService: TestSummaryWorkspaceService,
  ) {}

  private checkIfThrows(errorList: string[]) {
    if (errorList.length > 0) {
      this.logger.error(BadRequestException, errorList, true);
    }
  }

  public async importChecks(payload: QACertificationImportDTO) {
    this.logger.info('Running all import checks');
    const locations: LocationIdentifiers[] = [];
    let errorList: string[] = [];

    const addLocation = (i: any) => {
      const systemIds = [];
      const componentIds = [];

      const location = locations.find(l => {
        if ((l.unitId && l.unitId === i.unitId) ||
            (l.stackPipeId && l.stackPipeId === i.stackPipeId))
          return l;
      });

      if (location) {
        if (i.monitoringSystemId && !location.systemIds.includes(i.monitoringSystemId)) {
          location.systemIds.push(i.monitoringSystemId);
        }
        if (i.componentId && !location.componentIds.includes(i.componentId)) {
          location.componentIds.push(i.componentId);
        }
      }
      else {
        if (i.monitoringSystemId) systemIds.push(i.monitoringSystemId);
        if (i.componentId) componentIds.push(i.componentId);

        locations.push({
          unitId: i.unitId,
          stackPipeId: i.stackPipeId,
          systemIds,
          componentIds,
        });
      }
    };

    if (payload.testSummaryData) {
      payload.testSummaryData.forEach(i => addLocation(i));
    }

    if (payload.certificationEventData) {
      payload.certificationEventData.forEach(i => addLocation(i));
    }
    
    if (payload.testExtensionExemptionData) {
      payload.testExtensionExemptionData.forEach(i => addLocation(i));
    }

    if (locations.length === 0) {
      errorList.push(
        'There are no tests, certifications events, or test extension/exmeption records in the file'
      );
    }
    this.checkIfThrows(errorList);

    // IMPORT-13 - All Locations Present in the Production Database
    // IMPORT-14 - All QA Systems Present in the Production Database
    // IMPORT-15 - All QA Components Present in the Production Database
    errorList.push(...(
      await this.locationService.importChecks(
        payload.orisCode,
        locations
      )
    ));
    this.checkIfThrows(errorList);

    //IMPORT-16 - Inappropriate Children Records for Test Summary
    errorList.push(...(
      await this.testSummaryService.importChecks(
        payload.testSummaryData
      )
    ));
    this.checkIfThrows(errorList);

    this.logger.info('Import validation checks ran successfully');
  }
}
