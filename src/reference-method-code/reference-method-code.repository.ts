import { EntityRepository, Repository } from 'typeorm';
import { ReferenceMethodCode } from '../entities/workspace/reference-method-code.entity';

@EntityRepository(ReferenceMethodCode)
export class ReferenceMethodCodeRepository extends Repository<
  ReferenceMethodCode
> {}
