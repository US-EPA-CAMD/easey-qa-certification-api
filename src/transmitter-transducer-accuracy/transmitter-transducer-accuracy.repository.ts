import { EntityRepository, Repository } from 'typeorm';
import { TransmitterTransducerAccuracy } from '../entities/transmitter-transducer-accuracy.entity';

@EntityRepository(TransmitterTransducerAccuracy)
export class TransmitterTransducerAccuracyRepository extends Repository<TransmitterTransducerAccuracy> {}