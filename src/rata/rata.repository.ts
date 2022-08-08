import { Rata } from '../entities/workspace/rata.entity';
import { Repository, EntityRepository } from 'typeorm';

@EntityRepository(Rata)
export class RataRepository extends Repository<Rata> {}
