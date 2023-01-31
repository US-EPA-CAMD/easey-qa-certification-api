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
import { User } from '@us-epa-camd/easey-common/decorators';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';

import {
  QACertificationEventBaseDTO,
  QACertificationEventDTO,
  QACertificationEventRecordDTO,
} from '../dto/qa-certification-event.dto';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('QA Certification Event')
export class QACertificationEventWorkspaceController {
  constructor(private readonly service: QACertificationEventWorkspaceService) {}

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: QACertificationEventDTO,
    description:
      'Retrieves workspace QA Certification Event records by Location Id',
  })
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
  getQACertEvent(
    @Param('locId') locationId: string,
    @Param('id') id: string,
  ): Promise<QACertificationEventDTO> {
    return this.service.getQACertEvent(id);
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
  @ApiCreatedResponse({
    type: QACertificationEventBaseDTO,
    description: 'Create a QA Certification Event record in the workspace',
  })
  createQACertEvent(
    @Param('locId') locationId: string,
    @Body() payload: QACertificationEventBaseDTO,
    @User() user: CurrentUser,
  ): Promise<QACertificationEventRecordDTO> {
    return this.service.createQACertEvent(locationId, payload, user.userId);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
  @ApiOkResponse({
    type: QACertificationEventBaseDTO,
    description: 'Updates a QA Certification Event record in the workspace',
  })
  updateQACertEvent(
    @Param('locId') locationId: string,
    @Param('id') id: string,
    @Body() payload: QACertificationEventBaseDTO,
    @User() user: CurrentUser,
  ): Promise<QACertificationEventDTO> {
    return this.service.updateQACertEvent(locationId, id, payload, user.userId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token')
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
