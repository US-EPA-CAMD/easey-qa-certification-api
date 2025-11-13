import { Injectable } from '@nestjs/common';
import { EntityManager, Repository, SelectQueryBuilder } from 'typeorm';

import { QACertificationEvent } from '../entities/qa-certification-event.entity';
import {
  addBeginAndEndDateWhere,
  addJoins,
  addQACertEventIdWhere,
} from '../utilities/qa-cert-events.querybuilder';
import { withSlaveConnection } from '@us-epa-camd/easey-common';

@Injectable()
export class QACertificationEventRepository extends Repository<
  QACertificationEvent
> {
  constructor( entityManager: EntityManager) {
    super(QACertificationEvent, entityManager);
  }

  private buildBaseQuery(qr:EntityManager): SelectQueryBuilder<QACertificationEvent> {
    const query = qr.createQueryBuilder(QACertificationEvent, 'qce');
    return addJoins(query) as SelectQueryBuilder<QACertificationEvent>;
  }

  async getQACertificationEventById(
    qaCertEventId: string,
  ): Promise<QACertificationEvent> {
     return withSlaveConnection(this.manager.connection, async (qr) => {
      const query = this.buildBaseQuery(qr).where('qce.id = :qaCertEventId', {
       qaCertEventId,
    });
    return query.getOne()
  });
  }

  async getQACertificationEventsByLocationId(
    locationId: string,
  ): Promise<QACertificationEvent[]> {
    return withSlaveConnection(this.manager.connection, async (qr) => {
     const query = this.buildBaseQuery(qr).where('qce.locationId = :locationId', {
      locationId,
    });
    return query.getMany();
  });
  }

  async getQaCertEventsByUnitStack(
    facilityId: number,
    unitIds?: string[],
    stackPipeIds?: string[],
    qaCertificationEventIds?: string[],
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


    return withSlaveConnection(this.manager.connection, async (qr) => {
       
    let query = this.buildBaseQuery(qr).where(`(${unitsWhere}${stacksWhere})`, {
      facilityId,
      unitIds,
      stackPipeIds,
    });

    query = addQACertEventIdWhere(
      query,
      qaCertificationEventIds,
    ) as SelectQueryBuilder<QACertificationEvent>;

    query = addBeginAndEndDateWhere(
      query,
      beginDate,
      endDate,
    ) as SelectQueryBuilder<QACertificationEvent>;

    return query.getMany()
    });
  }
}
