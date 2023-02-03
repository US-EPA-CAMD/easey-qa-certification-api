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
import { TestQualificationChecksService } from '../test-qualification-workspace/test-qualification-checks.service';
import { TestExtensionExemptionsChecksService } from '../test-extension-exemptions-workspace/test-extension-exemptions-checks.service';
import { CycleTimeInjectionChecksService } from '../cycle-time-injection-workspace/cycle-time-injection-workspace-checks.service';
import { QACertificationEventChecksService } from '../qa-certification-event-workspace/qa-certification-event-checks.service';

@Injectable()
export class QACertificationChecksService {
  constructor(
    private readonly logger: Logger,
    private readonly locationChecksService: LocationChecksService,
    private readonly testSummaryChecksService: TestSummaryChecksService,
    private readonly testQualificationChecksService: TestQualificationChecksService,
    private readonly linearitySummaryChecksService: LinearitySummaryChecksService,
    private readonly linearityInjectionChecksService: LinearityInjectionChecksService,
    private readonly rataChecksService: RataChecksService,
    private readonly rataSummaryChecksService: RataSummaryChecksService,
    private readonly rataRunChecksService: RataRunChecksService,
    private readonly flowRataRunChecksService: FlowRataRunChecksService,
    private readonly rataTraverseChecksService: RataTraverseChecksService,
    private readonly testExtensionExemptionsChecksService: TestExtensionExemptionsChecksService,
    private readonly cycleTimeInjectionChecksService: CycleTimeInjectionChecksService,
    private readonly qaCertificationEventChecksService: QACertificationEventChecksService,
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

    if (payload.testSummaryData) {
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
            const results = this.testSummaryChecksService?.runChecks(
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

          linearitySummary.linearityInjectionData?.forEach(
            linearityInjection => {
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
            },
          );
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
                        null,
                        rataSummary,
                        null,
                        true,
                        false,
                        flowRataRun.rataTraverseData,
                      );

                      resolve(results);
                    }),
                  );
                });
              });
            });
          });
        });

        summary.testQualificationData?.forEach(testQualification => {
          promises.push(
            new Promise(async (resolve, _reject) => {
              const results = this.testQualificationChecksService.runChecks(
                locationId,
                testQualification,
                summary.testQualificationData,
                duplicateQaSupp ? duplicateQaSupp.testSumId : null,
                summary,
                summary.rataData?.length > 0 ? summary.rataData[0] : null,
                true,
                false,
              );

              resolve(results);
            }),
          );
        });

        summary.cycleTimeSummaryData?.forEach(cycleTimeSummary => {
          cycleTimeSummary.cycleTimeInjectionData?.forEach(
            cycleTimeInjection => {
              promises.push(
                new Promise(async (resolve, _reject) => {
                  const results = this.cycleTimeInjectionChecksService.runChecks(
                    cycleTimeInjection,
                    null,
                    null,
                    null,
                    true,
                  );

                  resolve(results);
                }),
              );
            },
          );
        });
      }
    }

    if (payload.testExtensionExemptionData) {
      for (const testExtExem of payload.testExtensionExemptionData) {
        const locationId = locations.find(i => {
          return (
            i.unitId === testExtExem.unitId &&
            i.stackPipeId === testExtExem.stackPipeId
          );
        }).locationId;

        promises.push(
          new Promise(async (resolve, _reject) => {
            const results = this.testExtensionExemptionsChecksService.runChecks(
              locationId,
              testExtExem,
              true,
              false,
            );
            resolve(results);
          }),
        );
      }
    }

    if (payload.certificationEventData) {
      for (const qaCertEvent of payload.certificationEventData) {
        const locationId = locations.find(i => {
          return (
            i.unitId === qaCertEvent.unitId &&
            i.stackPipeId === qaCertEvent.stackPipeId
          );
        }).locationId;

        promises.push(
          new Promise(async (resolve, _reject) => {
            const results = this.qaCertificationEventChecksService.runChecks(
              locationId,
              qaCertEvent,
              true,
              false,
            );
            resolve(results);
          }),
        );
      }
    }

    this.throwIfErrors(await this.extractErrors(promises));
    this.logger.info('Completed QA Certification Checks');
    return [locations, duplicateQaSuppRecords];
  }
}
