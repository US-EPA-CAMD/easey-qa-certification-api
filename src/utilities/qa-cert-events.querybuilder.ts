import { QACertificationEvent } from '../entities/qa-certification-event.entity';
import { QACertificationEvent as WorkspaceQACertificationEvent } from '../entities/workspace/qa-certification-event.entity';
import { Brackets, SelectQueryBuilder } from 'typeorm';

export const addJoins = (
  query: SelectQueryBuilder<
    QACertificationEvent | WorkspaceQACertificationEvent
  >,
): SelectQueryBuilder<QACertificationEvent | WorkspaceQACertificationEvent> => {
  return query
    .innerJoinAndSelect('qce.location', 'ml')
    .leftJoinAndSelect('qce.system', 'ms')
    .leftJoinAndSelect('qce.component', 'c')
    .leftJoinAndSelect('ml.unit', 'u')
    .leftJoin('u.plant', 'up')
    .leftJoinAndSelect('ml.stackPipe', 'sp')
    .leftJoin('sp.plant', 'spp');
};

export const addQACertEventIdWhere = (
  query: any,
  qaCertificationEventIds: string[],
): SelectQueryBuilder<QACertificationEvent | WorkspaceQACertificationEvent> => {
  if (qaCertificationEventIds) {
    query.andWhere('qce.id IN (:...qaCertificationEventIds)', {
      qaCertificationEventIds,
    });
  }
  return query;
};

export const addBeginAndEndDateWhere = (
  query: SelectQueryBuilder<
    QACertificationEvent | WorkspaceQACertificationEvent
  >,
  beginDate: Date,
  endDate: Date,
): SelectQueryBuilder<QACertificationEvent | WorkspaceQACertificationEvent> => {
  if (beginDate && endDate) {
    query.andWhere(
      new Brackets(qb1 => {
        qb1.where(
          new Brackets(qb2 => {
            qb2.andWhere(
              'qce.qaCertEventDate BETWEEN :beginDate AND :endDate',
              {
                beginDate,
                endDate,
              },
            );
          }),
        );
      }),
    );
  }

  return query;
};
