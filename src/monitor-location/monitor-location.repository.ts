import { EntityRepository, Repository } from 'typeorm';
import { MonitorLocation } from '../entities/workspace/monitor-location.entity';

@EntityRepository(MonitorLocation)
export class MonitorLocationRepository extends Repository<MonitorLocation> {}
