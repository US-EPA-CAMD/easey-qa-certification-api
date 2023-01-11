import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { QaCertificationEventWorkshopService } from './qa-certification-event-workshop.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';

import { AuthGuard } from '@us-epa-camd/easey-common/guards';
import { User } from '@us-epa-camd/easey-common/decorators';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';

import {
  QACertificationEventBaseDTO,
  QACertificationEventRecordDTO,
} from '../dto/qa-certification-event.dto';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('QA Certification Event')
export class QaCertificationEventWorkshopController {
  constructor(private readonly service: QaCertificationEventWorkshopService) {}

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
}
