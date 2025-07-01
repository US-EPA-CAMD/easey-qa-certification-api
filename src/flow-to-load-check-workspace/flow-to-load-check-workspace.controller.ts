import {
  Controller,
  Param,
  Post,
  Body,
  Get,
  Delete,
  Put,
} from '@nestjs/common';
import {
  ApiCreatedResponse, ApiOkResponse,
  ApiSecurity,
  ApiTags, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { AuditLog, RoleGuard, User } from '@us-epa-camd/easey-common/decorators';
import { CurrentUser } from '@us-epa-camd/easey-common/interfaces';
import { FlowToLoadCheckWorkspaceService } from './flow-to-load-check-workspace.service';
import {
  FlowToLoadCheckBaseDTO,
  FlowToLoadCheckDTO,
  FlowToLoadCheckRecordDTO,
} from '../dto/flow-to-load-check.dto';
import { LookupType } from '@us-epa-camd/easey-common/enums';
import { ApiExcludeControllerByEnv } from '../decorators/swagger-decorator';
import { ArrayResponse } from '@us-epa-camd/easey-common/interfaces/common.interface';

@Controller()
@ApiSecurity('APIKey')
@ApiTags('Flow To Load Check')
@ApiExcludeControllerByEnv()
@ApiExtraModels(FlowToLoadCheckRecordDTO)
export class FlowToLoadCheckWorkspaceController {
  constructor(private readonly service: FlowToLoadCheckWorkspaceService) { }

  @Get()
  @ApiOkResponse({
    description:
      'Retrieves workspace Flow To Load Check records by Test Summary Id',
    content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(FlowToLoadCheckRecordDTO) },
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
    label: 'Retrieved flow to load check records for test summary',
    requestParamsOutFields: ['locId', 'testSumId']
  })
  async getFlowToLoadChecks(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
  ): Promise<ArrayResponse<FlowToLoadCheckRecordDTO>> {
    const flowToLoadCheckRecords = await this.service.getFlowToLoadChecks(testSumId);
    return { items: flowToLoadCheckRecords };
  }

  @Get(':id')
  @ApiOkResponse({
    isArray: false,
    type: FlowToLoadCheckRecordDTO,
    description: 'Retrieves a workspace Flow To Load Check record by its Id',
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
    label: 'Retrieved flow to load check record by ID for test summary',
    requestParamsOutFields: ['locId', 'testSumId', 'id']
  })
  async getFlowToLoadCheck(
    @Param('locId') _locationId: string,
    @Param('testSumId') _testSumId: string,
    @Param('id') id: string,
  ): Promise<FlowToLoadCheckRecordDTO> {
    return this.service.getFlowToLoadCheck(id);
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
    type: FlowToLoadCheckRecordDTO,
    description: 'Creates a workspace Flow To Load Check record.',
  })
  @AuditLog({
    label: 'Created flow to load check record for test summary',
    requestParamsOutFields: ['locId', 'testSumId'],
    responseBodyOutFields: '*'
  })
  async createFlowToLoadCheck(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Body() payload: FlowToLoadCheckBaseDTO,
    @User() user: CurrentUser,
  ): Promise<FlowToLoadCheckRecordDTO> {
    return this.service.createFlowToLoadCheck(testSumId, payload, user.userId);
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
    type: FlowToLoadCheckDTO,
    description: 'Updates a workspace Flow To Load Check record',
  })
  @AuditLog({
    label: 'Updated flow to load check record by ID for test summary',
    requestParamsOutFields: ['locId', 'testSumId', 'id'],
    responseBodyOutFields: '*'
  })
  editFlowToLoadCheck(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('id') id: string,
    @Body() payload: FlowToLoadCheckBaseDTO,
    @User() user: CurrentUser,
  ): Promise<FlowToLoadCheckDTO> {
    return this.service.editFlowToLoadCheck(
      testSumId,
      id,
      payload,
      user.userId,
      false,
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
    description: 'Deletes a Flow To Load Check record from the workspace',
  })
  @AuditLog({
    label: 'Deleted flow to load check record by ID for test summary',
    requestParamsOutFields: ['locId', 'testSumId', 'id']
  })
  async deleteFlowToLoadCheck(
    @Param('locId') _locationId: string,
    @Param('testSumId') testSumId: string,
    @Param('id') id: string,
    @User() user: CurrentUser,
  ): Promise<void> {
    return this.service.deleteFlowToLoadCheck(
      testSumId,
      id,
      user.userId,
      false,
    );
  }
}
