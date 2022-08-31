import { Rata } from '../entities/rata.entity';
import { Repository, EntityRepository } from 'typeorm';

@EntityRepository(Rata)
export class RataRepository extends Repository<Rata> {}
