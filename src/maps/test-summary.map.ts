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
    const linearitySummaries = entity.linearitySummaries
      ? await this.linearityMap.many(entity.linearitySummaries)
      : [];

    const dto = {
      id: entity.id,
      stackPipeId: (entity.location && entity.location.stackPipe)
        ? entity.location.stackPipe.name
        : null,
      unitId: (entity.location && entity.location.unit)
        ? entity.location.unit.name
        : null,
      testTypeCode: entity.testTypeCode,
      monitoringSystemId: null,
      componentId: entity.component
        ? entity.component.componentId
        : null,
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
      year: null,
      quarter: null,
      testComment: entity.testComment,
      injectionProtocolCode: entity.injectionProtocolCode,
      calculatedSpanValue: entity.calculatedSpanValue,
      evalStatusCode: null,
      userId: entity.userId,
      addDate: entity.addDate,
      updateDate: entity.updateDate,
      reportPeriodId: entity.reportPeriodId,
      linearitySummaryData: linearitySummaries,
    };

    if (dto.linearitySummaryData.length === 0) delete dto.linearitySummaryData;

    return dto;
  }
}