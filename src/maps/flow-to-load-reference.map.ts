import { Injectable } from '@nestjs/common';
import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { FlowToLoadReferenceDTO } from 'src/dto/flow-to-load-reference.dto';
import { FlowToLoadReference } from 'src/entities/flow-to-load-reference.entity';

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
      operatingLevelCode: entity.operatingLevelCode,
      rataTestNumber: entity.rataTestNumber,
      averageGrossUnitLoad: entity.averageGrossUnitLoad,
      averageReferenceMethodFlow: entity.averageReferenceMethodFlow,
      referenceFlowToLoadRatio: entity.referenceFlowToLoadRatio,
      averageHourlyHeatInputRate: entity.averageHourlyHeatInputRate,
      referenceGrossHeatRate: entity.referenceGrossHeatRate,
      calculatedSeparateReferenceIndicator:
        entity.calculatedSeparateReferenceIndicator,
      userId: entity.userId,
      addDate: entity.addDate ? entity.addDate.toLocaleString() : null,
      updateDate: entity.updateDate ? entity.updateDate.toLocaleString() : null,
    };
  }
}
