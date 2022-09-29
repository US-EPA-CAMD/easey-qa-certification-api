import { Injectable } from '@nestjs/common';
import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { AppECorrelationTestRun } from '../entities/app-e-correlation-test-run.entity';
import { AppECorrelationTestRunDTO } from '../dto/app-e-correlation-test-run.dto';

@Injectable()
export class AppECorrelationTestRunMap extends BaseMap<
  AppECorrelationTestRun,
  AppECorrelationTestRunDTO
> {
  public async one(entity: AppECorrelationTestRun): Promise<AppECorrelationTestRunDTO> {
    return {
      id: entity.id,
      appECorrTestSumId: entity.appECorrTestSumId,

      runNumber: entity.runNumber,
      referenceValue: entity.referenceValue,
      hourlyHeatInputRate: entity.hourlyHeatInputRate,
      calculatedHourlyHeatInputRate: entity.calculatedHourlyHeatInputRate,
      totalHeatInput: entity.totalHeatInput,
      calculatedTotalHeatInput: entity.calculatedTotalHeatInput,
      responseTime: entity.responseTime,
      beginDate: entity.beginDate,
      beginHour: entity.beginHour,
      beginMinute: entity.beginMinute,
      endDate: entity.endDate,
      endHour: entity.endHour,
      endMinute: entity.endMinute,

      appECorrelationHeatInputFromOilData: [],
      appECorrelationHeatInputFromGasData: [],
      
      userId: entity.userId,
      addDate: entity.addDate ? entity.addDate.toLocaleString() : null,
      updateDate: entity.updateDate ? entity.updateDate.toLocaleString() : null,
    };
  }
}