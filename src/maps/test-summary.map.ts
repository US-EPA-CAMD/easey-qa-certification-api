import { Injectable } from '@nestjs/common';
import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { LinearitySummaryMap } from './linearity-summary.map';
import { TestSummary } from '../entities/test-summary.entity';
import { TestSummaryDTO } from '../dto/test-summary.dto';
import { ProtocolGasMap } from './protocol-gas.map';
import { RataMap } from './rata.map';
import { TestQualificationMap } from './test-qualification.map';
import { AirEmissionTestingMap } from './air-emission-testing.map';
import { AppECorrelationTestSummaryMap } from './app-e-correlation-summary.map';
import { FuelFlowToLoadTestMap } from './fuel-flow-to-load-test.map';
import { FlowToLoadCheckMap } from './flow-to-load-check.map';
import { FlowToLoadReferenceMap } from './flow-to-load-reference.map';
import { CalibrationInjectionMap } from './calibration-injection.map';
import { CycleTimeSummaryMap } from './cycle-time-summary.map';
import { FuelFlowmeterAccuracyMap } from './fuel-flowmeter-accuracy.map';
import { UnitDefaultTestMap } from './unit-default-test.map';
import { HgSummaryMap } from './hg-summary.map';

@Injectable()
export class TestSummaryMap extends BaseMap<TestSummary, TestSummaryDTO> {
  constructor(
    private readonly linearityMap: LinearitySummaryMap,
    private readonly protocolGasMap: ProtocolGasMap,
    private readonly airEmissionTestingMap: AirEmissionTestingMap,
    private readonly rataMap: RataMap,
    private readonly testQualificationMap: TestQualificationMap,
    private readonly appECorrelationTestSummaryMap: AppECorrelationTestSummaryMap,
    private readonly fuelFlowToLoadTestMap: FuelFlowToLoadTestMap,
    private readonly flowToLoadCheckMap: FlowToLoadCheckMap,
    private readonly flowToLoadReferenceMap: FlowToLoadReferenceMap,
    private readonly calibrationInjectionMap: CalibrationInjectionMap,
    private readonly cycleTimeSummaryMap: CycleTimeSummaryMap,
    private readonly fuelFlowmeterAccuracyMap: FuelFlowmeterAccuracyMap,
    private readonly unitDefaultTestMap: UnitDefaultTestMap,
    private readonly hgSummaryMap: HgSummaryMap,
  ) {
    super();
  }

  public async one(entity: TestSummary): Promise<TestSummaryDTO> {
    let evalStatusCode = null;

    const linearitySummaries = entity.linearitySummaries
      ? await this.linearityMap.many(entity.linearitySummaries)
      : [];

    const protocolGases = entity.protocolGases
      ? await this.protocolGasMap.many(entity.protocolGases)
      : [];

    const airEmissionTestings = entity.airEmissionTestings
      ? await this.airEmissionTestingMap.many(entity.airEmissionTestings)
      : [];

    const ratas = entity.ratas ? await this.rataMap.many(entity.ratas) : [];
    const testQuals = entity.testQualifications
      ? await this.testQualificationMap.many(entity.testQualifications)
      : [];

    const appECorrelationTestSummaries = entity.appECorrelationTestSummaries
      ? await this.appECorrelationTestSummaryMap.many(
          entity.appECorrelationTestSummaries,
        )
      : [];

    const flowToloadCheck = entity.flowToLoadCheck
      ? await this.flowToLoadCheckMap.many(entity.flowToLoadCheck)
      : [];

    const flowToloadReference = entity.flowToLoadReference
      ? await this.flowToLoadReferenceMap.many(entity.flowToLoadReference)
      : [];

    const fuelFlowToloadTest = entity.fuelFlowToLoadTests
      ? await this.fuelFlowToLoadTestMap.many(entity.fuelFlowToLoadTests)
      : [];

    const fuelFlowmeterAccuracy = entity.fuelFlowmeterAccuracy
      ? await this.fuelFlowmeterAccuracyMap.many(entity.fuelFlowmeterAccuracy)
      : [];

    const calibrationInjections = entity.calibrationInjections
      ? await this.calibrationInjectionMap.many(entity.calibrationInjections)
      : [];

    const cycleTimeSummary = entity.cycleTimeSummary
      ? await this.cycleTimeSummaryMap.many(entity.cycleTimeSummary)
      : [];

    const unitDefaultTestMap = entity.unitDefaultTest
      ? await this.unitDefaultTestMap.many(entity.unitDefaultTest)
      : [];

    const hgSummary = entity.HgSummary
      ? await this.hgSummaryMap.many(entity.HgSummary)
      : [];

    if (entity['evalStatusCode']) {
      evalStatusCode = entity['evalStatusCode'];
    }

    return {
      id: entity.id,
      locationId: entity.location.id,
      stackPipeId:
        entity.location && entity.location.stackPipe
          ? entity.location.stackPipe.name
          : null,
      unitId:
        entity.location && entity.location.unit
          ? entity.location.unit.name
          : null,
      testTypeCode: entity.testTypeCode,
      monitoringSystemID: entity.system
        ? entity.system.monitoringSystemID
        : null,
      componentID: entity.component ? entity.component.componentID : null,
      spanScaleCode: entity.spanScaleCode,
      testNumber: entity.testNumber,
      testReasonCode: entity.testReasonCode,
      testDescription: entity.testDescription,
      testResultCode: entity.testResultCode,
      calculatedTestResultCode: entity.calculatedTestResultCode,
      beginDate: entity.beginDate,
      beginHour: entity.beginHour,
      beginMinute: entity.beginMinute,
      endDate: entity.endDate,
      endHour: entity.endHour,
      endMinute: entity.endMinute,
      gracePeriodIndicator: entity.gracePeriodIndicator,
      calculatedGracePeriodIndicator: entity.calculatedGracePeriodIndicator,
      year: entity.reportingPeriod ? entity.reportingPeriod.year : null,
      quarter: entity.reportingPeriod ? entity.reportingPeriod.quarter : null,
      testComment: entity.testComment,
      injectionProtocolCode: entity.injectionProtocolCode,
      calculatedSpanValue: entity.calculatedSpanValue,
      evalStatusCode,
      userId: entity.userId,
      addDate: entity.addDate ? entity.addDate.toLocaleString() : null,
      updateDate: entity.updateDate ? entity.updateDate.toLocaleString() : null,
      reportPeriodId: entity.reportPeriodId,

      calibrationInjectionData: calibrationInjections,
      linearitySummaryData: linearitySummaries,
      rataData: ratas,
      flowToLoadReferenceData: flowToloadReference,
      flowToLoadCheckData: flowToloadCheck,
      cycleTimeSummaryData: cycleTimeSummary,
      onlineOfflineCalibrationData: [],
      fuelFlowmeterAccuracyData: fuelFlowmeterAccuracy,
      transmitterTransducerData: [],
      fuelFlowToLoadBaselineData: [],
      appECorrelationTestSummaryData: appECorrelationTestSummaries,
      fuelFlowToLoadTestData: fuelFlowToloadTest,
      unitDefaultTestData: unitDefaultTestMap,
      hgSummaryData: hgSummary,
      testQualificationData: testQuals,
      protocolGasData: protocolGases,
      airEmissionTestingData: airEmissionTestings,
    };
  }
}
