import { Injectable } from '@nestjs/common';

import { BaseMap } from '@us-epa-camd/easey-common/maps';

import { LinearitySummaryMap } from './linearity-summary.map';
import { TestSummary } from '../entities/test-summary.entity';
import { TestSummaryDTO } from '../dto/test-summary.dto';
import { ProtocolGasMap } from './protocol-gas.map';
import { RataMap } from './rata.map';
import { TestQualificationMap } from './test-qualification.map';
import { AirEmissionTestingMap } from './air-emission-testing.map';
import { AeCorrelationSummaryMap } from './app-e-correlation-summary.map';
import { FuelFlowToLoadTestMap } from './fuel-flow-to-load-test.map';

@Injectable()
export class TestSummaryMap extends BaseMap<TestSummary, TestSummaryDTO> {
  constructor(
    private readonly linearityMap: LinearitySummaryMap,
    private readonly protocolGasMap: ProtocolGasMap,
    private readonly airEmissionTestingMap: AirEmissionTestingMap,
    private readonly rataMap: RataMap,
    private readonly testQualificationMap: TestQualificationMap,
    private readonly aeCorrelationSummaryMap: AeCorrelationSummaryMap,
    private readonly fuelFlowToLoadTestMap: FuelFlowToLoadTestMap,
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

    const aeCorrelationSummaryTest = entity.appECorrelationTests
      ? await this.aeCorrelationSummaryMap.many(entity.appECorrelationTests)
      : [];

    const fuelFlowToloadTest = entity.fuelFlowToLoadTests
      ? await this.fuelFlowToLoadTestMap.many(entity.fuelFlowToLoadTests)
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
      calibrationInjectionData: [],
      linearitySummaryData: linearitySummaries,
      rataData: ratas,
      flowRataRunData: [],
      flowToLoadReferenceData: [],
      flowToLoadCheckData: [],
      cycleTimeSummaryData: [],
      onlineOfflineCalibrationData: [],
      fuelFlowmeterAccuracyData: [],
      transmitterTransducerData: [],
      fuelFlowToLoadBaselineData: [],
      appECorrelationTestSummaryData: aeCorrelationSummaryTest,
      fuelFlowToLoadTestData: fuelFlowToloadTest,

      unitDefaultTestData: [],
      hgSummaryData: [],
      testQualificationData: testQuals,
      protocolGasData: protocolGases,
      airEmissionTestingData: airEmissionTestings,
    };
  }
}
