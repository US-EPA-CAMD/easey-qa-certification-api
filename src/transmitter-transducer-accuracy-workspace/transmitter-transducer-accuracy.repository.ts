import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { TransmitterTransducerAccuracy } from '../entities/workspace/transmitter-transducer-accuracy.entity';

@Injectable()
export class TransmitterTransducerAccuracyWorkspaceRepository extends Repository<
  TransmitterTransducerAccuracy
> {
  constructor(entityManager: EntityManager) {
    super(TransmitterTransducerAccuracy, entityManager);
  }
}
