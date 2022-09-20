import { EntityRepository, Repository } from 'typeorm';
import { FlowRataRun } from '../entities/flow-rata-run.entity';

@EntityRepository(FlowRataRun)
export class FlowRataRunRepository extends Repository<FlowRataRun> {}
