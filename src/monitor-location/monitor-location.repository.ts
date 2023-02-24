import { EntityRepository, Repository } from 'typeorm';
import { MonitorLocation } from '../entities/monitor-location.entity';

@EntityRepository(MonitorLocation)
export class MonitorLocationRepository extends Repository<MonitorLocation> {
  async getLocationsById(locationId: string): Promise<MonitorLocation> {
    const query = this.createQueryBuilder('ml')
      .leftJoinAndSelect('ml.unit', 'u')
      .leftJoinAndSelect('ml.stackPipe', 'sp')
      .where(`ml.mon_loc_id = :locationId`, {
        locationId,
      });

    return query.getOne();
  }
}
