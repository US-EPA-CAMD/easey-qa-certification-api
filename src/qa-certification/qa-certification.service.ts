import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Logger } from '@us-epa-camd/easey-common/logger';

import { QACertificationDTO } from '../dto/qa-certification.dto';
import { QACertificationParamsDTO } from '../dto/qa-certification-params.dto';

@Injectable()
export class QACertificationService {
  constructor(
    private readonly logger: Logger,
    private readonly configService: ConfigService,
  ) {}

  async export(
    params: QACertificationParamsDTO,
  ): Promise<QACertificationDTO> {
    return new QACertificationDTO();
  }
}
