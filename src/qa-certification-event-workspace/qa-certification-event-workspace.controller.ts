import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { QACertificationEventWorkspaceService } from './qa-certification-event-workspace.service';
import {
  ApiCreatedResponse, ApiOkResponse,
  ApiSecurity,
  ApiTags, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';

import { AuditLog, RoleGuard, User } from '@us-epa-camd/easey-common/decorators';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';

import {
  QACertificationEventBaseDTO,
  QACertificationEventDTO,
  QACertificationEventRecordDTO,
} from '../dto/qa-certification-event.dto';
import { QACertificationEventChecksService } from './qa-certification-event-checks.service';
import { LookupType } from '@us-epa-camd/easey-common/enums';
import { ApiExcludeControllerByEnv } from '../decorators/swagger-decorator';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('QA Certification Event')
@ApiExcludeControllerByEnv()
@ApiExtraModels(QACertificationEventDTO)
export class QACertificationEventWorkspaceController {
  constructor(
    private readonly service: QACertificationEventWorkspaceService,
    private readonly checksService: QACertificationEventChecksService,
  ) {}

  @Get()
  @ApiOkResponse({
    description:
      'Retrieves workspace QA Certification Event records by Location Id',
    content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(QACertificationEventDTO) },
              },
            },
          },
        },
      }
  })
  @RoleGuard(
    {
      enforceCheckout: false,
      pathParam: 'locId',
      enforceEvalSubmitCheck: false,
    },
    LookupType.Location,
  )
  @AuditLog({
    label: 'Retrieved QA certification events for location',
    requestParamsOutFields: ['locId']
  })
  async getQACertEvents(
    @Param('locId') locationId: string,
  ): Promise<ArrayResponse<QACertificationEventDTO>> {
    const qaCertificationEvents = await this.service.getQACertEventsByLocationId(locationId);
    return { items: qaCertificationEvents };
  }

  @Get(':id')
  @ApiOkResponse({
    isArray: false,
    type: QACertificationEventDTO,
    description: 'Retrieves workspace QA Certification Event record by its Id',
  })
  @RoleGuard(
    {
      enforceCheckout: false,
      pathParam: 'locId',
      enforceEvalSubmitCheck: false,
    },
    LookupType.Location,
  )
  @AuditLog({
    label: 'Retrieved QA certification event by ID for location',
    requestParamsOutFields: ['locId', 'id']
  })
  getQACertEvent(
    @Param('locId') locationId: string,
    @Param('id') id: string,
  ): Promise<QACertificationEventDTO> {
    return this.service.getQACertEvent(id);
  }

  @Post()
  @RoleGuard(
    {
      pathParam: 'locId',
      requiredRoles: ['Preparer', 'Submitter', 'Sponsor', 'Initial Authorizer'],
      permissionsForFacility: ['DSQA'],
    },
    LookupType.Location,
  )
  @ApiCreatedResponse({
    type: QACertificationEventBaseDTO,
    description: 'Create a QA Certification Event record in the workspace',
  })
  @AuditLog({
    label: 'Created QA certification event for location',
    requestParamsOutFields: ['locId'],
    responseBodyOutFields: '*'
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
  @RoleGuard(
    {
      pathParam: 'locId',
      requiredRoles: ['Preparer', 'Submitter', 'Sponsor', 'Initial Authorizer'],
      permissionsForFacility: ['DSQA'],
    },
    LookupType.Location,
  )
  @ApiOkResponse({
    type: QACertificationEventBaseDTO,
    description: 'Updates a QA Certification Event record in the workspace',
  })
  @AuditLog({
    label: 'Updated QA certification event by ID for location',
    requestParamsOutFields: ['locId', 'id'],
    responseBodyOutFields: '*'
  })
  async updateQACertEvent(
    @Param('locId') locationId: string,
    @Param('id') id: string,
    @Body() payload: QACertificationEventBaseDTO,
    @User() user: CurrentUser,
  ): Promise<QACertificationEventDTO> {
    await this.checksService.runChecks(locationId, payload, null, false, true);
    return this.service.updateQACertEvent(id, payload, user.userId);
  }

  @Delete(':id')
  @RoleGuard(
    {
      pathParam: 'locId',
      requiredRoles: ['Preparer', 'Submitter', 'Sponsor', 'Initial Authorizer'],
      permissionsForFacility: ['DSQA'],
    },
    LookupType.Location,
  )
  @ApiOkResponse({
    description: 'Deletes a QA Certification Event from the workspace',
  })
  @AuditLog({
    label: 'Deleted QA certification event by ID for location',
    requestParamsOutFields: ['locId', 'id']
  })
  async deleteTestExtensionExemption(
    @Param('locId') _locationId: string,
    @Param('id') id: string,
    @User() _user: CurrentUser,
  ): Promise<void> {
    return this.service.deleteQACertEvent(id);
  }
}
