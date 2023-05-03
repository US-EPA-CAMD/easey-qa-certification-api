import { Injectable } from '@nestjs/common';
import { BaseMap } from '@us-epa-camd/easey-common/maps';
import { TransmitterTransducerAccuracy } from '../entities/transmitter-transducer-accuracy.entity';
import { TransmitterTransducerAccuracyDTO } from '../dto/transmitter-transducer-accuracy.dto';

@Injectable()
export class TransmitterTransducerAccuracyMap extends BaseMap<
  TransmitterTransducerAccuracy,
  TransmitterTransducerAccuracyDTO
> {
  public async one(
    entity: TransmitterTransducerAccuracy,
  ): Promise<TransmitterTransducerAccuracyDTO> {
    return {
      id: entity.id,
      testSumId: entity.testSumId,
      lowLevelAccuracy: entity.lowLevelAccuracy,
      lowLevelAccuracySpecCode: entity.lowLevelAccuracySpecCode,
      midLevelAccuracy: entity.midLevelAccuracy,
      midLevelAccuracySpecCode: entity.midLevelAccuracySpecCode,
      highLevelAccuracy: entity.highLevelAccuracy,
      highLevelAccuracySpecCode: entity.highLevelAccuracySpecCode,
      userId: entity.userId,
      addDate: entity.addDate.toLocaleString(),
      updateDate: entity.updateDate.toLocaleString(),
    };
  }
}
