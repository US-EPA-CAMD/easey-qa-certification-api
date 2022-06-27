import { EntityRepository, Repository } from 'typeorm';

import { MonitorLocation } from '../entities/workspace/monitor-location.entity';

@EntityRepository(MonitorLocation)
export class LocationWorkspaceRepository extends Repository<MonitorLocation> {
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

    if (
      unitIds &&
      unitIds.length > 0 &&
      stackPipeIds &&
      stackPipeIds.length > 0
    ) {
      unitsWhere = `(${unitsWhere})`;
      stacksWhere = ` OR (${stacksWhere})`;
    }

    const query = this.createQueryBuilder('ml')
      .innerJoinAndSelect('ml.systems', 'ms')
      .innerJoinAndSelect('ml.components', 'c')
      .leftJoinAndSelect('ml.unit', 'u')
      .leftJoin('u.plant', 'up')
      .leftJoinAndSelect('ml.stackPipe', 'sp')
      .leftJoin('sp.plant', 'spp')
      .where(`${unitsWhere}${stacksWhere}`, {
        facilityId,
        unitIds,
        stackPipeIds,
      });

    return query.getMany();
  }
}
