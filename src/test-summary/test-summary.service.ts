import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Logger } from '@us-epa-camd/easey-common/logger';

import { TestSummaryDTO } from '../dto/test-summary.dto';
import { TestSummaryMap } from '../maps/test-summary.map';
import { TestSummaryRepository } from './test-summary.repository';
import { LinearitySummaryService } from '../linearity-summary/linearity-summary.service';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';
import { RataService } from '../rata/rata.service';
import { ProtocolGasService } from '../protocol-gas/protocol-gas.service';
import { AppECorrelationTestSummaryService } from '../app-e-correlation-test-summary/app-e-correlation-test-summary.service';
import { FuelFlowToLoadTestService } from '../fuel-flow-to-load-test/fuel-flow-to-load-test.service';
import { CalibrationInjectionService } from '../calibration-injection/calibration-injection.service';
import { FlowToLoadCheckService } from '../flow-to-load-check/flow-to-load-check.service';
import { FlowToLoadReferenceService } from '../flow-to-load-reference/flow-to-load-reference.service';
import { OnlineOfflineCalibrationService } from '../online-offline-calibration/online-offline-calibration.service';
import { FuelFlowToLoadBaselineService } from '../fuel-flow-to-load-baseline/fuel-flow-to-load-baseline.service';
import { CycleTimeSummaryService } from '../cycle-time-summary/cycle-time-summary.service';

@Injectable()
export class TestSummaryService {
  constructor(
    private readonly logger: Logger,
    private readonly map: TestSummaryMap,
    @Inject(forwardRef(() => LinearitySummaryService))
    private readonly linearityService: LinearitySummaryService,
    @Inject(forwardRef(() => RataService))
    private readonly rataService: RataService,
    @InjectRepository(TestSummaryRepository)
    private readonly repository: TestSummaryRepository,
    @Inject(forwardRef(() => ProtocolGasService))
    private readonly protocolGasService: ProtocolGasService,
    @Inject(forwardRef(() => AppECorrelationTestSummaryService))
    private readonly appECorrelationTestSummaryService: AppECorrelationTestSummaryService,
    @Inject(forwardRef(() => FuelFlowToLoadTestService))
    private readonly fuelFlowToLoadTestService: FuelFlowToLoadTestService,
    @Inject(forwardRef(() => FuelFlowToLoadBaselineService))
    private readonly fuelFlowToLoadBaselineService: FuelFlowToLoadBaselineService,
    @Inject(forwardRef(() => CalibrationInjectionService))
    private readonly calInjService: CalibrationInjectionService,
    @Inject(forwardRef(() => FlowToLoadCheckService))
    private readonly flowToLoadCheckService: FlowToLoadCheckService,
    @Inject(forwardRef(() => FlowToLoadReferenceService))
    private readonly flowLoadReferenceService: FlowToLoadReferenceService,
    @Inject(forwardRef(() => OnlineOfflineCalibrationService))
    private readonly onlineOfflineCalibrationService: OnlineOfflineCalibrationService,
    @Inject(forwardRef(() => CycleTimeSummaryService))
    private readonly cycleTimeSummaryService: CycleTimeSummaryService,
  ) {}

  async getTestSummaryById(testSumId: string): Promise<TestSummaryDTO> {
    const result = await this.repository.getTestSummaryById(testSumId);

    if (!result) {
      throw new LoggingException(
        `A test summary record not found with Record Id [${testSumId}].`,
        HttpStatus.NOT_FOUND,
      );
    }

    const dto = await this.map.one(result);

    delete dto.calibrationInjectionData;
    delete dto.linearitySummaryData;
    delete dto.rataData;
    delete dto.flowToLoadReferenceData;
    delete dto.flowToLoadCheckData;
    delete dto.cycleTimeSummaryData;
    delete dto.onlineOfflineCalibrationData;
    delete dto.fuelFlowmeterAccuracyData;
    delete dto.transmitterTransducerData;
    delete dto.fuelFlowToLoadBaselineData;
    delete dto.fuelFlowToLoadTestData;
    delete dto.appECorrelationTestSummaryData;
    delete dto.unitDefaultTestData;
    delete dto.hgSummaryData;
    delete dto.testQualificationData;
    delete dto.protocolGasData;
    delete dto.airEmissionTestingData;

    return dto;
  }

  async getTestSummariesByLocationId(
    locationId: string,
    testTypeCode?: string[],
    beginDate?: Date,
    endDate?: Date,
  ): Promise<TestSummaryDTO[]> {
    const results = await this.repository.getTestSummariesByLocationId(
      locationId,
      testTypeCode,
      beginDate,
      endDate,
    );

    return this.map.many(results);
  }

  async getTestSummaries(
    facilityId: number,
    unitIds?: string[],
    stackPipeIds?: string[],
    testSummaryIds?: string[],
    testTypeCodes?: string[],
    beginDate?: Date,
    endDate?: Date,
  ): Promise<TestSummaryDTO[]> {
    const results = await this.repository.getTestSummariesByUnitStack(
      facilityId,
      unitIds,
      stackPipeIds,
      testSummaryIds,
      testTypeCodes,
      beginDate,
      endDate,
    );

    return this.map.many(results);
  }

  async export(
    facilityId: number,
    unitIds?: string[],
    stackPipeIds?: string[],
    testSummaryIds?: string[],
    testTypeCodes?: string[],
    beginDate?: Date,
    endDate?: Date,
  ): Promise<TestSummaryDTO[]> {
    const promises = [];

    const testSummaries = await this.getTestSummaries(
      facilityId,
      unitIds,
      stackPipeIds,
      testSummaryIds,
      testTypeCodes,
      beginDate,
      endDate,
    );

    promises.push(
      new Promise(async (resolve, _reject) => {
        let linearitySummaryData,
          rataData,
          protocolGasData,
          fuelFlowToLoadTestData,
          fuelFlowToLoadBaselineData,
          appECorrelationTestSummaryData,
          calibrationInjectionData,
          cycleTimeSummaryData,
          flowToLoadCheckData,
          flowToLoadReferenceData,
          onlineOfflineCalibrationData;
        let testSumIds;

        if (testTypeCodes?.length > 0) {
          testSumIds = testSummaries.filter(i =>
            testTypeCodes.includes(i.testTypeCode),
          );
        }

        testSumIds = testSummaries.map(i => i.id);

        if (testSumIds) {
          linearitySummaryData = await this.linearityService.export(testSumIds);

          rataData = await this.rataService.export(testSumIds);

          protocolGasData = await this.protocolGasService.export(testSumIds);

          fuelFlowToLoadTestData = await this.fuelFlowToLoadTestService.export(
            testSumIds,
          );

          fuelFlowToLoadBaselineData = await this.fuelFlowToLoadBaselineService.export(
            testSumIds,
          );

          flowToLoadCheckData = await this.flowToLoadCheckService.export(
            testSumIds,
          );

          flowToLoadReferenceData = await this.flowLoadReferenceService.export(
            testSumIds,
          );

          appECorrelationTestSummaryData = await this.appECorrelationTestSummaryService.export(
            testSumIds,
          );

          calibrationInjectionData = await this.calInjService.export(
            testSumIds,
          );

          onlineOfflineCalibrationData = await this.onlineOfflineCalibrationService.export(
            testSumIds,
          );

          cycleTimeSummaryData = await this.cycleTimeSummaryService.export(
            testSumIds,
          );

          testSummaries.forEach(s => {
            s.linearitySummaryData = linearitySummaryData.filter(
              i => i.testSumId === s.id,
            );
            s.rataData = rataData.filter(i => i.testSumId === s.id);
            s.protocolGasData = protocolGasData.filter(
              i => i.testSumId === s.id,
            );
            s.fuelFlowToLoadTestData = fuelFlowToLoadTestData.filter(
              i => i.testSumId === s.id,
            );
            s.fuelFlowToLoadBaselineData = fuelFlowToLoadBaselineData.filter(
              i => i.testSumId === s.id,
            );
            s.appECorrelationTestSummaryData = appECorrelationTestSummaryData.filter(
              i => i.testSumId === s.id,
            );
            s.calibrationInjectionData = calibrationInjectionData.filter(
              i => i.testSumId === s.id,
            );
            s.flowToLoadCheckData = flowToLoadCheckData.filter(
              i => i.testSumId === s.id,
            );
            s.flowToLoadReferenceData = flowToLoadReferenceData.filter(
              i => i.testSumId === s.id,
            );
            s.onlineOfflineCalibrationData = onlineOfflineCalibrationData.filter(
              i => i.testSumId === s.id,
            );
            s.cycleTimeSummaryData = cycleTimeSummaryData.filter(
              i => i.testSumId === s.id,
            );
          });
        }

        resolve(testSummaries);
      }),
    );

    await Promise.all(promises);

    return testSummaries;
  }
}
