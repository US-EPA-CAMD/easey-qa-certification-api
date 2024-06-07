import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { TransmitterTransducerAccuracy } from '../entities/transmitter-transducer-accuracy.entity';

@Injectable()
export class TransmitterTransducerAccuracyRepository extends Repository<
  TransmitterTransducerAccuracy
> {
  constructor(entityManager: EntityManager) {
    super(TransmitterTransducerAccuracy, entityManager);
  }
}
