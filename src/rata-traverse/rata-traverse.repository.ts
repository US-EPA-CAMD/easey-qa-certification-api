import { EntityRepository, Repository } from 'typeorm';
import { RataTraverse } from '../entities/rata-traverse.entity';

@EntityRepository(RataTraverse)
export class RataTraverseRepository extends Repository<RataTraverse> {}
