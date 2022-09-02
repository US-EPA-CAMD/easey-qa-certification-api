import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Logger } from '@us-epa-camd/easey-common/logger';
import { CheckCatalogService } from '@us-epa-camd/easey-common/check-catalog';

import { LocationWorkspaceRepository } from './location.repository';
import { LocationIdentifiers } from '../interfaces/location-identifiers.interface';
import { QACertificationImportDTO } from 'src/dto/qa-certification.dto';

@Injectable()
export class LocationChecksService {
  constructor(
    private readonly logger: Logger,
    @InjectRepository(LocationWorkspaceRepository)
    private readonly repository: LocationWorkspaceRepository,
  ) {}

  processLocations(payload: QACertificationImportDTO): LocationIdentifiers[] {
    const locations: LocationIdentifiers[] = [];

    const addLocation = (i: any) => {
      const systemIDs = [];
      const componentIDs = [];

      const location = locations.find(
        l => l?.unitId === i?.unitId || l?.stackPipeId === i?.stackPipeId,
      );

      if (location) {
        if (
          i.monitoringSystemID &&
          !location.systemIDs.includes(i.monitoringSystemID)
        ) {
          location.systemIDs.push(i.monitoringSystemID);
        }
        if (i.componentID && !location.componentIDs.includes(i.componentID)) {
          location.componentIDs.push(i.componentID);
        }
      } else {
        if (i.monitoringSystemID) {
          systemIDs.push(i.monitoringSystemID);
        }
        if (i.componentID) {
          componentIDs.push(i.componentID);
        }

        locations.push({
          unitId: i.unitId,
          locationId: null,
          stackPipeId: i.stackPipeId,
          systemIDs,
          componentIDs,
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

    return locations;
  }

  async runChecks(
    payload: QACertificationImportDTO,
  ): Promise<[LocationIdentifiers[], string[]]> {
    this.logger.info('Running Unit/Stack Location Checks');

    let errorList = [];
    const orisCode = payload.orisCode;
    const stackPipePrefixes = ['CS', 'MS', 'CP', 'MP'];
    const locations: LocationIdentifiers[] = this.processLocations(payload);

    if (locations.length === 0) {
      errorList.push(CheckCatalogService.formatResultMessage('IMPORT-13-A'));
    } else {
      const dbLocations = await this.repository.getLocationsByUnitStackPipeIds(
        orisCode,
        locations.filter(i => i.unitId !== null).map(i => i.unitId),
        locations.filter(i => i.stackPipeId !== null).map(i => i.stackPipeId),
      );

      locations.forEach(location => {
        const dbLocation = dbLocations.find(
          i =>
            i?.unit?.name === location?.unitId ||
            i?.stackPipe?.name === location?.stackPipeId,
        );

        if (location.unitId) {
          if (
            location.unitId.length >= 2 &&
            stackPipePrefixes.includes(location.unitId.substring(0, 2))
          ) {
            // IMPORT-13 All Unit Locations Present in the Production Database (Result C)
            errorList.push(
              CheckCatalogService.formatResultMessage('IMPORT-13-C', {
                invalid: location.unitId,
              }),
            );
          } else if (!dbLocation) {
            // IMPORT-13 All Stack/Pipe Locations Present in the Production Database (Result B)
            errorList.push(
              CheckCatalogService.formatResultMessage('IMPORT-13-B', {
                unitStackID: location.unitId,
              }),
            );
          }
        }

        if (location.stackPipeId) {
          if (!dbLocation) {
            // IMPORT-13 All Stack/Pipe Locations Present in the Production Database (Result B)
            errorList.push(
              CheckCatalogService.formatResultMessage('IMPORT-13-B', {
                unitStackID: location.stackPipeId,
              }),
            );
          }
        }

        if (dbLocation) {
          location.locationId = dbLocation.id;
          const dbSystemIDs = dbLocation.systems.map(i => i.monitoringSystemID);
          const dbComponentIDs = dbLocation.components.map(i => i.componentID);

          location.systemIDs.forEach(systemID => {
            if (!dbSystemIDs.includes(systemID)) {
              // IMPORT-14 All QA Systems Present in the Production Database (Result A)
              errorList.push(
                CheckCatalogService.formatResultMessage('IMPORT-14-A', {
                  systemID,
                }),
              );
            }
          });

          location.componentIDs.forEach(componentID => {
            if (!dbComponentIDs.includes(componentID)) {
              // IMPORT-15 All QA Components Present in the Production Database (Result A)
              errorList.push(
                CheckCatalogService.formatResultMessage('IMPORT-15-A', {
                  componentID,
                }),
              );
            }
          });
        }
      });
    }

    this.logger.info('Completed Unit/Stack Location Checks');
    return [locations, errorList];
  }
}
