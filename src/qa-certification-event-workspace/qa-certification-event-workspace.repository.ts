import { Injectable } from '@nestjs/common';
import { EntityManager, Repository, SelectQueryBuilder } from 'typeorm';

import {
  addBeginAndEndDateWhere,
  addJoins,
  addQACertEventIdWhere,
} from '../utilities/qa-cert-events.querybuilder';
import { QACertificationEvent } from '../entities/workspace/qa-certification-event.entity';

@Injectable()
export class QACertificationEventWorkspaceRepository extends Repository<
  QACertificationEvent
> {
  constructor(entityManager: EntityManager) {
    super(QACertificationEvent, entityManager);
  }

  private buildBaseQuery(): SelectQueryBuilder<QACertificationEvent> {
    const query = this.createQueryBuilder('qce');
    return addJoins(query) as SelectQueryBuilder<QACertificationEvent>;
  }

  async getQACertificationEventById(
    qaCertEventId: string,
  ): Promise<QACertificationEvent> {
    const query = this.buildBaseQuery().where('qce.id = :qaCertEventId', {
      qaCertEventId,
    });
    return query.getOne();
  }

  async getQACertificationEventsByLocationId(
    locationId: string,
  ): Promise<QACertificationEvent[]> {
    const query = this.buildBaseQuery().where('qce.locationId = :locationId', {
      locationId,
    });
    return query.getMany();
  }

  async getQaCertEventsByUnitStack(
    facilityId: number,
    unitIds?: string[],
    stackPipeIds?: string[],
    qaCertEventIds?: string[],
    beginDate?: Date,
    endDate?: Date,
  ): Promise<QACertificationEvent[]> {
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

    let query = this.buildBaseQuery().where(`(${unitsWhere}${stacksWhere})`, {
      facilityId,
      unitIds,
      stackPipeIds,
    });

    query = addQACertEventIdWhere(query, qaCertEventIds) as SelectQueryBuilder<
      QACertificationEvent
    >;
    query = addBeginAndEndDateWhere(
      query,
      beginDate,
      endDate,
    ) as SelectQueryBuilder<QACertificationEvent>;

    return query.getMany();
  }
}
