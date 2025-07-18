import {
  Controller,
  Param,
  Post,
  Body,
  Get,
  Put,
  Delete,
} from '@nestjs/common';
import {
  ApiCreatedResponse, ApiOkResponse,
  ApiSecurity,
  ApiTags, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { AuditLog, RoleGuard, User } from '@us-epa-camd/easey-common/decorators';
import { LookupType } from '@us-epa-camd/easey-common/enums';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';

import {
  FlowToLoadReferenceBaseDTO,
  FlowToLoadReferenceDTO,
} from '../dto/flow-to-load-reference.dto';
import { FlowToLoadReferenceWorkspaceService } from './flow-to-load-reference-workspace.service';
import { ApiExcludeControllerByEnv } from '../decorators/swagger-decorator';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Flow To Load Reference')
@ApiExcludeControllerByEnv()
@ApiExtraModels(FlowToLoadReferenceDTO)
export class FlowToLoadReferenceWorkspaceController {
  constructor(private readonly service: FlowToLoadReferenceWorkspaceService) { }

  @Get()
  @ApiOkResponse({
    description:
      'Retrieves workspace Flow To Load Reference records by Test Summary Id',
    content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(FlowToLoadReferenceDTO) },
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
    label: 'Retrieved flow to load reference records for test summary',
    requestParamsOutFields: ['locId', 'testSumId']
  })
  async getFlowToLoadReferences(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
  ): Promise<ArrayResponse<FlowToLoadReferenceDTO>> {
    const flowToLoadReferences = await this.service.getFlowToLoadReferences(testSumId);
    return { items: flowToLoadReferences };
  }

  @Get(':id')
  @ApiOkResponse({
    isArray: false,
    type: FlowToLoadReferenceDTO,
    description:
      'Retrieves a workspace Flow To Load Reference record by its Id',
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
    label: 'Retrieved flow to load reference record by ID for test summary',
    requestParamsOutFields: ['locId', 'testSumId', 'id']
  })
  async getFlowToLoadReference(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('id') id: string,
  ): Promise<FlowToLoadReferenceDTO> {
    return this.service.getFlowToLoadReference(id);
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
    type: FlowToLoadReferenceDTO,
    description: 'Creates a workspace Flow To Load Reference record.',
  })
  @AuditLog({
    label: 'Created flow to load reference record for test summary',
    requestParamsOutFields: ['locId', 'testSumId'],
    responseBodyOutFields: '*'
  })
  async createFlowToLoadReference(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Body() payload: FlowToLoadReferenceBaseDTO,
    @User() user: CurrentUser,
  ): Promise<FlowToLoadReferenceDTO> {
    return this.service.createFlowToLoadReference(
      testSumId,
      payload,
      user.userId,
    );
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
    type: FlowToLoadReferenceDTO,
    description: 'Updates a workspace Flow To Load Reference record',
  })
  @AuditLog({
    label: 'Updated flow to load reference record by ID for test summary',
    requestParamsOutFields: ['locId', 'testSumId', 'id'],
    responseBodyOutFields: '*'
  })
  editFlowToLoadReference(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('id') id: string,
    @Body() payload: FlowToLoadReferenceBaseDTO,
    @User() user: CurrentUser,
  ): Promise<FlowToLoadReferenceDTO> {
    return this.service.editFlowToLoadReference(
      testSumId,
      id,
      payload,
      user.userId,
    );
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
    description: 'Deletes a Flow To Load Reference record from the workspace',
  })
  @AuditLog({
    label: 'Deleted flow to load reference record by ID for test summary',
    requestParamsOutFields: ['locId', 'testSumId', 'id']
  })
  async deleteFlowToLoadReference(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('id') id: string,
    @User() user: CurrentUser,
  ): Promise<void> {
    return this.service.deleteFlowToLoadReference(testSumId, id, user.userId);
  }
}
