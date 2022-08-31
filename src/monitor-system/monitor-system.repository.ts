import { MonitorSystem } from '../entities/monitor-system.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(MonitorSystem)
export class MonitorSystemRepository extends Repository<MonitorSystem> {}
