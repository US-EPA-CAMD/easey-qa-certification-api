import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiCreatedResponse, ApiOkResponse,
  ApiSecurity,
  ApiTags, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { AuditLog, RoleGuard, User } from '@us-epa-camd/easey-common/decorators';
import { HgSummaryBaseDTO, HgSummaryDTO } from '../dto/hg-summary.dto';
import { HgSummaryWorkspaceService } from './hg-summary-workspace.service';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';
import { LookupType } from '@us-epa-camd/easey-common/enums';
import { ApiExcludeControllerByEnv } from '../decorators/swagger-decorator';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Hg Summary')
@ApiExcludeControllerByEnv()
@ApiExtraModels(HgSummaryDTO)
export class HgSummaryWorkspaceController {
  constructor(private readonly service: HgSummaryWorkspaceService) { }

  @Get()
  @ApiOkResponse({
    description: 'Retrieves workspace Hg Summary records by Test Summary Id',
    content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(HgSummaryDTO) },
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
    label: 'Retrieved Hg summary records for test summary',
    requestParamsOutFields: ['locId', 'testSumId']
  })
  async getHgSummaries(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
  ): Promise<ArrayResponse<HgSummaryDTO>> {
    const hgSummaryDTOS =  await this.service.getHgSummaries(testSumId);

    return  {
      items: hgSummaryDTOS
    };
  }

  @Get(':id')
  @ApiOkResponse({
    isArray: false,
    type: HgSummaryDTO,
    description: 'Retrieves workspace Hg Summary record by its Id',
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
    label: 'Retrieved Hg summary record by ID for test summary',
    requestParamsOutFields: ['locId', 'testSumId', 'id']
  })
  async getHgSummary(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('id') id: string,
  ): Promise<HgSummaryDTO> {
    return this.service.getHgSummary(id, testSumId);
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
    type: HgSummaryDTO,
    description: 'Creates a workspace Hg Summary record.',
  })
  @AuditLog({
    label: 'Created Hg summary record for test summary',
    requestParamsOutFields: ['locId', 'testSumId'],
    responseBodyOutFields: '*'
  })
  createHgSummary(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Body() payload: HgSummaryBaseDTO,
    @User() user: CurrentUser,
  ): Promise<HgSummaryDTO> {
    return this.service.createHgSummary(testSumId, payload, user.userId);
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
    type: HgSummaryDTO,
    description: 'Updates a workspace Hg Summary record.',
  })
  @AuditLog({
    label: 'Updated Hg summary record by ID for test summary',
    requestParamsOutFields: ['locId', 'testSumId', 'id'],
    responseBodyOutFields: '*'
  })
  updateHgSummary(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('id') id: string,
    @Body() payload: HgSummaryBaseDTO,
    @User() user: CurrentUser,
  ): Promise<HgSummaryDTO> {
    return this.service.updateHgSummary(testSumId, id, payload, user.userId);
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
    description: 'Deletes a workspace Hg Summary record.',
  })
  @AuditLog({
    label: 'Deleted Hg summary record by ID for test summary',
    requestParamsOutFields: ['locId', 'testSumId', 'id']
  })
  async deleteHgSummary(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('id') id: string,
    @User() user: CurrentUser,
  ): Promise<void> {
    return this.service.deleteHgSummary(testSumId, id, user.userId);
  }
}
