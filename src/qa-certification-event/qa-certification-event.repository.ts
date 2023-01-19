import { EntityRepository, Repository } from 'typeorm';
import { QACertificationEvent } from '../entities/qa-certification-event.entity';

@EntityRepository(QACertificationEvent)
export class QACertificationEventRepository extends Repository<
  QACertificationEvent
> {}
