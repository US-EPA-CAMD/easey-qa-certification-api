import { EntityRepository, Repository } from 'typeorm';
import { MonitorLocation } from '../entities/monitor-location.entity';

@EntityRepository(MonitorLocation)
export class MonitorLocationRepository extends Repository<MonitorLocation> {
  async getLocationByIdUnitIdStackPipeId(
    locationId: string,
    unitId?: string,
    stackPipeId?: string,
  ): Promise<MonitorLocation> {
    const query = this.createQueryBuilder('ml')
      .leftJoinAndSelect('ml.unit', 'u')
      .leftJoinAndSelect('ml.stackPipe', 'sp')
      .where(`ml.mon_loc_id = :locationId`, {
        locationId,
      });

    if (unitId) {
      query.andWhere(`u.name = :unitId`, { unitId });
    }

    if (stackPipeId) {
      query.andWhere(`sp.name = :stackPipeId`, { stackPipeId });
    }
    return query.getOne();
  }
}
