import { SelectQueryBuilder } from 'typeorm';
import { QACertificationEvent as WorkspaceQACertificationEvent } from '../entities/workspace/qa-certification-event.entity';
import { QACertificationEvent } from '../entities/qa-certification-event.entity';

export const addJoins = (
  query: SelectQueryBuilder<
    WorkspaceQACertificationEvent | QACertificationEvent
  >,
): SelectQueryBuilder<WorkspaceQACertificationEvent | QACertificationEvent> => {
  return query
    .innerJoinAndSelect('qace.location', 'ml')
    .leftJoinAndSelect('qace.system', 'ms')
    .leftJoinAndSelect('qace.component', 'c')
    .leftJoinAndSelect('ml.unit', 'u')
    .leftJoinAndSelect('ml.stackPipe', 'sp');
};
