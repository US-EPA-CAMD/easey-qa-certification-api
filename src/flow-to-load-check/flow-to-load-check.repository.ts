import { EntityRepository, Repository } from 'typeorm';
import { FlowToLoadCheck } from '../entities/flow-to-load-check.entity';

@EntityRepository(FlowToLoadCheck)
export class FlowToLoadCheckRepository extends Repository<FlowToLoadCheck> {}
