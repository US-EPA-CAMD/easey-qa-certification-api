import { Unit } from '../entities/workspace/unit.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Unit)
export class UnitRepository extends Repository<Unit> {}
