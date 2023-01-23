import {
  addJoins,
  addTestSummaryIdWhere,
} from '../utilities/qa-cert-events.querybuilder';
import { EntityRepository, Repository, SelectQueryBuilder } from 'typeorm';
import { QACertificationEvent } from '../entities/qa-certification-event.entity';

@EntityRepository(QACertificationEvent)
export class QACertificationEventRepository extends Repository<
  QACertificationEvent
> {
  private buildBaseQuery(): SelectQueryBuilder<QACertificationEvent> {
    const query = this.createQueryBuilder('qce');
    return addJoins(query) as SelectQueryBuilder<QACertificationEvent>;
  }

  async getQaCertEventsByUnitStack(
    facilityId: number,
    unitIds?: string[],
    stackPipeIds?: string[],
    qaCertificationEventIds?: string[],
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

    query = addTestSummaryIdWhere(
      query,
      qaCertificationEventIds,
    ) as SelectQueryBuilder<QACertificationEvent>;

    return query.getMany();
  }
}
