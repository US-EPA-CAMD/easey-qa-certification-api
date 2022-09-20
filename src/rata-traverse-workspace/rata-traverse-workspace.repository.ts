import { EntityRepository, Repository } from 'typeorm';
import { RataTraverse } from '../entities/workspace/rata-traverse.entity';

@EntityRepository(RataTraverse)
export class RataTraverseWorkpsaceRepository extends Repository<RataTraverse> {}
