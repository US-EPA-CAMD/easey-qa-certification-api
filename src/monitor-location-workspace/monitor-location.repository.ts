import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { MonitorLocation } from '../entities/workspace/monitor-location.entity';

@Injectable()
export class LocationWorkspaceRepository extends Repository<MonitorLocation> {
  constructor(entityManager: EntityManager) {
    super(MonitorLocation, entityManager);
  }

  private buildBaseQuery() {
    return this.createQueryBuilder('ml')
      .leftJoinAndSelect('ml.systems', 'ms')
      .leftJoinAndSelect('ml.components', 'c')
      .leftJoinAndSelect('ml.unit', 'u')
      .leftJoin('u.plant', 'up')
      .leftJoinAndSelect('ml.stackPipe', 'sp')
      .leftJoin('sp.plant', 'spp');
  }

  async getLocationsByUnitStackPipeIds(
    facilityId: number,
    unitIds: string[],
    stackPipeIds: string[],
  ): Promise<MonitorLocation[]> {
    let unitsWhere =
      unitIds && unitIds.length > 0
        ? 'up.orisCode = :facilityId AND u.name IN (:...unitIds)'
        : '';

    let stacksWhere =
      stackPipeIds && stackPipeIds.length > 0
        ? 'spp.orisCode = :facilityId AND sp.name IN (:...stackPipeIds)'
        : '';

    if (unitIds?.length > 0 && stackPipeIds?.length > 0) {
      unitsWhere = `(${unitsWhere})`;
      stacksWhere = ` OR (${stacksWhere})`;
    }

    const query = this.buildBaseQuery().where(`${unitsWhere}${stacksWhere}`, {
      facilityId,
      unitIds,
      stackPipeIds,
    });

    return query.getMany();
  }

  async getLocationById(
    locationId: string,
    unitId: string,
    stackPipeId: string,
  ) {
    const query = this.buildBaseQuery().where('ml.id = :locationId', {
      locationId,
    });

    // Check for either unitId or stackPipeId
    if (unitId !== null && unitId !== undefined) {
      query.andWhere('u.name = :unitId', { unitId });
    } else {
      query.andWhere('sp.name = :stackPipeId', { stackPipeId });
    }

    return query.getOne();
  }
}
