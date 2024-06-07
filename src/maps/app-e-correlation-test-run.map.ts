import { Injectable } from '@nestjs/common';
import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { AppECorrelationTestRun } from '../entities/app-e-correlation-test-run.entity';
import { AppECorrelationTestRunDTO } from '../dto/app-e-correlation-test-run.dto';
import { AppEHeatInputFromOilMap } from './app-e-heat-input-from-oil.map';
import { AppEHeatInputFromGasMap } from './app-e-heat-input-from-gas.map';

@Injectable()
export class AppECorrelationTestRunMap extends BaseMap<
  AppECorrelationTestRun,
  AppECorrelationTestRunDTO
> {
  constructor(
    private readonly appEHeatInputFromOilMap: AppEHeatInputFromOilMap,
    private readonly appEHeatInputFromGasMap: AppEHeatInputFromGasMap,
  ) {
    super();
  }

  public async one(
    entity: AppECorrelationTestRun,
  ): Promise<AppECorrelationTestRunDTO> {
    const appEHeatInputFromOils = entity.appEHeatInputFromOils
      ? await this.appEHeatInputFromOilMap.many(entity.appEHeatInputFromOils)
      : [];

    const appEHeatInputFromGases = entity.appEHeatInputFromGases
      ? await this.appEHeatInputFromGasMap.many(entity.appEHeatInputFromGases)
      : [];

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
      userId: entity.userId,
      addDate: entity.addDate ? entity.addDate.toISOString() : null,
      updateDate: entity.updateDate ? entity.updateDate.toISOString() : null,
      appendixEHeatInputFromOilData: appEHeatInputFromOils,
      appendixEHeatInputFromGasData: appEHeatInputFromGases,
    };
  }
}
