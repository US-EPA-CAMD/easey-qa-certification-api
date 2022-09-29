import {
  Get,
  Body,
  Post,
  Query,
  Controller,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import {
  ApiTags,
  ApiOkResponse,
  ApiBearerAuth,
  ApiSecurity,
  ApiQuery,
} from '@nestjs/swagger';

import { User } from '@us-epa-camd/easey-common/decorators';
import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';

import {
  QACertificationImportDTO,
  QACertificationDTO,
} from '../dto/qa-certification.dto';

import { QACertificationParamsDTO } from '../dto/qa-certification-params.dto';
import { QACertificationWorkspaceService } from './qa-certification.service';
import { QACertificationChecksService } from './qa-certification-checks.service';
import { FormatValidationErrorsInterceptor } from '../interceptors/format-validation-errors.interceptor';
import { LocationIdentifiers } from '../interfaces/location-identifiers.interface';
import { QASuppData } from '../entities/workspace/qa-supp-data.entity';

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
  @ApiQuery({
    style: 'pipeDelimited',
    name: 'testTypeCodes',
    required: false,
    explode: false,
  })
  async export(
    @Query() params: QACertificationParamsDTO,
  ): Promise<QACertificationDTO> {
    return this.service.export(params);
  }

  @Post('import')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
  @ApiOkResponse({
    type: QACertificationDTO,
    description:
      'Imports QA Certification data from JSON file into the workspace',
  })
  @UseInterceptors(FormatValidationErrorsInterceptor)
  async import(
    @Body() payload: QACertificationImportDTO,
    @User() user: CurrentUser,
  ) {
    let qaSuppRecords: QASuppData[] = [];
    let locations: LocationIdentifiers[] = [];

    [locations, qaSuppRecords] = await this.checksService.runChecks(payload);
    return this.service.import(locations, payload, user.userId, qaSuppRecords);
  }
}
