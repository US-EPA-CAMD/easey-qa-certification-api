import { Injectable } from '@nestjs/common';

import { BaseMap } from '@us-epa-camd/easey-common/maps';

import { LinearitySummaryMap } from './linearity-summary.map';
import { TestSummary } from '../entities/test-summary.entity';
import { TestSummaryDTO } from '../dto/test-summary.dto';

@Injectable()
export class TestSummaryMap extends BaseMap<TestSummary, TestSummaryDTO> {
  constructor(private readonly linearityMap: LinearitySummaryMap) {
    super();
  }

  public async one(entity: TestSummary): Promise<TestSummaryDTO> {
    let evalStatusCode = null;

    const linearitySummaries = entity.linearitySummaries
      ? await this.linearityMap.many(entity.linearitySummaries)
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
      rataData: [],
      flowToLoadReferenceData: [],
      flowToLoadCheckData: [],
      cycleTimeSummaryData: [],
      onlineOfflineCalibrationData: [],
      fuelFlowmeterAccuracyData: [],
      transmitterTransducerData: [],
      fuelFlowToLoadBaselineData: [],
      fuelFlowToLoadTestData: [],
      appECorrelationTestSummaryData: [],
      unitDefaultTestData: [],
      hgSummaryData: [],
      testQualificationData: [],
      protocolGasData: [],
      airEmissionTestData: [],
    };
  }
}
