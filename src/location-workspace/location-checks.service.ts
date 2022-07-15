import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Logger } from '@us-epa-camd/easey-common/logger';

import { LocationWorkspaceRepository } from './location.repository';
import { LocationIdentifiers } from '../interfaces/location-identifiers.interface';

@Injectable()
export class LocationChecksService {
  constructor(
    private readonly logger: Logger,
    @InjectRepository(LocationWorkspaceRepository)
    private readonly repository: LocationWorkspaceRepository,
  ) {}

  async runChecks(
    orisCode: number,
    locations: LocationIdentifiers[],
  ): Promise<[LocationIdentifiers[], string[]]> {
    this.logger.info('Running Unit/Stack Location Checks');

    let errorList = [];
    const stackPipePrefixes = ['CS', 'MS', 'CP', 'MP'];

    const dbLocations = await this.repository.getLocationsByUnitStackPipeIds(
      orisCode,
      locations.filter(i => i.unitId !== null).map(i => i.unitId),
      locations.filter(i => i.stackPipeId !== null).map(i => i.stackPipeId),
    );
    
    console.log("dbLocations")
    console.log(dbLocations)

    locations.forEach(location => {
      let unitStack = '';
      const dbLocation = dbLocations.find(i => (
          (i?.unit?.name === location?.unitId) ||
          (i?.stackPipe?.name === location?.stackPipeId)
      ));

      if (location.unitId) {
        unitStack = `Unit [${location.unitId}]`;

        // IMPORT-13 All Unit Locations Present in the Production Database
        if (
          location.unitId.length >= 2 &&
          stackPipePrefixes.includes(location.unitId.substring(0, 2))
        ) {
          errorList.push(
            `The following Stack/Pipe was misidentified as a unit [${location.unitId}]`,
          );
        } else if (!dbLocation) {
          errorList.push(
            `The database does not contain Unit [${location.unitId}] for Facility [${orisCode}]`,
          );
        }
      }

      // IMPORT-13 All Stack/Pipe Locations Present in the Production Database
      if (location.stackPipeId) {
        unitStack = `Stack/Pipe [${location.stackPipeId}]`;

        if (!dbLocation) {
          errorList.push(
            `The database does not contain Stack/Pipe [${location.stackPipeId}] for Facility [${orisCode}]`,
          );
        }
      }

      if (dbLocation) {
        location.locationId = dbLocation.id;
        const dbSystemIDs = dbLocation.systems.map(i => i.monitoringSystemID);
        const dbComponentIDs = dbLocation.components.map(i => i.componentID);

        // IMPORT-14 All QA Systems Present in the Production Database
        location.systemIDs.forEach(systemId => {
          if (!dbSystemIDs.includes(systemId)) {
            errorList.push(
              `The database does not contain System [${systemId}] for ${unitStack} and Facility [${orisCode}]`,
            );
          }
        });

        // IMPORT-15 All QA Components Present in the Production Database
        location.componentIDs.forEach(componentID => {
          if (!dbComponentIDs.includes(componentID)) {
            errorList.push(
              `The database does not contain Component [${componentID}] for ${unitStack} and Facility [${orisCode}]`,
            );
          }
        });
      }
    });

    this.logger.info('Completed Unit/Stack Location Checks');
    return [locations, errorList];
  }
}
