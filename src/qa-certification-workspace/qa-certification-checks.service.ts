import { BadRequestException, Injectable } from '@nestjs/common';

import { Logger } from '@us-epa-camd/easey-common/logger';
import { LinearitySummaryChecksService } from '../linearity-summary-workspace/linearity-summary-checks.service';

import { QACertificationImportDTO } from '../dto/qa-certification.dto';
import { LocationIdentifiers } from '../interfaces/location-identifiers.interface';
import { LocationChecksService } from '../location-workspace/location-checks.service';
import { TestSummaryChecksService } from '../test-summary-workspace/test-summary-checks.service';
import { LinearityInjectionChecksService } from '../linearity-injection-workspace/linearity-injection-checks.service';

@Injectable()
export class QACertificationChecksService {
  constructor(
    private readonly logger: Logger,
    private readonly locationChecksService: LocationChecksService,
    private readonly testSummaryChecksService: TestSummaryChecksService,
    private readonly linearitySummaryChecksService: LinearitySummaryChecksService,
    private readonly linearityInjectionChecksService: LinearityInjectionChecksService,
  ) {}

  private async extractErrors(
    promises: Promise<string[]>[],
  ): Promise<string[]> {
    const errorList: string[] = [];
    const errors = await Promise.all(promises);
    errors.forEach(p => {
      errorList.push(...p);
    });
    return [...new Set(errorList)];
  }

  private throwIfErrors(errorList: string[]) {
    if (errorList.length > 0) {
      this.logger.error(BadRequestException, errorList, true);
    }
  }

  async runChecks(
    payload: QACertificationImportDTO,
  ): Promise<LocationIdentifiers[]> {
    this.logger.info('Running QA Certification Checks');

    const errorList: string[] = [];
    const promises: Promise<string[]>[] = [];

    let errors: string[] = [];
    let locations: LocationIdentifiers[] = [];

    const addLocation = (i: any) => {
      const systemIDs = [];
      const componentIDs = [];

      const location = locations.find(l => {
        if (
          (l.unitId && l.unitId === i.unitId) ||
          (l.stackPipeId && l.stackPipeId === i.stackPipeId)
        )
          return l;
      });

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
        if (i.monitoringSystemID) systemIDs.push(i.monitoringSystemID);
        if (i.componentID) componentIDs.push(i.componentID);

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

    if (locations.length === 0) {
      errorList.push(
        'There are no test summary, certifications events, or extension/exmeption records present in the file to be imported',
      );
    }
    this.throwIfErrors(errorList);

    [locations, errors] = await this.locationChecksService.runChecks(
      payload.orisCode,
      locations,
    );
    errorList.push(...errors);
    this.throwIfErrors(errorList);

    payload.testSummaryData.forEach(async summary => {
      const locationId = locations.find(i => {
        return (
          i.unitId === summary.unitId && i.stackPipeId === summary.stackPipeId
        );
      }).locationId;

      promises.push(
        new Promise(async (resolve, _reject) => {
          const results = this.testSummaryChecksService.runChecks(
            locationId,
            summary,
            payload.testSummaryData,
            true,
          );

          resolve(results);
        }),
      );

      summary.linearitySummaryData.forEach(linearitySummary => {
        promises.push(
          new Promise(async (resolve, _reject) => {
            const results = this.linearitySummaryChecksService.runChecks(
              locationId,
              linearitySummary,
              summary.linearitySummaryData,
              true,
            );

            resolve(results);
          }),
        );

        linearitySummary.linearityInjectionData.forEach(linearityInjection => {
          promises.push(
            new Promise(async (resolve, _reject) => {
              const results = this.linearityInjectionChecksService.runChecks(
                locationId,
                linearityInjection,
                linearitySummary,
                true,
              );

              resolve(results);
            }),
          );
        });
      });
    });
    this.throwIfErrors(await this.extractErrors(promises));
    this.logger.info('Completed QA Certification Checks');
    return locations;
  }
}
