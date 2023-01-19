import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoggingException } from '@us-epa-camd/easey-common/exceptions';

import { QACertificationEventMap } from '../maps/qa-certification-event.map';
import { QACertificationEventRepository } from './qa-certification-event.repository';
import { QACertificationEventRecordDTO } from '../dto/qa-certification-event.dto';

@Injectable()
export class QaCertificationEventService {
  constructor(
    private readonly map: QACertificationEventMap,
    @InjectRepository(QACertificationEventRepository)
    private readonly repository: QACertificationEventRepository,
  ) {}

  async getQACertEvent(id: string): Promise<QACertificationEventRecordDTO> {
    const result = await this.repository.findOne(id);

    if (!result) {
      throw new LoggingException(
        `A QA Certification Event record not found with Record Id [${id}]`,
        HttpStatus.NOT_FOUND,
      );
    }

    return this.map.one(result);
  }
}
