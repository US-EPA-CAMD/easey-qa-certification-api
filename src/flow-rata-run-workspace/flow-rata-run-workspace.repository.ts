import { EntityRepository, Repository } from 'typeorm';
import { FlowRataRun } from '../entities/workspace/flow-rata-run.entity';

@EntityRepository(FlowRataRun)
export class FlowRataRunWorkspaceRepository extends Repository<FlowRataRun> {}
