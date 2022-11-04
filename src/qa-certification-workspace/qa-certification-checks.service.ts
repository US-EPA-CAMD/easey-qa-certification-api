import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

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
import { QASuppDataWorkspaceRepository } from '../qa-supp-data-workspace/qa-supp-data.repository';
import { QASuppData } from '../entities/workspace/qa-supp-data.entity';
import { RataRunChecksService } from '../rata-run-workspace/rata-run-checks.service';
import { FlowRataRunChecksService } from '../flow-rata-run-workspace/flow-rata-run-checks.service';
import { RataTraverseChecksService } from '../rata-traverse-workspace/rata-traverse-checks.service';

@Injectable()
export class QACertificationChecksService {
  constructor(
    private readonly logger: Logger,
    private readonly locationChecksService: LocationChecksService,
    private readonly testSummaryChecksService: TestSummaryChecksService,
    private readonly linearitySummaryChecksService: LinearitySummaryChecksService,
    private readonly linearityInjectionChecksService: LinearityInjectionChecksService,
    private readonly rataChecksService: RataChecksService,
    private readonly rataSummaryChecksService: RataSummaryChecksService,
    private readonly rataRunChecksService: RataRunChecksService,
    private readonly flowRataRunChecksService: FlowRataRunChecksService,
    private readonly rataTraverseChecksService: RataTraverseChecksService,
    @InjectRepository(QASuppDataWorkspaceRepository)
    private readonly qaSuppDataRepository: QASuppDataWorkspaceRepository,
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
  ): Promise<[LocationIdentifiers[], QASuppData[]]> {
    this.logger.info('Running QA Certification Checks');

    const errorList: string[] = [];
    const promises: Promise<string[]>[] = [];

    let errors: string[] = [];
    let locations: LocationIdentifiers[] = [];
    let duplicateQaSuppRecords: QASuppData[] = [];

    [locations, errors] = await this.locationChecksService.runChecks(payload);
    errorList.push(...errors);
    this.throwIfErrors(errorList);

    for (const summary of payload.testSummaryData) {
      const locationId = locations.find(i => {
        return (
          i.unitId === summary.unitId && i.stackPipeId === summary.stackPipeId
        );
      }).locationId;

      const duplicateQaSupp = await this.qaSuppDataRepository.getQASuppDataByTestTypeCodeComponentIdEndDateEndTime(
        locationId,
        summary.componentID,
        summary.testTypeCode,
        summary.testNumber,
        summary.spanScaleCode,
        summary.endDate,
        summary.endHour,
        summary.endMinute,
      );

      if (duplicateQaSupp) {
        duplicateQaSuppRecords.push(duplicateQaSupp);
      }

      promises.push(
        new Promise(async (resolve, _reject) => {
          const results = this.testSummaryChecksService.runChecks(
            locationId,
            summary,
            true,
            false,
            payload.testSummaryData,
            duplicateQaSupp ? duplicateQaSupp.testSumId : null,
          );

          resolve(results);
        }),
      );

      summary.linearitySummaryData?.forEach(linearitySummary => {
        promises.push(
          new Promise(async (resolve, _reject) => {
            const results = this.linearitySummaryChecksService.runChecks(
              linearitySummary,
              undefined,
              true,
              false,
              summary,
            );

            resolve(results);
          }),
        );

        linearitySummary.linearityInjectionData?.forEach(linearityInjection => {
          promises.push(
            new Promise(async (resolve, _reject) => {
              const results = this.linearityInjectionChecksService.runChecks(
                linearityInjection,
                undefined,
                undefined,
                true,
                false,
                linearitySummary.linearityInjectionData,
                summary,
              );

              resolve(results);
            }),
          );
        });
      });

      summary.rataData?.forEach(rata => {
        promises.push(
          new Promise(async (resolve, _reject) => {
            const results = this.rataChecksService.runChecks(
              locationId,
              rata,
              null,
              true,
              false,
              summary,
            );

            resolve(results);
          }),
        );

        rata.rataSummaryData?.forEach(rataSummary => {
          promises.push(
            new Promise(async (resolve, _reject) => {
              const results = this.rataSummaryChecksService.runChecks(
                locationId,
                rataSummary,
                true,
                false,
                null,
                null,
                rata.rataSummaryData,
                summary,
              );

              resolve(results);
            }),
          );

          rataSummary.rataRunData?.forEach(rataRun => {
            promises.push(
              new Promise(async (resolve, _reject) => {
                const results = this.rataRunChecksService.runChecks(
                  rataRun,
                  locationId,
                  null,
                  true,
                  false,
                  summary,
                  undefined,
                  rataSummary.rataRunData,
                );

                resolve(results);
              }),
            );

            rataRun.flowRataRunData?.forEach(flowRataRun => {
              promises.push(
                new Promise(async (resolve, _reject) => {
                  const results = this.flowRataRunChecksService.runChecks(
                    flowRataRun,
                    true,
                    false,
                    null,
                    rataSummary,
                    null,
                    rataRun,
                    null,
                    summary,
                  );

                  resolve(results);
                }),
              );

              flowRataRun.rataTraverseData?.forEach(rataTraverse => {
                promises.push(
                  new Promise(async (resolve, _reject) => {
                    const results = this.rataTraverseChecksService.runChecks(
                      rataTraverse,
                      locationId,
                      null,
                      summary,
                      true,
                      false,
                    );

                    resolve(results);
                  }),
                );
              });
            });
          });
        });
      });
    }

    this.throwIfErrors(await this.extractErrors(promises));
    this.logger.info('Completed QA Certification Checks');
    return [locations, duplicateQaSuppRecords];
  }
}
