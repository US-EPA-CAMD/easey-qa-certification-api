import {
  Get,
  Body,
  Post,
  Query,
  Controller,
} from '@nestjs/common';

import {
  ApiTags,
  ApiOkResponse,
  ApiBearerAuth,
  ApiSecurity,
  ApiQuery,
} from '@nestjs/swagger';

import {
  QACertificationImportDTO,
  QACertificationDTO
} from '../dto/qa-certification.dto';

import { QACertificationParamsDTO } from '../dto/qa-certification-params.dto';
import { QACertificationWorkspaceService } from './qa-certification.service';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('QA Certification')
export class QACertificationWorkspaceController {
  
  constructor(
    private readonly service: QACertificationWorkspaceService
  ) {}

  @Get('export')
  @ApiOkResponse({
    type: QACertificationDTO,
    description: 'Exports worksapce QA Certification data',
  })
  @ApiQuery({ style: 'pipeDelimited', name: 'unitId', required: false, explode: false, })
  @ApiQuery({ style: 'pipeDelimited', name: 'stackPipeId', required: false, explode: false, })
  async export(
    @Query() params: QACertificationParamsDTO,
  ): Promise<QACertificationDTO> {
    return this.service.export(params);
  }

  @Post('import')
  @ApiBearerAuth('Token')
  //@UseGuards(AuthGuard)
  @ApiOkResponse({
    type: QACertificationDTO,
    description: 'Imports QA Certification data from JSON file into the workspace',
  })
  async import(
    @Body() _payload: QACertificationImportDTO,
  ) {
    return;
  }
}
