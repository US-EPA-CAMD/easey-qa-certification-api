import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Logger } from '@us-epa-camd/easey-common/logger';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { QACertificationImportDTO } from '../dto/qa-certification.dto';
import { LocationIdentifiers } from '../interfaces/location-identifiers.interface';
import { LocationChecksService } from '../monitor-location-workspace/monitor-location-checks.service';
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
import { AppECorrelationTestRunChecksService } from '../app-e-correlation-test-run-workspace/app-e-correlation-test-run-checks.service';
import { AppECorrelationTestSummaryChecksService } from '../app-e-correlation-test-summary-workspace/app-e-correlation-test-summary-checks.service';
import { AppEHeatInputFromGasChecksService } from '../app-e-heat-input-from-gas-workspace/app-e-heat-input-from-gas-checks.service';
import { AppEHeatInputFromOilChecksService } from '../app-e-heat-input-from-oil-workspace/app-e-heat-input-from-oil-checks.service';
import { UnitDefaultTestRunChecksService } from '../unit-default-test-run-workspace/unit-default-test-run-checks.service';
import { ProtocolGasChecksService } from '../protocol-gas-workspace/protocol-gas-checks.service';

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
    private readonly appETestSummaryChecksService: AppECorrelationTestSummaryChecksService,
    private readonly appETestRunChecksService: AppECorrelationTestRunChecksService,
    private readonly appEGasChecksService: AppEHeatInputFromGasChecksService,
    private readonly appEOilChecksService: AppEHeatInputFromOilChecksService,
    private readonly unitDefaultTestRunChecksService: UnitDefaultTestRunChecksService,
    private readonly protocolGasChecksService: ProtocolGasChecksService,
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
      throw new EaseyException(
        new Error(errorList.join('\n')),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async runChecks(
    payload: QACertificationImportDTO,
  ): Promise<[LocationIdentifiers[], QASuppData[]]> {
    this.logger.log('Running QA Certification Checks');

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
          summary.monitoringSystemID,
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

        const results = await this.testSummaryChecksService?.runChecks(
          locationId,
          summary,
          true,
          false,
          payload.testSummaryData,
          duplicateQaSupp ? duplicateQaSupp.testSumId : null,
        );
        this.throwIfErrors(results);

        summary.linearitySummaryData?.forEach(linearitySummary => {
          promises.push(
            new Promise((resolve, _reject) => {
              const results = this.linearitySummaryChecksService.runChecks(
                linearitySummary,
                undefined,
                true,
                false,
                summary,
                summary.linearitySummaryData,
              );

              resolve(results);
            }),
          );

          linearitySummary.linearityInjectionData?.forEach(
            linearityInjection => {
              promises.push(
                new Promise((resolve, _reject) => {
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
            new Promise((resolve, _reject) => {
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
              new Promise((resolve, _reject) => {
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
                new Promise((resolve, _reject) => {
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
                  new Promise((resolve, _reject) => {
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
                    new Promise((resolve, _reject) => {
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
            new Promise((resolve, _reject) => {
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
                new Promise((resolve, _reject) => {
                  const results = this.cycleTimeInjectionChecksService.runChecks(
                    cycleTimeInjection,
                    null,
                    null,
                    null,
                    true,
                    cycleTimeSummary.cycleTimeInjectionData,
                    summary,
                  );

                  resolve(results);
                }),
              );
            },
          );
        });

        summary.protocolGasData?.forEach(protocolGas => {
          promises.push(
            new Promise((resolve, _reject) => {
              const results = this.protocolGasChecksService.runChecks(
                protocolGas,
                locationId,
                undefined,
                true,
                false,
                summary,
              );

              resolve(results);
            }),
          );
        });

        if (summary.appECorrelationTestSummaryData) {
          promises.push(
            new Promise((resolve, _reject) => {
              const results = this.appETestSummaryChecksService.runImportChecks(
                summary.appECorrelationTestSummaryData,
              );
              resolve(results);
            }),
          );

          summary.appECorrelationTestSummaryData.forEach(appESummary => {
            promises.push(
              new Promise((resolve, _reject) => {
                const results = this.appETestRunChecksService.runImportChecks(
                  appESummary.appECorrelationTestRunData,
                );
                resolve(results);
              }),
            );

            appESummary.appECorrelationTestRunData?.forEach(appETestRun => {
              promises.push(
                new Promise((resolve, _reject) => {
                  const results = this.appEGasChecksService.runImportChecks(
                    appETestRun.appEHeatInputFromGasData,
                  );
                  resolve(results);
                }),
              );

              promises.push(
                new Promise((resolve, _reject) => {
                  const results = this.appEOilChecksService.runImportChecks(
                    appETestRun.appEHeatInputFromOilData,
                  );
                  resolve(results);
                }),
              );
            });
          });
        }

        summary.unitDefaultTestData?.forEach(unitDefaultTest => {
          unitDefaultTest.unitDefaultTestRunData?.forEach(
            unitDefaultTestRun => {
              promises.push(
                new Promise((resolve, _reject) => {
                  const results = this.unitDefaultTestRunChecksService.runChecks(
                    unitDefaultTestRun,
                    true,
                    false,
                    null,
                    null,
                    summary,
                    unitDefaultTest.unitDefaultTestRunData,
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
          new Promise((resolve, _reject) => {
            const results = this.testExtensionExemptionsChecksService.runChecks(
              locationId,
              testExtExem,
              payload.testExtensionExemptionData,
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
          new Promise((resolve, _reject) => {
            const results = this.qaCertificationEventChecksService.runChecks(
              locationId,
              qaCertEvent,
              payload.certificationEventData,
              true,
              false,
            );
            resolve(results);
          }),
        );
      }
    }

    this.throwIfErrors(await this.extractErrors(promises));
    this.logger.log('Completed QA Certification Checks');
    return [locations, duplicateQaSuppRecords];
  }
}
