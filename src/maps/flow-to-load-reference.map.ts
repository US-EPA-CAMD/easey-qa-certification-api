import { Injectable } from '@nestjs/common';
import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { FlowToLoadReferenceDTO } from '../dto/flow-to-load-reference.dto';
import { FlowToLoadReference } from '../entities/flow-to-load-reference.entity';

@Injectable()
export class FlowToLoadReferenceMap extends BaseMap<
  FlowToLoadReference,
  FlowToLoadReferenceDTO
> {
  public async one(
    entity: FlowToLoadReference,
  ): Promise<FlowToLoadReferenceDTO> {
    return {
      id: entity.id,
      testSumId: entity.testSumId,
      rataTestNumber: entity.rataTestNumber,
      operatingLevelCode: entity.operatingLevelCode,
      averageGrossUnitLoad: entity.averageGrossUnitLoad,
      calculatedAverageGrossUnitLoad: entity.calculatedAverageGrossUnitLoad,
      averageReferenceMethodFlow: entity.averageReferenceMethodFlow,
      calculatedAverageReferenceMethodFlow:
        entity.calculatedAverageReferenceMethodFlow,
      referenceFlowToLoadRatio: entity.referenceFlowToLoadRatio,
      calculatedReferenceFlowToLoadRatio:
        entity.calculatedReferenceFlowToLoadRatio,
      averageHourlyHeatInputRate: entity.averageHourlyHeatInputRate,
      referenceGrossHeatRate: entity.referenceGrossHeatRate,
      calculatedReferenceGrossHeatRate: entity.calculatedReferenceGrossHeatRate,
      calculatedSeparateReferenceIndicator:
        entity.calculatedSeparateReferenceIndicator,
      userId: entity.userId,
      addDate: entity.addDate ? entity.addDate.toLocaleString() : null,
      updateDate: entity.updateDate ? entity.updateDate.toLocaleString() : null,
    };
  }
}
