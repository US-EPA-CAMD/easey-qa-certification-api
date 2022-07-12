import {
  Get,
  Body,
  Post,
  Query,
  Controller,
  UseInterceptors,
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
  QACertificationDTO,
} from '../dto/qa-certification.dto';

import { QACertificationParamsDTO } from '../dto/qa-certification-params.dto';
import { QACertificationWorkspaceService } from './qa-certification.service';
import { QACertificationChecksService } from './qa-certification-checks.service';
import { FormatValidationErrorsInterceptor } from '../interceptors/format-validation-errors.interceptor';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('QA Certification')
export class QACertificationWorkspaceController {
  constructor(
    private readonly service: QACertificationWorkspaceService,
    private readonly checksService: QACertificationChecksService,
  ) {}

  @Get('export')
  @ApiOkResponse({
    type: QACertificationDTO,
    description: 'Exports worksapce QA Certification data',
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
    description:
      'Imports QA Certification data from JSON file into the workspace',
  })
  @UseInterceptors(FormatValidationErrorsInterceptor)
  async import(
    @Body() payload: QACertificationImportDTO,
    //    @CurrentUser() userId: string,
  ) {
    const userId = 'testUser';
    const locations = await this.checksService.runChecks(payload);
    return this.service.import(locations, payload, userId);
  }
}
