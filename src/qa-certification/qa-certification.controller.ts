import { Get, Query, Controller } from '@nestjs/common';

import {
  ApiTags,
  ApiOkResponse,
  ApiSecurity,
  ApiQuery,
  ApiOperation,
} from '@nestjs/swagger';

import { QACertificationDTO } from '../dto/qa-certification.dto';
import { QACertificationParamsDTO } from '../dto/qa-certification-params.dto';
import { QACertificationService } from './qa-certification.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('QA Certification')
export class QACertificationController {
  constructor(private readonly service: QACertificationService) {}

  @Get('export')
  @ApiOperation({
    summary: 'Exports official QA Certification data',
  })
  @ApiOkResponse({
    type: QACertificationDTO,
    description: 'Successfull export of official QA Certification data',
  })
  @ApiQuery({
    style: 'pipeDelimited',
    name: 'unitIds',
    required: false,
    explode: false,
  })
  @ApiQuery({
    style: 'pipeDelimited',
    name: 'stackPipeIds',
    required: false,
    explode: false,
  })
  @ApiQuery({
    style: 'pipeDelimited',
    name: 'testSummaryIds',
    required: false,
    explode: false,
  })
  @ApiQuery({
    style: 'pipeDelimited',
    name: 'testTypeCodes',
    required: false,
    explode: false,
  })
  async export(
    @Query() params: QACertificationParamsDTO,
  ): Promise<QACertificationDTO> {
    return this.service.export(params, params.reportedValuesOnly);
  }
}
