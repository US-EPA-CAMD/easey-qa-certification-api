import { EntityRepository, Repository } from 'typeorm';
import { TransmitterTransducerAccuracy } from '../entities/workspace/transmitter-transducer-accuracy.entity';

@EntityRepository(TransmitterTransducerAccuracy)
export class TransmitterTransducerAccuracyWorkspaceRepository extends Repository<
  TransmitterTransducerAccuracy
> {}
