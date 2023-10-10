import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Logger } from '@us-epa-camd/easey-common/logger';
import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { TestSummaryDTO } from '../dto/test-summary.dto';
import { TestSummaryMap } from '../maps/test-summary.map';
import { TestSummaryRepository } from './test-summary.repository';
import { LinearitySummaryService } from '../linearity-summary/linearity-summary.service';
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
import { FuelFlowmeterAccuracyService } from '../fuel-flowmeter-accuracy/fuel-flowmeter-accuracy.service';
import { UnitDefaultTestService } from '../unit-default-test/unit-default-test.service';
import { TransmitterTransducerAccuracyService } from '../transmitter-transducer-accuracy/transmitter-transducer-accuracy.service';
import { HgSummaryService } from '../hg-summary/hg-summary.service';
import { AirEmissionTestingService } from '../air-emission-testing/air-emission-testing.service';
import { TestQualificationService } from '../test-qualification/test-qualification.service';

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
    @Inject(forwardRef(() => FuelFlowmeterAccuracyService))
    private readonly fuelFlowmeterAccuracyService: FuelFlowmeterAccuracyService,
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
    @Inject(forwardRef(() => UnitDefaultTestService))
    private readonly unitDefaultTestService: UnitDefaultTestService,
    @Inject(forwardRef(() => TransmitterTransducerAccuracyService))
    private readonly transmitterTransducerAccuracyService: TransmitterTransducerAccuracyService,
    @Inject(forwardRef(() => HgSummaryService))
    private readonly hgSummaryService: HgSummaryService,
    @Inject(forwardRef(() => AirEmissionTestingService))
    private readonly airEmissionTestingService: AirEmissionTestingService,
    @Inject(forwardRef(() => TestQualificationService))
    private readonly testQualificationService: TestQualificationService,
  ) {}

  async getTestSummaryById(testSumId: string): Promise<TestSummaryDTO> {
    const result = await this.repository.getTestSummaryById(testSumId);

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
    delete dto.appendixECorrelationTestSummaryData;
    delete dto.unitDefaultTestData;
    delete dto.hgSummaryData;
    delete dto.testQualificationData;
    delete dto.protocolGasData;
    delete dto.airEmissionTestData;

    return dto;
  }

  async getTestSummariesByLocationId(
    locationId: string,
    testTypeCode?: string[],
    systemTypeCode?: string[],
    beginDate?: Date,
    endDate?: Date,
  ): Promise<TestSummaryDTO[]> {
    const results = await this.repository.getTestSummariesByLocationId(
      locationId,
      testTypeCode,
      systemTypeCode,
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

  private async getAllChildrenData(testTypeCodes, testSummaries) {
    let linearitySummaryData,
      rataData,
      protocolGasData,
      fuelFlowToLoadTestData,
      fuelFlowToLoadBaselineData,
      fuelFlowmeterAccuracyData,
      appendixECorrelationTestSummaryData,
      calibrationInjectionData,
      cycleTimeSummaryData,
      flowToLoadCheckData,
      flowToLoadReferenceData,
      onlineOfflineCalibrationData,
      unitDefaultTestData,
      transmitterTransducerAccuracyData,
      hgSummaryData,
      testQualificationData,
      airEmissionTestData;

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

      fuelFlowmeterAccuracyData = await this.fuelFlowmeterAccuracyService.export(
        testSumIds,
      );

      appendixECorrelationTestSummaryData = await this.appECorrelationTestSummaryService.export(
        testSumIds,
      );

      calibrationInjectionData = await this.calInjService.export(testSumIds);

      onlineOfflineCalibrationData = await this.onlineOfflineCalibrationService.export(
        testSumIds,
      );

      cycleTimeSummaryData = await this.cycleTimeSummaryService.export(
        testSumIds,
      );

      unitDefaultTestData = await this.unitDefaultTestService.export(
        testSumIds,
      );

      transmitterTransducerAccuracyData = await this.transmitterTransducerAccuracyService.export(
        testSumIds,
      );

      testQualificationData = await this.testQualificationService.export(
        testSumIds,
      );

      airEmissionTestData = await this.airEmissionTestingService.export(
        testSumIds,
      );

      hgSummaryData = await this.hgSummaryService.export(testSumIds);

      testSummaries.forEach(s => {
        s.linearitySummaryData = linearitySummaryData.filter(
          i => i.testSumId === s.id,
        );
        s.rataData = rataData.filter(i => i.testSumId === s.id);
        s.protocolGasData = protocolGasData.filter(i => i.testSumId === s.id);
        s.fuelFlowToLoadTestData = fuelFlowToLoadTestData.filter(
          i => i.testSumId === s.id,
        );
        s.fuelFlowToLoadBaselineData = fuelFlowToLoadBaselineData.filter(
          i => i.testSumId === s.id,
        );
        s.appendixECorrelationTestSummaryData = appendixECorrelationTestSummaryData.filter(
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
        s.fuelFlowmeterAccuracyData = fuelFlowmeterAccuracyData.filter(
          i => i.testSumId === s.id,
        );
        s.onlineOfflineCalibrationData = onlineOfflineCalibrationData.filter(
          i => i.testSumId === s.id,
        );
        s.cycleTimeSummaryData = cycleTimeSummaryData.filter(
          i => i.testSumId === s.id,
        );
        s.unitDefaultTestData = unitDefaultTestData.filter(
          i => i.testSumId === s.id,
        );
        s.transmitterTransducerData = transmitterTransducerAccuracyData.filter(
          i => i.testSumId === s.id,
        );
        s.testQualificationData = testQualificationData.filter(
          i => i.testSumId === s.id,
        );
        s.airEmissionTestData = airEmissionTestData.filter(
          i => i.testSumId === s.id,
        );
        s.hgSummaryData = hgSummaryData.filter(i => i.testSumId === s.id);
      });
    }

    return testSummaries;
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
    const testSummaries = await this.getTestSummaries(
      facilityId,
      unitIds,
      stackPipeIds,
      testSummaryIds,
      testTypeCodes,
      beginDate,
      endDate,
    );

    return this.getAllChildrenData(testTypeCodes, testSummaries);
  }
}
