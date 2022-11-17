import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransmitterTransducerAccuracyRepository } from './transmitter-transducer-accuracy.repository';
import { TransmitterTransducerAccuracyMap } from '../maps/transmitter-transducer-accuracy.map';
import { TransmitterTransducerAccuracyDTO } from '../dto/transmitter-transducer-accuracy.dto';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';

@Injectable()
export class TransmitterTransducerAccuracyService {
  constructor(
    @InjectRepository(TransmitterTransducerAccuracyRepository)
    private readonly repository: TransmitterTransducerAccuracyRepository,
    private readonly map: TransmitterTransducerAccuracyMap,
  ) {}

  async getTransmitterTransducerAccuracy(
    id: string,
  ): Promise<TransmitterTransducerAccuracyDTO> {
    const entity = await this.repository.findOne(id);

    if (!entity) {
      throw new LoggingException(
        `A Transmitter Transducer Accuracy record not found with Record Id [${id}].`,
        HttpStatus.NOT_FOUND,
      );
    }

    return this.map.one(entity);
  }

  async getTransmitterTransducerAccuracies(
    testSumId: string,
  ): Promise<TransmitterTransducerAccuracyDTO[]> {
    const records = await this.repository.find({
      where: { testSumId },
    });

    return this.map.many(records);
  }
}
