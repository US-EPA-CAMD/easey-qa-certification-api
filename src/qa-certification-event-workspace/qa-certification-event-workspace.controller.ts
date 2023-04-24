import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { QACertificationEventWorkspaceService } from './qa-certification-event-workspace.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';

import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { RoleGuard, User } from '@us-epa-camd/easey-common/decorators';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';

import {
  QACertificationEventBaseDTO,
  QACertificationEventDTO,
  QACertificationEventRecordDTO,
} from '../dto/qa-certification-event.dto';
import { QACertificationEventChecksService } from './qa-certification-event-checks.service';
import { LookupType } from '@us-epa-camd/easey-common/enums';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('QA Certification Event')
export class QACertificationEventWorkspaceController {
  constructor(
    private readonly service: QACertificationEventWorkspaceService,
    private readonly checksService: QACertificationEventChecksService,
  ) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: QACertificationEventDTO,
    description:
      'Retrieves workspace QA Certification Event records by Location Id',
  })
  @RoleGuard({ pathParam: 'locId' }, LookupType.Location)
  async getQACertEvents(
    @Param('locId') locationId: string,
  ): Promise<QACertificationEventDTO[]> {
    return this.service.getQACertEventsByLocationId(locationId);
  }

  @Get(':id')
  @ApiOkResponse({
    isArray: false,
    type: QACertificationEventDTO,
    description: 'Retrieves workspace QA Certification Event record by its Id',
  })
  @RoleGuard({ pathParam: 'locId' }, LookupType.Location)
  getQACertEvent(
    @Param('locId') locationId: string,
    @Param('id') id: string,
  ): Promise<QACertificationEventDTO> {
    return this.service.getQACertEvent(id);
  }

  @Post()
  @RoleGuard({ pathParam: 'locId' }, LookupType.Location)
  @ApiCreatedResponse({
    type: QACertificationEventBaseDTO,
    description: 'Create a QA Certification Event record in the workspace',
  })
  async createQACertEvent(
    @Param('locId') locationId: string,
    @Body() payload: QACertificationEventBaseDTO,
    @User() user: CurrentUser,
  ): Promise<QACertificationEventRecordDTO> {
    await this.checksService.runChecks(locationId, payload, null, false, false);
    return this.service.createQACertEvent(locationId, payload, user.userId);
  }

  @Put(':id')
  @RoleGuard({ pathParam: 'locId' }, LookupType.Location)
  @ApiOkResponse({
    type: QACertificationEventBaseDTO,
    description: 'Updates a QA Certification Event record in the workspace',
  })
  async updateQACertEvent(
    @Param('locId') locationId: string,
    @Param('id') id: string,
    @Body() payload: QACertificationEventBaseDTO,
    @User() user: CurrentUser,
  ): Promise<QACertificationEventDTO> {
    await this.checksService.runChecks(locationId, payload, null, false, true);
    return this.service.updateQACertEvent(locationId, id, payload, user.userId);
  }

  @Delete(':id')
  @RoleGuard({ pathParam: 'locId' }, LookupType.Location)
  @ApiOkResponse({
    description: 'Deletes a QA Certification Event from the workspace',
  })
  async deleteTestExtensionExemption(
    @Param('locId') _locationId: string,
    @Param('id') id: string,
    @User() _user: CurrentUser,
  ): Promise<void> {
    return this.service.deleteQACertEvent(id);
  }
}
