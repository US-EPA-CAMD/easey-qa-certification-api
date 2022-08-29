import { HttpStatus, Injectable } from '@nestjs/common';

import { Logger } from '@us-epa-camd/easey-common/logger';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';

import { QACertificationImportDTO } from '../dto/qa-certification.dto';
import { LocationIdentifiers } from '../interfaces/location-identifiers.interface';
import { LocationChecksService } from '../location-workspace/location-checks.service';
import { TestSummaryChecksService } from '../test-summary-workspace/test-summary-checks.service';
import { LinearitySummaryChecksService } from '../linearity-summary-workspace/linearity-summary-checks.service';
import { LinearityInjectionChecksService } from '../linearity-injection-workspace/linearity-injection-checks.service';
import { RataChecksService } from '../rata-workspace/rata-checks.service';
import { RataSummaryChecksService } from '../rata-summary-workspace/rata-summary-checks.service';

@Injectable()
export class QACertificationChecksService {
  constructor(
    private readonly logger: Logger,
    private readonly locationChecksService: LocationChecksService,
    private readonly testSummaryChecksService: TestSummaryChecksService,
    private readonly linearitySummaryChecksService: LinearitySummaryChecksService,
    private readonly linearityInjectionChecksService: LinearityInjectionChecksService,
    private readonly rataChecksService: RataChecksService,
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
      throw new LoggingException(errorList, HttpStatus.BAD_REQUEST);
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

    [locations, errors] = await this.locationChecksService.runChecks(payload);
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
            true,
            false,
            payload.testSummaryData,
          );

          resolve(results);
        }),
      );

      summary.linearitySummaryData?.forEach(linearitySummary => {
        promises.push(
          new Promise(async (resolve, _reject) => {
            const results = this.linearitySummaryChecksService.runChecks(
              locationId,
              linearitySummary,
              true,
            );

            resolve(results);
          }),
        );

        linearitySummary.linearityInjectionData?.forEach(linearityInjection => {
          promises.push(
            new Promise(async (resolve, _reject) => {
              const results = this.linearityInjectionChecksService.runChecks(
                locationId,
                linearityInjection,
                true,
                false,
                linearitySummary.linearityInjectionData,
              );

              resolve(results);
            }),
          );
        });
      });

      summary.rataData?.forEach(rataData => {
        promises.push(
          new Promise(async (resolve, _reject) => {
            const results = this.rataChecksService.runChecks(
              rataData,
              null,
              summary,
              true,
            );

            resolve(results);
          }),
        );
      });
    });

    this.throwIfErrors(await this.extractErrors(promises));
    this.logger.info('Completed QA Certification Checks');

    return locations;
  }
}
