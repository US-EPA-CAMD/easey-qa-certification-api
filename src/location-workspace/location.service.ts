import { getManager } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Logger } from '@us-epa-camd/easey-common/logger';

import { LocationWorkspaceRepository } from './location.repository';
import { LocationIdentifiers } from '../interfaces/location-identifiers.interface';

@Injectable()
export class LocationWorkspaceService {
  
  constructor(
    private readonly logger: Logger,
    @InjectRepository(LocationWorkspaceRepository)
    private readonly repository: LocationWorkspaceRepository,
  ) {}

  async importChecks(
    orisCode: number,
    locations: LocationIdentifiers[],
  ): Promise<string[]> {
    this.logger.info('Running Location related import checks');

    let errorList = [];
    const mgr = getManager();
    const stackPipePrefixes = ['CS','MS','CP','MP'];

    const dbLocations = await this.repository.getLocationsByUnitStackPipeIds(
      orisCode,
      locations.filter(i => i.unitId !== null).map(i => i.unitId),
      locations.filter(i => i.stackPipeId !== null).map(i => i.stackPipeId),
    );

    locations.forEach(location => {
      let unitStack = '';
      const dbLocation = dbLocations.find(i => {
        if ((i.unit && i.unit.name === location.unitId) ||
          (i.stackPipe && i.stackPipe.name === location.stackPipeId))
          return i;
      });

      if (location.unitId) {
        unitStack = `Unit [${location.unitId}]`;

        if (location.unitId.length >= 2 &&
            stackPipePrefixes.includes(location.unitId.substring(0,2))
        ) {
          errorList.push(
            `[IMPORT-13] The following Stack/Pipe was misidentified as a unit [${location.unitId}]`
          );
        } else if (!dbLocation) {
          errorList.push(
            `[IMPORT-13] The database does not contain Unit [${location.unitId}] for Facility [${orisCode}]`
          );
        }
      }

      if (location.stackPipeId) {
        unitStack = `Stack/Pipe [${location.stackPipeId}]`;

        if (!dbLocation) {
          errorList.push(
            `[IMPORT-13] The database does not contain Stack/Pipe [${location.stackPipeId}] for Facility [${orisCode}]`
          );
        }
      }

      if (dbLocation) {
        const dbSystemIds = dbLocation.systems.map(i => i.monitoringSystemId);
        const dbComponentIds = dbLocation.components.map(i => i.componentId);

        location.systemIds.forEach(systemId => {
          if (!dbSystemIds.includes(systemId)) {
            errorList.push(
              `[IMPORT-14] The database does not contain System [${systemId}] for ${unitStack} and Facility [${orisCode}]`
            );
          }
        });

        location.componentIds.forEach(componentId => {
          if (!dbComponentIds.includes(componentId)) {
            errorList.push(
              `[IMPORT-15] The database does not contain Component [${componentId}] for ${unitStack} and Facility [${orisCode}]`
            );
          }
        });
      }
    });

    return errorList;
  }
}
