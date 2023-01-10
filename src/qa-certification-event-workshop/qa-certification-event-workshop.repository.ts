import { EntityRepository, Repository } from 'typeorm';
import { QACertificationEvent } from '../entities/workspace/qa-certification-event.entity';

@EntityRepository(QACertificationEvent)
export class QACertificationEventWorkspaceRepository extends Repository<
  QACertificationEvent
> {}
