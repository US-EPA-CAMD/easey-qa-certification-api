import {
  Get,
  Query,
  Controller,
} from '@nestjs/common';

import {
  ApiTags,
  ApiOkResponse,
  ApiSecurity,
  ApiQuery,
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
    type: QACertificationDTO,
    description: 'Exports official QA Certification data',
  })
  @ApiQuery({ style: 'pipeDelimited', name: 'unitId', required: false, explode: false, })
  @ApiQuery({ style: 'pipeDelimited', name: 'stackPipeId', required: false, explode: false, })
  async export(
    @Query() params: QACertificationParamsDTO,
  ): Promise<QACertificationDTO> {
    return this.service.export(params);
  }
}
