import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In } from 'typeorm';

import { EaseyException } from '@us-epa-camd/easey-common/exceptions';
import { TransmitterTransducerAccuracyRepository } from './transmitter-transducer-accuracy.repository';
import { TransmitterTransducerAccuracyMap } from '../maps/transmitter-transducer-accuracy.map';
import { TransmitterTransducerAccuracyDTO } from '../dto/transmitter-transducer-accuracy.dto';

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
      throw new EaseyException(
        new Error(
          `A Transmitter Transducer Accuracy record not found with Record Id [${id}].`,
        ),
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

  async getTransmitterTransducerAccuraciesByTestSumIds(
    testSumIds: string[],
  ): Promise<TransmitterTransducerAccuracyDTO[]> {
    const results = await this.repository.find({
      where: { testSumId: In(testSumIds) },
    });

    return this.map.many(results);
  }

  async export(
    testSumIds: string[],
  ): Promise<TransmitterTransducerAccuracyDTO[]> {
    return this.getTransmitterTransducerAccuraciesByTestSumIds(testSumIds);
  }
}
