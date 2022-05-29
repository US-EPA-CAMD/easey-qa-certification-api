import {
  Get,
  Query,
  Controller,
} from '@nestjs/common';

import {
  ApiTags,
  ApiOkResponse,
  ApiSecurity,
} from '@nestjs/swagger';

import { QACertificationDTO } from '../dto/qa-certification.dto';
import { QACertificationParamsDTO } from '../dto/qa-certification-params.dto';
import { QACertificationService } from './qa-certification.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('QA Certification')
export class QACertificationController {
  
  constructor(
    private readonly service: QACertificationService
  ) {}

  @Get('export')
  @ApiOkResponse({
    description: 'Exports official QA Certification data',
  })
  async export(
    @Query() params: QACertificationParamsDTO,
  ): Promise<QACertificationDTO> {
    return this.service.export(params);
  }
}
